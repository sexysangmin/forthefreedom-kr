const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PressRelease } = require('../models');

// 업로드 디렉토리 확인/생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // 파일명 정리: 특수문자 제거 및 공백을 하이픈으로 변경
        const sanitizedName = file.originalname
            .replace(/[^\w\s.-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
        
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000000000);
        const ext = path.extname(sanitizedName);
        const nameWithoutExt = path.basename(sanitizedName, ext);
        
        cb(null, `${nameWithoutExt}-${timestamp}-${randomNum}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // 허용되는 파일 타입
    const allowedTypes = [
        // 이미지
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        // 문서
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('지원되지 않는 파일 형식입니다.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10 // 최대 10개 파일
    },
    fileFilter: fileFilter
});

// 보도자료 목록 조회
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const query = { status: 'published' };
        
        // 카테고리 필터
        if (req.query.category && req.query.category !== '전체') {
            query.category = req.query.category;
        }
        
        const total = await PressRelease.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        
        const pressReleases = await PressRelease
            .find(query)
            .sort({ priority: -1, releaseDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        res.json({
            success: true,
            data: pressReleases,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('보도자료 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '보도자료 목록을 불러오는데 실패했습니다.',
            error: error.message
        });
    }
});

// 보도자료 단일 조회
router.get('/:id', async (req, res) => {
    try {
        const pressRelease = await PressRelease.findById(req.params.id);
        
        if (!pressRelease) {
            return res.status(404).json({
                success: false,
                message: '보도자료를 찾을 수 없습니다.'
            });
        }
        
        // 조회수 증가
        pressRelease.views += 1;
        await pressRelease.save();
        
        res.json({
            success: true,
            data: pressRelease
        });
    } catch (error) {
        console.error('보도자료 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '보도자료를 불러오는데 실패했습니다.',
            error: error.message
        });
    }
});

// 보도자료 생성
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('📝 보도자료 생성 요청:', req.body);
        console.log('📁 업로드된 파일들:', req.files);
        
        const { title, content, excerpt, category, priority, author, originalUrl, status, releaseDate } = req.body;
        
        // 첨부파일 처리
        const attachments = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: `/uploads/${file.filename}`,
            size: file.size,
            mimeType: file.mimetype
        })) : [];
        
        const pressReleaseData = {
            title,
            content,
            excerpt,
            category,
            priority: priority ? parseInt(priority) : 0,
            author: author || '대변인',
            originalUrl: originalUrl || undefined,
            attachments,
            status: status || 'published',
            releaseDate: releaseDate ? new Date(releaseDate) : new Date()
        };
        
        const pressRelease = new PressRelease(pressReleaseData);
        await pressRelease.save();
        
        console.log('✅ 보도자료 생성 완료:', pressRelease._id);
        
        res.status(201).json({
            success: true,
            message: '보도자료가 성공적으로 생성되었습니다.',
            data: pressRelease
        });
    } catch (error) {
        console.error('보도자료 생성 오류:', error);
        
        // 업로드된 파일들 정리 (에러 발생 시)
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (unlinkError) {
                    console.error('파일 삭제 오류:', unlinkError);
                }
            });
        }
        
        res.status(500).json({
            success: false,
            message: '보도자료 생성에 실패했습니다.',
            error: error.message
        });
    }
});

// 보도자료 수정
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('📝 보도자료 수정 요청 시작');
        console.log('📋 요청 ID:', req.params.id);
        console.log('📋 요청 바디:', req.body);
        console.log('📁 업로드된 파일들:', req.files);
        console.log('📁 파일 개수:', req.files ? req.files.length : 0);
        
        const pressRelease = await PressRelease.findById(req.params.id);
        if (!pressRelease) {
            return res.status(404).json({
                success: false,
                message: '보도자료를 찾을 수 없습니다.'
            });
        }
        
        const { title, content, excerpt, category, priority, author, originalUrl, status, releaseDate, existingAttachments } = req.body;
        
        // 기존 첨부파일 처리 (클라이언트에서 삭제되지 않은 파일들)
        console.log('📎 기존 첨부파일 처리 시작');
        let keptAttachments = [];
        if (existingAttachments) {
            try {
                keptAttachments = JSON.parse(existingAttachments);
                console.log('📎 유지될 기존 첨부파일 개수:', keptAttachments.length);
            } catch (error) {
                console.error('기존 첨부파일 파싱 오류:', error);
                keptAttachments = pressRelease.attachments || [];
            }
        } else {
            keptAttachments = pressRelease.attachments || [];
        }
        
        // 삭제될 파일들 찾기 (실제 파일 시스템에서 삭제용)
        const originalAttachments = pressRelease.attachments || [];
        const filesToDelete = originalAttachments.filter(original => 
            !keptAttachments.some(kept => kept._id === original._id.toString())
        );
        
        if (filesToDelete.length > 0) {
            console.log('🗑️ 삭제될 파일들:', filesToDelete.length, '개');
            filesToDelete.forEach(file => {
                try {
                    const filePath = path.join(__dirname, '..', file.path);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log('🗑️ 파일 삭제 완료:', file.filename);
                    }
                } catch (deleteError) {
                    console.error('파일 삭제 오류:', deleteError);
                }
            });
        }
        
        // 새로운 첨부파일 처리
        console.log('📎 새로운 첨부파일 처리 시작');
        const newAttachments = req.files ? req.files.map(file => {
            console.log('📄 파일 처리:', file.originalname, file.filename, file.path);
            const relativePath = `/uploads/${file.filename}`;
            console.log('📄 상대 경로로 변환:', relativePath);
            return {
                filename: file.filename,
                originalName: file.originalname,
                path: relativePath,
                size: file.size,
                mimeType: file.mimetype
            };
        }) : [];
        
        console.log('📎 새로운 첨부파일 개수:', newAttachments.length);
        
        // 최종 첨부파일 목록 (유지될 기존 파일들 + 새 파일들)
        const updatedAttachments = [...keptAttachments, ...newAttachments];
        console.log('📎 최종 첨부파일 개수:', updatedAttachments.length);
        
        // 보도자료 업데이트
        pressRelease.title = title || pressRelease.title;
        pressRelease.content = content || pressRelease.content;
        pressRelease.excerpt = excerpt || pressRelease.excerpt;
        pressRelease.category = category || pressRelease.category;
        pressRelease.priority = priority !== undefined ? parseInt(priority) : pressRelease.priority;
        pressRelease.author = author || pressRelease.author;
        pressRelease.originalUrl = originalUrl !== undefined ? originalUrl : pressRelease.originalUrl;
        pressRelease.attachments = updatedAttachments;
        pressRelease.status = status || pressRelease.status;
        pressRelease.releaseDate = releaseDate ? new Date(releaseDate) : pressRelease.releaseDate;
        
        await pressRelease.save();
        
        console.log('✅ 보도자료 수정 완료:', pressRelease._id);
        console.log('✅ 저장된 첨부파일 개수:', pressRelease.attachments.length);
        
        res.json({
            success: true,
            message: '보도자료가 성공적으로 수정되었습니다.',
            data: pressRelease
        });
    } catch (error) {
        console.error('보도자료 수정 오류:', error);
        
        // 업로드된 파일들 정리 (에러 발생 시)
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (unlinkError) {
                    console.error('파일 삭제 오류:', unlinkError);
                }
            });
        }
        
        res.status(500).json({
            success: false,
            message: '보도자료 수정에 실패했습니다.',
            error: error.message
        });
    }
});

// 보도자료 삭제
router.delete('/:id', async (req, res) => {
    try {
        const pressRelease = await PressRelease.findById(req.params.id);
        
        if (!pressRelease) {
            return res.status(404).json({
                success: false,
                message: '보도자료를 찾을 수 없습니다.'
            });
        }
        
        // 첨부파일 삭제
        if (pressRelease.attachments && pressRelease.attachments.length > 0) {
            pressRelease.attachments.forEach(file => {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                } catch (unlinkError) {
                    console.error('파일 삭제 오류:', unlinkError);
                }
            });
        }
        
        await PressRelease.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: '보도자료가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('보도자료 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '보도자료 삭제에 실패했습니다.',
            error: error.message
        });
    }
});

module.exports = router; 