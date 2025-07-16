const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
// MongoDB 모델 활성화
const { Notice } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

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
        // 파일명 중복 방지를 위해 타임스탬프 추가
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        
        // 한글 파일명을 영문으로 변환하거나 안전한 파일명 생성
        const safeName = file.originalname
            .replace(/[^\w\s.-]/g, '') // 특수문자 제거
            .replace(/\s+/g, '-')      // 공백을 하이픈으로
            .replace(/^[-]+|[-]+$/g, '') // 앞뒤 하이픈 제거
            .toLowerCase();
            
        const baseName = path.basename(safeName, ext) || 'uploaded-file';
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 제한
    },
    fileFilter: function (req, file, cb) {
        // 허용할 파일 형식
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

// 공지사항 목록 조회
router.get('/', getAll(Notice));

// 공지사항 단일 조회
router.get('/:id', getById(Notice));

// 🖼️ 이미지 전용 업로드 엔드포인트 (에디터용)
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        console.log('📸 이미지 업로드 요청 받음');
        console.log('📁 파일 정보:', req.file ? req.file.filename : '파일 없음');
        
        if (!req.file) {
            console.log('❌ 파일이 없습니다');
            return res.status(400).json({
                success: false,
                message: '이미지 파일이 필요합니다'
            });
        }

        // 업로드된 파일 정보 반환
        const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        
        console.log('✅ 이미지 업로드 성공:', imageUrl);
        
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

// 공지사항 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const { title, content, category, author, excerpt, tags, isImportant } = req.body;

        // 첨부파일 정보 처리
        const attachments = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            uploadDate: new Date()
        })) : [];

        const noticeData = {
            title,
            content,
            category,
            author: author || '관리자',
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isImportant: isImportant === 'true' || isImportant === true,
            attachments,
            status: 'published',
            publishDate: new Date()
        };

        const notice = new Notice(noticeData);
        await notice.save();

        res.status(201).json({
            success: true,
            data: notice,
            message: '새로운 공지사항이 생성되었습니다'
        });
    } catch (error) {
        console.error('공지사항 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지사항 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 공지사항 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const { title, content, category, author, excerpt, tags, isImportant } = req.body;

        const updateData = {
            title,
            content,
            category,
            author: author || '관리자',
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isImportant: isImportant === 'true' || isImportant === true,
            updatedAt: new Date()
        };

        // 새로운 첨부파일이 있는 경우 추가
        if (req.files && req.files.length > 0) {
            const newAttachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                uploadDate: new Date()
            }));
            
            // 기존 첨부파일에 새 파일 추가
            const existingNotice = await Notice.findById(req.params.id);
            updateData.attachments = [
                ...(existingNotice.attachments || []),
                ...newAttachments
            ];
        }

        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: '공지사항을 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: notice,
            message: '공지사항이 수정되었습니다'
        });
    } catch (error) {
        console.error('공지사항 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지사항 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 공지사항 삭제
router.delete('/:id', deleteById(Notice));

module.exports = router; 