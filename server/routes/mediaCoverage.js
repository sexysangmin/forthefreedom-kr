const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { MediaCoverage } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 업로드 디렉토리 생성
const uploadDir = process.env.UPLOADS_PATH || path.join(__dirname, '../uploads');
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
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB 제한
    fileFilter: function (req, file, cb) {
        const allowedMimes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.hancom.hwp', 'text/plain',
            'video/mp4', 'audio/mpeg' // 방송 영상/음성
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
        }
    }
});

// 언론보도 목록 조회
router.get('/', getAll(MediaCoverage));

// 언론보도 단일 조회
router.get('/:id', getById(MediaCoverage));

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

// 언론보도 생성
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const mediaCoverageData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            mediaOutlet: req.body.mediaOutlet,
            mediaType: req.body.mediaType,
            journalist: req.body.journalist || '',
            program: req.body.program || '',
            broadcastDate: req.body.broadcastDate ? new Date(req.body.broadcastDate) : new Date(),
            broadcastTime: req.body.broadcastTime || '',
            category: req.body.category,
            tone: req.body.tone || '중립',
            importance: req.body.importance || '중',
            originalUrl: req.body.originalUrl || '',
            archiveUrl: req.body.archiveUrl || '',
            keywords: req.body.keywords ? JSON.parse(req.body.keywords) : [],
            mentionedPersons: req.body.mentionedPersons ? JSON.parse(req.body.mentionedPersons) : [],
            relatedTopics: req.body.relatedTopics ? JSON.parse(req.body.relatedTopics) : [],
            summary: req.body.summary || '',
            impact: req.body.impact || '보통',
            sentiment: req.body.sentiment ? JSON.parse(req.body.sentiment) : {},
            priority: parseInt(req.body.priority) || 0,
            author: req.body.author || '미디어팀',
            screenshots: req.body.screenshots ? JSON.parse(req.body.screenshots) : [],
            status: req.body.status || 'published',
            isBreaking: req.body.isBreaking === 'true',
            responseRequired: req.body.responseRequired === 'true',
            responseNote: req.body.responseNote || ''
        };

        // 첨부파일 처리
        if (req.files && req.files.length > 0) {
            mediaCoverageData.attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
        }

        const mediaCoverage = new MediaCoverage(mediaCoverageData);
        await mediaCoverage.save();

        res.status(201).json({
            success: true,
            data: mediaCoverage,
            message: '언론보도가 성공적으로 생성되었습니다'
        });
    } catch (error) {
        console.error('언론보도 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '언론보도 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 언론보도 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            mediaOutlet: req.body.mediaOutlet,
            mediaType: req.body.mediaType,
            journalist: req.body.journalist,
            program: req.body.program,
            broadcastDate: req.body.broadcastDate ? new Date(req.body.broadcastDate) : undefined,
            broadcastTime: req.body.broadcastTime,
            category: req.body.category,
            tone: req.body.tone,
            importance: req.body.importance,
            originalUrl: req.body.originalUrl,
            archiveUrl: req.body.archiveUrl,
            keywords: req.body.keywords ? JSON.parse(req.body.keywords) : undefined,
            mentionedPersons: req.body.mentionedPersons ? JSON.parse(req.body.mentionedPersons) : undefined,
            relatedTopics: req.body.relatedTopics ? JSON.parse(req.body.relatedTopics) : undefined,
            summary: req.body.summary,
            impact: req.body.impact,
            sentiment: req.body.sentiment ? JSON.parse(req.body.sentiment) : undefined,
            priority: req.body.priority ? parseInt(req.body.priority) : undefined,
            author: req.body.author,
            screenshots: req.body.screenshots ? JSON.parse(req.body.screenshots) : undefined,
            status: req.body.status,
            isBreaking: req.body.isBreaking === 'true',
            responseRequired: req.body.responseRequired === 'true',
            responseNote: req.body.responseNote
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
                const mediaCoverage = await MediaCoverage.findById(req.params.id);
                updateData.attachments = [...(mediaCoverage.attachments || []), ...newAttachments];
            }
        }

        const mediaCoverage = await MediaCoverage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!mediaCoverage) {
            return res.status(404).json({
                success: false,
                message: '언론보도를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: mediaCoverage,
            message: '언론보도가 성공적으로 수정되었습니다'
        });
    } catch (error) {
        console.error('언론보도 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '언론보도 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 언론보도 삭제
router.delete('/:id', deleteById(MediaCoverage));

// 조회수 증가
router.post('/:id/view', async (req, res) => {
    try {
        await MediaCoverage.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 언론사별 통계
router.get('/stats/outlets', async (req, res) => {
    try {
        const stats = await MediaCoverage.aggregate([
            {
                $group: {
                    _id: '$mediaOutlet',
                    count: { $sum: 1 },
                    positiveCount: {
                        $sum: {
                            $cond: [{ $eq: ['$tone', '긍정'] }, 1, 0]
                        }
                    },
                    negativeCount: {
                        $sum: {
                            $cond: [{ $eq: ['$tone', '부정'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: stats,
            message: '언론사별 통계를 가져왔습니다'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '통계 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 감정 분석 통계
router.get('/stats/sentiment', async (req, res) => {
    try {
        const stats = await MediaCoverage.aggregate([
            {
                $group: {
                    _id: '$tone',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats,
            message: '감정 분석 통계를 가져왔습니다'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '감정 분석 통계 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

module.exports = router; 