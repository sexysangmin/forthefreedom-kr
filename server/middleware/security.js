const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const NodeCache = require('node-cache');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

// 메모리 캐시 (로그인 실패, IP 차단용)
const loginFailureCache = new NodeCache({ stdTTL: 1800 }); // 30분
const blockedIPCache = new NodeCache({ stdTTL: 1800 }); // 30분
const accessLogCache = new NodeCache({ stdTTL: 86400 }); // 24시간

// 설정값
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 30 * 60; // 30분 (초)
const ALLOWED_COUNTRIES = ['KR']; // 한국만 허용

// 한국 IP만 허용하는 미들웨어
const koreanIPOnly = (req, res, next) => {
    try {
        const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
        console.log(`🌍 IP 확인: ${clientIP}`);
        
        // 로컬 개발환경 IP 허용
        if (clientIP === '::1' || clientIP === '127.0.0.1' || clientIP.includes('localhost')) {
            console.log('🏠 로컬 개발환경 접근 허용');
            return next();
        }
        
        // Railway 내부 IP 허용 (배포환경)
        if (clientIP.startsWith('10.') || clientIP.startsWith('172.') || clientIP.startsWith('192.168.')) {
            console.log('🚀 Railway 내부 네트워크 접근 허용');
            return next();
        }
        
        const geo = geoip.lookup(clientIP);
        
        if (!geo) {
            console.log('⚠️ IP 위치 정보 없음, 허용 (CDN/Proxy 가능성)');
            return next();
        }
        
        if (ALLOWED_COUNTRIES.includes(geo.country)) {
            console.log(`✅ 한국 IP 접근 허용: ${clientIP} (${geo.city}, ${geo.country})`);
            
            // 접근 로그 기록
            logAccess(clientIP, geo, req.headers['user-agent']);
            return next();
        } else {
            console.log(`❌ 해외 IP 차단: ${clientIP} (${geo.country})`);
            return res.status(403).json({
                success: false,
                message: '한국에서만 접근 가능합니다.',
                country: geo.country,
                blocked: true
            });
        }
        
    } catch (error) {
        console.error('IP 확인 중 오류:', error);
        // 오류 발생시 접근 허용 (서비스 중단 방지)
        next();
    }
};

// 로그인 실패 추적 미들웨어
const trackLoginFailures = (req, res, next) => {
    const clientIP = req.ip;
    
    // 이미 차단된 IP인지 확인
    if (blockedIPCache.get(clientIP)) {
        const blockInfo = blockedIPCache.get(clientIP);
        return res.status(429).json({
            success: false,
            message: `IP가 차단되었습니다. ${Math.ceil((blockInfo.blockedUntil - Date.now()) / 1000 / 60)}분 후 다시 시도하세요.`,
            blocked: true,
            remainingTime: Math.ceil((blockInfo.blockedUntil - Date.now()) / 1000),
            reason: 'too_many_failures'
        });
    }
    
    // 실패 횟수 확인
    const failures = loginFailureCache.get(clientIP) || 0;
    
    if (failures >= MAX_LOGIN_ATTEMPTS) {
        // IP 차단
        const blockedUntil = Date.now() + (BLOCK_DURATION * 1000);
        blockedIPCache.set(clientIP, {
            ip: clientIP,
            blockedAt: Date.now(),
            blockedUntil: blockedUntil,
            reason: 'max_login_attempts',
            attempts: failures
        });
        
        console.log(`🚫 IP 차단: ${clientIP} (${failures}회 실패)`);
        
        return res.status(429).json({
            success: false,
            message: `로그인 ${MAX_LOGIN_ATTEMPTS}회 실패로 30분간 차단되었습니다.`,
            blocked: true,
            remainingTime: BLOCK_DURATION,
            reason: 'too_many_failures'
        });
    }
    
    // 현재 실패 횟수를 요청에 첨부
    req.currentFailures = failures;
    req.remainingAttempts = MAX_LOGIN_ATTEMPTS - failures;
    
    next();
};

