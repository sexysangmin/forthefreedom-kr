const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Activity } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 업로드 디렉토리 생성
const uploadDir = '/app/uploads';
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
        const baseName = path.basename(safeName, ext) || 'activity';
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 제한
    },
    fileFilter: function (req, file, cb) {
        const allowedMimes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
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

// 활동자료 목록 조회
router.get('/', getAll(Activity, '활동자료'));

// 활동자료 단일 조회
router.get('/:id', getById(Activity, '활동자료'));

// 활동자료 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('🔍 활동자료 생성 요청 받음');
        console.log('📋 요청 데이터:', req.body);
        console.log('📁 첨부파일:', req.files ? req.files.length : 0);
        
        const activityData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '활동팀',
            status: req.body.status || 'published',
            activityType: req.body.activityType || 'photo',
            youtubeUrl: req.body.youtubeUrl || '',
            eventDate: req.body.eventDate ? new Date(req.body.eventDate) : new Date(),
            location: req.body.location || ''
        };

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                activityData.tags = req.body.tags;
            } else {
                activityData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        // 첨부파일 정보 처리
        if (req.files && req.files.length > 0) {
            activityData.attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
        }

        const activity = new Activity(activityData);
        await activity.save();

        console.log('✅ 활동자료 저장 성공:', activity._id);

        res.status(201).json({
            success: true,
            data: activity,
            message: '새로운 활동자료가 생성되었습니다'
        });
    } catch (error) {
        console.error('❌ 활동자료 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '활동자료 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 활동자료 수정 (파일 업로드 포함)
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔄 활동자료 수정 요청:', id);
        console.log('📋 수정 데이터:', req.body);
        console.log('📁 새 첨부파일:', req.files ? req.files.length : 0);
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '활동팀',
            status: req.body.status || 'published',
            activityType: req.body.activityType || 'photo',
            youtubeUrl: req.body.youtubeUrl || '',
            location: req.body.location || ''
        };

        // 활동 일자 처리
        if (req.body.eventDate) {
            updateData.eventDate = new Date(req.body.eventDate);
        }

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                updateData.tags = req.body.tags;
            } else {
                updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        // 기존 첨부파일 처리
        const existingActivity = await Activity.findById(id);
        if (!existingActivity) {
            return res.status(404).json({
                success: false,
                message: '활동자료를 찾을 수 없습니다'
            });
        }

        // 기존 첨부파일 유지 (삭제된 것 제외)
        let existingAttachments = existingActivity.attachments || [];
        
        // existingAttachments 파라미터가 있으면 처리
        if (req.body.existingAttachments) {
            try {
                const keepAttachments = JSON.parse(req.body.existingAttachments);
                existingAttachments = keepAttachments;
            } catch (e) {
                console.warn('기존 첨부파일 파싱 오류:', e);
            }
        }
        
        // 새로운 첨부파일 추가
        if (req.files && req.files.length > 0) {
            const newAttachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));

            updateData.attachments = [...existingAttachments, ...newAttachments];
        } else {
            updateData.attachments = existingAttachments;
        }

        const activity = await Activity.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('✅ 활동자료 수정 성공:', activity._id);

        res.json({
            success: true,
            data: activity,
            message: '활동자료가 수정되었습니다'
        });
    } catch (error) {
        console.error('❌ 활동자료 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '활동자료 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 활동자료 삭제
router.delete('/:id', deleteById(Activity, '활동자료'));

module.exports = router; 