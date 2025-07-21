const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { PolicyCommittee } = require('../models');
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
        const baseName = path.basename(safeName, ext) || 'uploaded-file';
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
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

// 정책위원회 활동 목록 조회
router.get('/', getAll(PolicyCommittee));

// 정책위원회 활동 단일 조회
router.get('/:id', getById(PolicyCommittee));

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

// 정책위원회 활동 생성
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const policyCommitteeData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            policyArea: req.body.policyArea,
            committeeName: req.body.committeeName || '정책위원회',
            chairperson: req.body.chairperson || '',
            participants: req.body.participants ? JSON.parse(req.body.participants) : [],
            meetingDate: req.body.meetingDate ? new Date(req.body.meetingDate) : new Date(),
            location: req.body.location || '',
            agenda: req.body.agenda ? JSON.parse(req.body.agenda) : [],
            decisions: req.body.decisions ? JSON.parse(req.body.decisions) : [],
            priority: parseInt(req.body.priority) || 0,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            author: req.body.author || '정책위원회',
            relatedPolicies: req.body.relatedPolicies ? JSON.parse(req.body.relatedPolicies) : [],
            status: req.body.status || 'published',
            isConfidential: req.body.isConfidential === 'true'
        };

        // 첨부파일 처리
        if (req.files && req.files.length > 0) {
            policyCommitteeData.attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
        }

        const policyCommittee = new PolicyCommittee(policyCommitteeData);
        await policyCommittee.save();

        res.status(201).json({
            success: true,
            data: policyCommittee,
            message: '정책위원회 활동이 성공적으로 생성되었습니다'
        });
    } catch (error) {
        console.error('정책위원회 활동 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '정책위원회 활동 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 정책위원회 활동 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            policyArea: req.body.policyArea,
            committeeName: req.body.committeeName,
            chairperson: req.body.chairperson,
            participants: req.body.participants ? JSON.parse(req.body.participants) : undefined,
            meetingDate: req.body.meetingDate ? new Date(req.body.meetingDate) : undefined,
            location: req.body.location,
            agenda: req.body.agenda ? JSON.parse(req.body.agenda) : undefined,
            decisions: req.body.decisions ? JSON.parse(req.body.decisions) : undefined,
            priority: req.body.priority ? parseInt(req.body.priority) : undefined,
            tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
            author: req.body.author,
            relatedPolicies: req.body.relatedPolicies ? JSON.parse(req.body.relatedPolicies) : undefined,
            status: req.body.status,
            isConfidential: req.body.isConfidential === 'true'
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
                mimeType: file.mimetype
            }));

            if (req.body.replaceAttachments === 'true') {
                updateData.attachments = newAttachments;
            } else {
                const policyCommittee = await PolicyCommittee.findById(req.params.id);
                updateData.attachments = [...(policyCommittee.attachments || []), ...newAttachments];
            }
        }

        const policyCommittee = await PolicyCommittee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!policyCommittee) {
            return res.status(404).json({
                success: false,
                message: '정책위원회 활동을 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: policyCommittee,
            message: '정책위원회 활동이 성공적으로 수정되었습니다'
        });
    } catch (error) {
        console.error('정책위원회 활동 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '정책위원회 활동 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 정책위원회 활동 삭제
router.delete('/:id', deleteById(PolicyCommittee));

// 조회수 증가
router.post('/:id/view', async (req, res) => {
    try {
        await PolicyCommittee.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router; 