// API Configuration
const API_CONFIG = {
    // 개발 환경
    development: {
        API_BASE: 'http://localhost:9000/api'
    },
    // 프로덕션 환경 - Railway에 배포된 백엔드 서버 주소로 변경 예정
    production: {
        API_BASE: 'https://your-railway-backend.railway.app/api'
    }
};

// 현재 환경 감지
function getCurrentEnvironment() {
    // localhost 또는 127.0.0.1이면 개발 환경
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '') {
        return 'development';
    }
    // 그 외는 프로덕션 환경
    return 'production';
}

// API 베이스 URL 가져오기
function getApiBase() {
    const env = getCurrentEnvironment();
    return API_CONFIG[env].API_BASE;
}

// 전역 변수로 설정
window.API_BASE = getApiBase();

console.log('🌍 Environment:', getCurrentEnvironment());
console.log('🔗 API Base URL:', window.API_BASE); 