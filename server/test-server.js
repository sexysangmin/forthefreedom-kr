const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 9000;

// CORS 설정 (모든 출처 허용)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 uploads 디렉토리 생성됨');
}

// 정적 파일 제공
app.use('/uploads', express.static(uploadDir));

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `uploaded-image-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
        }
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: '테스트 서버가 정상 작동 중입니다',
        timestamp: new Date().toISOString()
    });
});

// 이미지 업로드 엔드포인트
app.post('/api/notices/upload-image', upload.single('image'), (req, res) => {
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

        const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        
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
        console.error('❌ 이미지 업로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '이미지 업로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 테스트 서버가 포트 ${PORT}에서 시작되었습니다`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📸 이미지 업로드: http://localhost:${PORT}/api/notices/upload-image`);
}); 