const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Gallery } = require('../models');
const { getById, deleteById } = require('../controllers/baseController');

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const safeName = file.originalname
            .replace(/[^\w\s.-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^[-]+|[-]+$/g, '')
            .toLowerCase();
        const baseName = path.basename(safeName, ext) || 'gallery';
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB 제한
    },
    fileFilter: function (req, file, cb) {
        const allowedMimes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다. 이미지 파일만 업로드 가능합니다.'), false);
        }
    }
});

// 포토갤러리 목록 조회
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            status = 'published',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            dateFilter = ''
        } = req.query;

        console.log('🔍 Gallery API 요청 파라미터:');
        console.log('category:', category, typeof category);
        console.log('search:', search, typeof search);
        console.log('dateFilter:', dateFilter, typeof dateFilter);
        console.log('page:', page, typeof page);
        console.log('limit:', limit, typeof limit);

        // 검색 조건 구성
        const searchConditions = {
            status: status === 'all' ? { $in: ['draft', 'published'] } : status
        };

        if (search) {
            searchConditions.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== '') {
            searchConditions.category = category;
        }

        // 날짜 필터 처리
        if (dateFilter) {
            const now = new Date();
            let startDate;
            
            switch (dateFilter) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case '3months':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
            }
            
            if (startDate) {
                searchConditions.createdAt = { $gte: startDate };
            }
        }

        console.log('🔍 최종 검색 조건:', JSON.stringify(searchConditions, null, 2));

        // 정렬 설정
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // 페이징 계산
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 데이터 조회
        const [items, total] = await Promise.all([
            Gallery.find(searchConditions)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit)),
            Gallery.countDocuments(searchConditions)
        ]);

        console.log(`📊 조회 결과: ${items.length}개 항목 (총 ${total}개)`);

        // 이미지 URL을 절대 경로로 변환
        const baseURL = process.env.NODE_ENV === 'production' 
            ? 'https://forthefreedom.kr' 
            : 'http://localhost:9000';

        const transformedItems = items.map(item => {
            const itemObj = item.toObject();
            
            // attachments의 path를 절대 URL로 변환
            if (itemObj.attachments && itemObj.attachments.length > 0) {
                itemObj.attachments = itemObj.attachments.map(attachment => ({
                    ...attachment,
                    url: attachment.path.startsWith('http') 
                        ? attachment.path 
                        : `${baseURL}${attachment.path}?t=${Date.now()}`
                }));
                
                // 첫 번째 이미지를 썸네일과 메인 이미지로 설정
                itemObj.thumbnailUrl = itemObj.attachments[0].url;
                itemObj.imageUrl = itemObj.attachments[0].url;
            }
            
            return itemObj;
        });

        // 응답 데이터 구성
        const response = {
            success: true,
            data: transformedItems,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total,
                hasNext: skip + items.length < total,
                hasPrev: parseInt(page) > 1
            },
            message: items.length > 0 
                ? '포토갤러리 목록을 조회했습니다' 
                : '등록된 포토갤러리가 없습니다. 새로운 포토갤러리가 등록되면 여기에 표시됩니다'
        };

        res.json(response);
    } catch (error) {
        console.error('포토갤러리 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '포토갤러리 목록 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 포토갤러리 단일 조회
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const item = await Gallery.findById(id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: '포토갤러리를 찾을 수 없습니다'
            });
        }

        // 조회수 증가
        await Gallery.findByIdAndUpdate(id, { $inc: { views: 1 } });

        // 이미지 URL을 절대 경로로 변환
        const baseURL = process.env.NODE_ENV === 'production' 
            ? 'https://forthefreedom.kr' 
            : 'http://localhost:9000';

        const itemObj = item.toObject();
        
        // attachments의 path를 절대 URL로 변환
        if (itemObj.attachments && itemObj.attachments.length > 0) {
            itemObj.attachments = itemObj.attachments.map(attachment => ({
                ...attachment,
                url: attachment.path.startsWith('http') 
                    ? attachment.path 
                    : `${baseURL}${attachment.path}?t=${Date.now()}`
            }));
            
            // 첫 번째 이미지를 썸네일과 메인 이미지로 설정
            itemObj.thumbnailUrl = itemObj.attachments[0].url;
            itemObj.imageUrl = itemObj.attachments[0].url;
        }

        res.json({
            success: true,
            data: itemObj,
            message: '포토갤러리를 조회했습니다'
        });
    } catch (error) {
        console.error('포토갤러리 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '포토갤러리 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 포토갤러리 생성
router.post('/', upload.array('attachments', 30), async (req, res) => {
    try {
        const galleryData = { ...req.body };
        
        // 이미지 개수 처리
        if (galleryData.imageCount) {
            galleryData.imageCount = parseInt(galleryData.imageCount);
        }
        
        // 태그 처리
        if (galleryData.tags && typeof galleryData.tags === 'string') {
            galleryData.tags = galleryData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // 첨부파일 처리
        if (req.files && req.files.length > 0) {
            galleryData.attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: `/uploads/${file.filename}`
            }));
        }
        
        const gallery = new Gallery(galleryData);
        await gallery.save();
        
        res.status(201).json({
            success: true,
            message: '포토갤러리가 생성되었습니다.',
            data: gallery
        });
    } catch (error) {
        console.error('포토갤러리 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '포토갤러리 생성 중 오류가 발생했습니다'
        });
    }
});

// 포토갤러리 수정
router.put('/:id', upload.array('attachments', 30), async (req, res) => {
    try {
        const galleryData = { ...req.body };
        
        // 이미지 개수 처리
        if (galleryData.imageCount) {
            galleryData.imageCount = parseInt(galleryData.imageCount);
        }
        
        // 태그 처리
        if (galleryData.tags && typeof galleryData.tags === 'string') {
            galleryData.tags = galleryData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // 첨부파일 처리
        if (req.files && req.files.length > 0) {
            const newAttachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: `/uploads/${file.filename}`
            }));
            galleryData.attachments = newAttachments;
        }
        
        const gallery = await Gallery.findByIdAndUpdate(req.params.id, galleryData, { new: true });
        
        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: '포토갤러리를 찾을 수 없습니다.'
            });
        }
        
        res.json({
            success: true,
            message: '포토갤러리가 수정되었습니다.',
            data: gallery
        });
    } catch (error) {
        console.error('포토갤러리 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '포토갤러리 수정 중 오류가 발생했습니다'
        });
    }
});

// 포토갤러리 삭제
router.delete('/:id', deleteById(Gallery, '포토갤러리'));

// 조회수 증가
router.patch('/:id/view', async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: '포토갤러리를 찾을 수 없습니다.'
            });
        }
        
        res.json({
            success: true,
            data: { views: gallery.views }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 