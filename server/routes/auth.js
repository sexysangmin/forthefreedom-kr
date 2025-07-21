const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { 
    trackLoginFailures, 
    recordLoginFailure, 
    clearLoginFailures,
    loginRateLimit,
    loginSlowDown,
    koreanIPOnly 
} = require('../middleware/security');

const router = express.Router();

// 환경변수에서 비밀키 가져오기 (Railway 환경변수에서 설정)
const JWT_SECRET = process.env.JWT_SECRET || 'temp_jwt_secret_change_in_production_2025';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'temp_refresh_secret_change_in_production_2025';

// 토큰 만료 시간
const ACCESS_TOKEN_EXPIRES = '15m'; // 15분
const REFRESH_TOKEN_EXPIRES = '7d'; // 7일

// 토큰 블랙리스트 (메모리 저장, 실제 운영시 Redis 권장)
const tokenBlacklist = new Set();
const refreshTokens = new Map(); // refreshToken -> { userId, ip, createdAt }

// 🔐 보안 강화된 관리자 계정 (환경변수 또는 하드코딩 - 절대 프론트엔드 노출 금지)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin0929',
    password: process.env.ADMIN_PASSWORD || 'forthefreedom!!',
    role: 'super_admin',
    id: 'admin_001'
};

// 패스워드 해시 생성 (초기 설정용)
const initializeAdminPassword = async () => {
    try {
        // 운영 환경에서는 이미 해시된 패스워드를 환경변수에 저장하는 것이 더 안전
        if (!process.env.ADMIN_PASSWORD_HASH) {
            ADMIN_CREDENTIALS.passwordHash = await bcrypt.hash(ADMIN_CREDENTIALS.password, 12);
            console.log('🔐 관리자 패스워드 해시 생성 완료');
        } else {
            ADMIN_CREDENTIALS.passwordHash = process.env.ADMIN_PASSWORD_HASH;
            console.log('🔐 환경변수에서 관리자 패스워드 해시 로드');
        }
    } catch (error) {
        console.error('❌ 관리자 패스워드 초기화 실패:', error);
    }
};

// 서버 시작시 패스워드 해시 초기화
initializeAdminPassword();

// 🛡️ 보안 미들웨어 적용 (한국 IP만 허용)
router.use('/login', koreanIPOnly);
router.use('/login', loginRateLimit);
router.use('/login', loginSlowDown);
router.use('/login', trackLoginFailures);

// JWT 토큰 생성 함수
const generateTokens = (user, ip) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        ip: ip,
        loginTime: Date.now()
    };
    
    const accessToken = jwt.sign(payload, JWT_SECRET, { 
        expiresIn: ACCESS_TOKEN_EXPIRES,
        issuer: 'freedominnovation-admin',
        audience: 'admin-panel'
    });
    
    const refreshToken = jwt.sign(
        { id: user.id, type: 'refresh' }, 
        REFRESH_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    
    // 리프레시 토큰 저장
    refreshTokens.set(refreshToken, {
        userId: user.id,
        ip: ip,
        createdAt: Date.now(),
        userAgent: null // 필요시 추가
    });
    
    return { accessToken, refreshToken };
};

