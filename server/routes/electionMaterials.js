const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { ElectionMaterial } = require('../models');
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
        const baseName = path.basename(safeName, ext) || 'election-material';
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

// 선거자료 목록 조회
router.get('/', getAll(ElectionMaterial, '선거자료'));

// 선거자료 단일 조회
router.get('/:id', getById(ElectionMaterial, '선거자료'));

// 선거자료 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        const electionData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '선거대책위원회',
            status: req.body.status || 'published',
            electionYear: req.body.electionYear || new Date().getFullYear(),
            electionType: req.body.electionType
        };

        // 첨부파일 정보 처리
        if (req.files && req.files.length > 0) {
            electionData.attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
        }

        const election = new ElectionMaterial(electionData);
        await election.save();

        res.status(201).json({
            success: true,
            data: election,
            message: '새로운 선거자료가 생성되었습니다'
        });
    } catch (error) {
        console.error('선거자료 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '선거자료 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 선거자료 수정 (파일 업로드 포함)
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '선거대책위원회',
            status: req.body.status || 'published',
            electionYear: req.body.electionYear || new Date().getFullYear(),
            electionType: req.body.electionType
        };

        // 기존 첨부파일 유지하고 새 파일만 추가
        const existingElection = await ElectionMaterial.findById(id);
        const existingAttachments = existingElection.attachments || [];
        
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

        const election = await ElectionMaterial.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!election) {
            return res.status(404).json({
                success: false,
                message: '선거자료를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: election,
            message: '선거자료가 수정되었습니다'
        });
    } catch (error) {
        console.error('선거자료 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '선거자료 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 첨부파일 다운로드
router.get('/:id/attachments/:filename', async (req, res) => {
    try {
        const { id, filename } = req.params;
        
        const election = await ElectionMaterial.findById(id);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: '선거자료를 찾을 수 없습니다'
            });
        }

        const attachment = election.attachments.find(file => file.filename === filename);
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: '첨부파일을 찾을 수 없습니다'
            });
        }

        const filePath = path.join(uploadDir, filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: '파일이 존재하지 않습니다'
            });
        }

        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('파일 다운로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '파일 다운로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 전체 자료 다운로드
router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        
        const election = await ElectionMaterial.findById(id);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: '선거자료를 찾을 수 없습니다'
            });
        }

        if (!election.attachments || election.attachments.length === 0) {
            return res.status(404).json({
                success: false,
                message: '다운로드할 첨부파일이 없습니다'
            });
        }

        // 첫 번째 첨부파일 다운로드
        const attachment = election.attachments[0];
        const filePath = path.join(uploadDir, attachment.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: '파일이 존재하지 않습니다'
            });
        }

        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('전체 다운로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '다운로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 첨부파일 ID 기반 다운로드 (election-material-detail.html용)
router.get('/:id/download/:attachmentId', async (req, res) => {
    try {
        const { id, attachmentId } = req.params;
        
        const election = await ElectionMaterial.findById(id);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: '선거자료를 찾을 수 없습니다'
            });
        }

        // attachmentId로 첨부파일 찾기 (MongoDB ObjectId 또는 filename)
        const attachment = election.attachments.find(file => 
            file._id.toString() === attachmentId || file.filename === attachmentId
        );
        
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: '첨부파일을 찾을 수 없습니다'
            });
        }

        const filePath = path.join(uploadDir, attachment.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: '파일이 존재하지 않습니다'
            });
        }

        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('첨부파일 다운로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '파일 다운로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 다운로드 카운트 업데이트
router.post('/:id/download-count', async (req, res) => {
    try {
        const { id } = req.params;
        
        await ElectionMaterial.findByIdAndUpdate(id, { 
            $inc: { downloadCount: 1 } 
        });

        res.json({
            success: true,
            message: '다운로드 카운트가 업데이트되었습니다'
        });
    } catch (error) {
        console.error('다운로드 카운트 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '다운로드 카운트 업데이트 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 첨부파일 삭제
router.delete('/:id/attachments/:fileId', async (req, res) => {
    try {
        const { id, fileId } = req.params;
        
        const election = await ElectionMaterial.findById(id);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: '선거자료를 찾을 수 없습니다'
            });
        }

        const fileIndex = election.attachments.findIndex(file => 
            file._id.toString() === fileId || file.filename === fileId
        );

        if (fileIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '첨부파일을 찾을 수 없습니다'
            });
        }

        const fileToDelete = election.attachments[fileIndex];
        
        // 실제 파일 삭제
        if (fileToDelete.path && fs.existsSync(fileToDelete.path)) {
            fs.unlinkSync(fileToDelete.path);
        }

        // DB에서 첨부파일 정보 삭제
        election.attachments.splice(fileIndex, 1);
        await election.save();

        res.json({
            success: true,
            message: '첨부파일이 삭제되었습니다'
        });
    } catch (error) {
        console.error('첨부파일 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '첨부파일 삭제 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 선거자료 삭제
router.delete('/:id', deleteById(ElectionMaterial, '선거자료'));

module.exports = router; 