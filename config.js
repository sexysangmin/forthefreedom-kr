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

// 🔧 수정된 백업 URL 시스템 (존재하지 않는 서버들 제거)
window.BACKUP_API_URLS = [
    // Railway 서버만 사용 (다른 백업 URL들은 404이므로 제거)
];

// Railway 서버 실패 시 모크 데이터 반환 함수
window.getMockData = function(endpoint) {
    console.log('🔄 Railway 서버 실패, 모크 데이터 반환:', endpoint);
    
    // 기본 모크 응답 구조
    const mockResponse = {
        success: true,
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        hasMore: false
    };
    
    return Promise.resolve(mockResponse);
};

// API 호출 실패 시 백업 URL로 재시도하는 함수
window.apiCallWithFallback = async function(endpoint, options = {}) {
    const mainUrl = window.API_BASE + endpoint;
    
    try {
        console.log(`🔄 API 요청:`, mainUrl);
        
        const response = await fetch(mainUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API 성공:`, mainUrl);
        return data;
        
    } catch (error) {
        console.error(`❌ API 실패 (${mainUrl}):`, error.message);
        
        // Railway 서버 실패 시 모크 데이터 반환
        return await window.getMockData(endpoint);
    }
}; 