// 🔐 로그인 엔드포인트
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const clientIP = req.ip;
        
        console.log(`🔐 로그인 시도: ${username} (IP: ${clientIP})`);
        
        // 입력값 검증
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '사용자명과 비밀번호를 입력해주세요.',
                remainingAttempts: req.remainingAttempts
            });
        }
        
        // 관리자 계정 검증
        if (username !== ADMIN_CREDENTIALS.username) {
            console.log(`❌ 잘못된 사용자명: ${username}`);
            
            const failureInfo = recordLoginFailure(clientIP, username);
            return res.status(401).json({
                success: false,
                message: '잘못된 로그인 정보입니다.',
                remainingAttempts: failureInfo.remainingAttempts,
                currentFailures: failureInfo.currentFailures
            });
        }
        
        // 패스워드 검증
        const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
        if (!isPasswordValid) {
            console.log(`❌ 잘못된 패스워드: ${username}`);
            
            const failureInfo = recordLoginFailure(clientIP, username);
            return res.status(401).json({
                success: false,
                message: '잘못된 로그인 정보입니다.',
                remainingAttempts: failureInfo.remainingAttempts,
                currentFailures: failureInfo.currentFailures
            });
        }
        
        // ✅ 로그인 성공
        console.log(`✅ 로그인 성공: ${username} (IP: ${clientIP})`);
        
        // 실패 기록 초기화
        clearLoginFailures(clientIP);
        
        // JWT 토큰 생성
        const user = {
            id: ADMIN_CREDENTIALS.id,
            username: ADMIN_CREDENTIALS.username,
            role: ADMIN_CREDENTIALS.role
        };
        
        const { accessToken, refreshToken } = generateTokens(user, clientIP);
        
        // 로그인 성공 응답
        res.json({
            success: true,
            message: '로그인 성공',
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                loginTime: new Date().toISOString()
            },
            tokenInfo: {
                expiresIn: ACCESS_TOKEN_EXPIRES,
                type: 'Bearer'
            }
        });
        
    } catch (error) {
        console.error('❌ 로그인 처리 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

// 🔄 토큰 갱신 엔드포인트
router.post('/refresh', (req, res) => {
    try {
        const { refreshToken } = req.body;
        const clientIP = req.ip;
        
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: '리프레시 토큰이 필요합니다.'
            });
        }
        
        // 리프레시 토큰 확인
        if (!refreshTokens.has(refreshToken)) {
            return res.status(401).json({
                success: false,
                message: '유효하지 않은 리프레시 토큰입니다.'
            });
        }
        
        // 리프레시 토큰 검증
        jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
            if (err) {
                refreshTokens.delete(refreshToken);
                return res.status(401).json({
                    success: false,
                    message: '만료된 리프레시 토큰입니다.'
                });
            }
            
            // 새로운 액세스 토큰 생성
            const user = {
                id: ADMIN_CREDENTIALS.id,
                username: ADMIN_CREDENTIALS.username,
                role: ADMIN_CREDENTIALS.role
            };
            
            const { accessToken } = generateTokens(user, clientIP);
            
            res.json({
                success: true,
                token: accessToken,
                tokenInfo: {
                    expiresIn: ACCESS_TOKEN_EXPIRES,
                    type: 'Bearer'
                }
            });
        });
        
    } catch (error) {
        console.error('❌ 토큰 갱신 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '토큰 갱신 실패'
        });
    }
});

// 🚪 로그아웃 엔드포인트
router.post('/logout', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const { refreshToken } = req.body;
        
        // 액세스 토큰을 블랙리스트에 추가
        if (token) {
            tokenBlacklist.add(token);
            console.log('🚪 액세스 토큰 블랙리스트 추가');
        }
        
        // 리프레시 토큰 삭제
        if (refreshToken && refreshTokens.has(refreshToken)) {
            refreshTokens.delete(refreshToken);
            console.log('🚪 리프레시 토큰 삭제');
        }
        
        res.json({
            success: true,
            message: '로그아웃 되었습니다.'
        });
        
    } catch (error) {
        console.error('❌ 로그아웃 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '로그아웃 실패'
        });
    }
});

// 🛡️ 토큰 검증 미들웨어
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '인증 토큰이 없습니다.'
            });
        }
        
        const token = authHeader.substring(7);
        
        // 블랙리스트 확인
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({
                success: false,
                message: '무효한 토큰입니다.'
            });
        }
        
        // 토큰 검증
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: '토큰이 만료되었거나 유효하지 않습니다.'
                });
            }
            
            req.user = decoded;
            next();
        });
        
    } catch (error) {
        console.error('❌ 토큰 검증 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '토큰 검증 실패'
        });
    }
};

// 👤 사용자 정보 조회 엔드포인트
router.get('/me', verifyToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role,
            loginTime: req.user.loginTime
        }
    });
});

// 🔐 패스워드 변경 엔드포인트 (관리자용)
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: '현재 비밀번호와 새 비밀번호를 입력해주세요.'
            });
        }
        
        // 현재 패스워드 확인
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, ADMIN_CREDENTIALS.passwordHash);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: '현재 비밀번호가 틀렸습니다.'
            });
        }
        
        // 새 패스워드 해시 생성
        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        ADMIN_CREDENTIALS.passwordHash = newPasswordHash;
        
        console.log('🔐 관리자 패스워드 변경 완료');
        
        res.json({
            success: true,
            message: '비밀번호가 변경되었습니다.',
            note: '새 비밀번호를 환경변수에 반영하려면 ADMIN_PASSWORD_HASH를 업데이트하세요.'
        });
        
    } catch (error) {
        console.error('❌ 패스워드 변경 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '패스워드 변경 실패'
        });
    }
});

// 📊 보안 상태 조회 (관리자 전용)
router.get('/security-status', verifyToken, (req, res) => {
    const { getSecurityStatus } = require('../middleware/security');
    
    try {
        const securityStatus = getSecurityStatus();
        
        res.json({
            success: true,
            security: {
                ...securityStatus,
                tokenBlacklist: tokenBlacklist.size,
                activeRefreshTokens: refreshTokens.size,
                serverUptime: process.uptime()
            }
        });
        
    } catch (error) {
        console.error('❌ 보안 상태 조회 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '보안 상태 조회 실패'
        });
    }
});

module.exports = { router, verifyToken }; 