// 로그인 실패 기록 함수
const recordLoginFailure = (ip, username = null) => {
    const currentFailures = loginFailureCache.get(ip) || 0;
    const newFailures = currentFailures + 1;
    
    loginFailureCache.set(ip, newFailures);
    
    console.log(`⚠️ 로그인 실패 기록: ${ip} ${username ? `(${username})` : ''} - ${newFailures}/${MAX_LOGIN_ATTEMPTS}회`);
    
    return {
        currentFailures: newFailures,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - newFailures,
        maxAttempts: MAX_LOGIN_ATTEMPTS
    };
};

// 로그인 성공시 실패 기록 초기화
const clearLoginFailures = (ip) => {
    loginFailureCache.del(ip);
    blockedIPCache.del(ip);
    console.log(`✅ 로그인 성공: ${ip} - 실패 기록 초기화`);
};

// Rate Limiting 미들웨어들
const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 15분에 100회
    message: {
        success: false,
        message: '너무 많은 요청입니다. 15분 후 다시 시도하세요.',
        rateLimited: true
    },
    standardHeaders: true,
    legacyHeaders: false
});

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 10, // 15분에 10회 로그인 시도
    message: {
        success: false,
        message: '로그인 시도가 너무 많습니다. 15분 후 다시 시도하세요.',
        rateLimited: true,
        type: 'login_rate_limit'
    },
    standardHeaders: true,
    legacyHeaders: false
    // keyGenerator 제거 - 기본 IP 처리 사용 (IPv6 호환)
});

const loginSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15분
    delayAfter: 3, // 3회 시도 후부터 지연
    delayMs: (hits) => hits * 1000 // 1초씩 증가
});

// 접근 로그 기록
const logAccess = (ip, geo, userAgent) => {
    try {
        const parser = new UAParser(userAgent);
        const device = parser.getResult();
        
        const accessKey = `${ip}_${Date.now()}`;
        const accessInfo = {
            ip: ip,
            country: geo?.country || 'Unknown',
            city: geo?.city || 'Unknown',
            browser: `${device.browser.name} ${device.browser.version}`,
            os: `${device.os.name} ${device.os.version}`,
            device: device.device.type || 'desktop',
            timestamp: new Date().toISOString(),
            userAgent: userAgent
        };
        
        accessLogCache.set(accessKey, accessInfo);
        console.log(`📝 접근 로그: ${ip} (${geo?.city}, ${geo?.country}) - ${device.browser.name}/${device.os.name}`);
    } catch (error) {
        console.error('접근 로그 기록 오류:', error);
    }
};

// 보안 상태 조회 함수들
const getSecurityStatus = () => {
    const blockedIPs = [];
    const failedAttempts = [];
    
    // 차단된 IP 목록
    blockedIPCache.keys().forEach(key => {
        const blockInfo = blockedIPCache.get(key);
        if (blockInfo) {
            blockedIPs.push({
                ip: key,
                ...blockInfo,
                remainingTime: Math.max(0, blockInfo.blockedUntil - Date.now())
            });
        }
    });
    
    // 실패 시도 목록
    loginFailureCache.keys().forEach(key => {
        const failures = loginFailureCache.get(key);
        if (failures > 0) {
            failedAttempts.push({
                ip: key,
                failures: failures,
                remainingAttempts: MAX_LOGIN_ATTEMPTS - failures
            });
        }
    });
    
    return {
        blockedIPs: blockedIPs,
        failedAttempts: failedAttempts,
        settings: {
            maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
            blockDuration: BLOCK_DURATION,
            allowedCountries: ALLOWED_COUNTRIES
        }
    };
};

// 관리자용 IP 수동 차단해제
const unblockIP = (ip) => {
    blockedIPCache.del(ip);
    loginFailureCache.del(ip);
    console.log(`🔓 관리자에 의한 IP 차단 해제: ${ip}`);
    return true;
};

module.exports = {
    koreanIPOnly,
    trackLoginFailures,
    recordLoginFailure,
    clearLoginFailures,
    generalRateLimit,
    loginRateLimit,
    loginSlowDown,
    getSecurityStatus,
    unblockIP,
    logAccess
}; 