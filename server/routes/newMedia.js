const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { NewMedia } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 업로드 디렉토리 생성
const uploadDir = process.env.UPLOADS_PATH || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정 (미디어 파일 지원)
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
        const baseName = path.basename(safeName, ext) || 'uploaded-file';
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB 제한 (영상 파일 고려)
    fileFilter: function (req, file, cb) {
        const allowedMimes = [
            // 이미지
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            // 비디오
            'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
            // 오디오
            'audio/mpeg', 'audio/wav', 'audio/mp3',
            // 문서
            'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.hancom.hwp', 'text/plain'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
        }
    }
});

// 뉴미디어 콘텐츠 목록 조회
router.get('/', getAll(NewMedia));

// 뉴미디어 콘텐츠 단일 조회
router.get('/:id', getById(NewMedia));

// 이미지 업로드 엔드포인트
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '이미지 파일이 필요합니다'
            });
        }

        const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                imageUrl: imageUrl,
                size: req.file.size,
                mimeType: req.file.mimetype
            },
            message: '이미지 업로드 완료'
        });
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '이미지 업로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 뉴미디어 콘텐츠 생성
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const newMediaData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            mediaType: req.body.mediaType,
            platform: req.body.platform,
            dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : {},
            youtubeUrl: req.body.youtubeUrl || '',
            socialMediaLinks: req.body.socialMediaLinks ? JSON.parse(req.body.socialMediaLinks) : [],
            hashtags: req.body.hashtags ? JSON.parse(req.body.hashtags) : [],
            targetAudience: req.body.targetAudience || '일반',
            publishSchedule: req.body.publishSchedule ? new Date(req.body.publishSchedule) : null,
            engagement: req.body.engagement ? JSON.parse(req.body.engagement) : {},
            priority: parseInt(req.body.priority) || 0,
            author: req.body.author || '뉴미디어팀',
            designer: req.body.designer || '',
            status: req.body.status || 'published',
            isPromoted: req.body.isPromoted === 'true',
            analytics: req.body.analytics ? JSON.parse(req.body.analytics) : {}
        };

        // 첨부파일 처리 (미디어 파일 포함)
        if (req.files && req.files.length > 0) {
            newMediaData.attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype,
                thumbnailPath: '' // 썸네일은 별도 처리 가능
            }));
        }

        const newMedia = new NewMedia(newMediaData);
        await newMedia.save();

        res.status(201).json({
            success: true,
            data: newMedia,
            message: '뉴미디어 콘텐츠가 성공적으로 생성되었습니다'
        });
    } catch (error) {
        console.error('뉴미디어 콘텐츠 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '뉴미디어 콘텐츠 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 뉴미디어 콘텐츠 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            mediaType: req.body.mediaType,
            platform: req.body.platform,
            dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : undefined,
            youtubeUrl: req.body.youtubeUrl,
            socialMediaLinks: req.body.socialMediaLinks ? JSON.parse(req.body.socialMediaLinks) : undefined,
            hashtags: req.body.hashtags ? JSON.parse(req.body.hashtags) : undefined,
            targetAudience: req.body.targetAudience,
            publishSchedule: req.body.publishSchedule ? new Date(req.body.publishSchedule) : undefined,
            engagement: req.body.engagement ? JSON.parse(req.body.engagement) : undefined,
            priority: req.body.priority ? parseInt(req.body.priority) : undefined,
            author: req.body.author,
            designer: req.body.designer,
            status: req.body.status,
            isPromoted: req.body.isPromoted === 'true',
            analytics: req.body.analytics ? JSON.parse(req.body.analytics) : undefined
        };

        // undefined 값 제거
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // 새 첨부파일이 있으면 추가
        if (req.files && req.files.length > 0) {
            const newAttachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype,
                thumbnailPath: ''
            }));

            if (req.body.replaceAttachments === 'true') {
                updateData.attachments = newAttachments;
            } else {
                const newMedia = await NewMedia.findById(req.params.id);
                updateData.attachments = [...(newMedia.attachments || []), ...newAttachments];
            }
        }

        const newMedia = await NewMedia.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!newMedia) {
            return res.status(404).json({
                success: false,
                message: '뉴미디어 콘텐츠를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: newMedia,
            message: '뉴미디어 콘텐츠가 성공적으로 수정되었습니다'
        });
    } catch (error) {
        console.error('뉴미디어 콘텐츠 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '뉴미디어 콘텐츠 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 뉴미디어 콘텐츠 삭제
router.delete('/:id', deleteById(NewMedia));

// 조회수 증가
router.post('/:id/view', async (req, res) => {
    try {
        await NewMedia.findByIdAndUpdate(req.params.id, { 
            $inc: { 'engagement.views': 1 } 
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 분석 데이터 업데이트
router.put('/:id/analytics', async (req, res) => {
    try {
        const { impressions, clicks, reach, likes, shares, comments } = req.body;
        
        const updateData = {};
        if (impressions !== undefined) updateData['analytics.impressions'] = impressions;
        if (clicks !== undefined) updateData['analytics.clicks'] = clicks;
        if (reach !== undefined) updateData['analytics.reach'] = reach;
        if (likes !== undefined) updateData['engagement.likes'] = likes;
        if (shares !== undefined) updateData['engagement.shares'] = shares;
        if (comments !== undefined) updateData['engagement.comments'] = comments;

        const newMedia = await NewMedia.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!newMedia) {
            return res.status(404).json({
                success: false,
                message: '뉴미디어 콘텐츠를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: newMedia,
            message: '분석 데이터가 업데이트되었습니다'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: '분석 데이터 업데이트 중 오류가 발생했습니다',
            error: error.message 
        });
    }
});

module.exports = router; 