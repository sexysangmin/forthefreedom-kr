// API Configuration
const API_CONFIG = {
    // 개발 환경
    development: {
        API_BASE: 'http://localhost:9000/api'
    },
    // 프로덕션 환경 - Railway에 배포된 실제 백엔드 서버 주소
    production: {
        API_BASE: 'https://forthefreedom-kr-production.up.railway.app/api'
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

// CORS 및 네트워크 에러 대응을 위한 백업 URL 시스템
window.BACKUP_API_URLS = [
    'https://forthefreedom-kr-production.up.railway.app/api',
    'https://web-production-d30c83e5.up.railway.app/api',
    'https://party-website-server.vercel.app/api'
];

// API 호출 실패 시 백업 URL로 재시도하는 함수
window.apiCallWithFallback = async function(endpoint, options = {}) {
    const urls = [window.API_BASE, ...window.BACKUP_API_URLS];
    
    for (let i = 0; i < urls.length; i++) {
        try {
            console.log(`🔄 API 시도 ${i + 1}/${urls.length}:`, urls[i] + endpoint);
            
            const response = await fetch(urls[i] + endpoint, options);
            
            if (response.ok) {
                console.log(`✅ API 성공:`, urls[i]);
                // 성공한 URL을 기본 URL로 업데이트
                if (i > 0) {
                    window.API_BASE = urls[i];
                    console.log(`🔄 API_BASE 업데이트:`, window.API_BASE);
                }
                return response;
            }
        } catch (error) {
            console.warn(`❌ API 실패 ${i + 1}/${urls.length}:`, urls[i], error.message);
            
            // 마지막 URL도 실패하면 에러 발생
            if (i === urls.length - 1) {
                throw new Error(`모든 API 엔드포인트에서 연결에 실패했습니다: ${error.message}`);
            }
        }
    }
}; 