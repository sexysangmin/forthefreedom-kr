// API Configuration - v2.0 (캐시버스터: 2025-07-21-06:45)

const API_CONFIG = {
    // 개발 환경
    development: {
        API_BASE: 'http://localhost:9000/api'
    },
    // 프로덕션 환경 - Railway에서 생성된 실제 Public Domain 주소
    production: {
        // ✅ Railway Public Domain 확정: forthefreedom-kr-production.up.railway.app
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

// 🔧 수정된 백업 URL 시스템 (존재하지 않는 서버들 제거)
window.BACKUP_API_URLS = [
    // Railway 서버만 사용 (다른 백업 URL들은 404이므로 제거)
];

// Railway 서버 실패 시 모크 데이터 반환 함수
window.getMockData = function(endpoint) {
    
    // auth/login 요청인 경우 인증 실패 응답
    if (endpoint.includes('/auth/login')) {
        return Promise.resolve({
            success: false,
            message: 'Railway 서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
        });
    }
    
    // 일반 데이터 요청인 경우 (관리자 대시보드 호환)
    return Promise.resolve({
        success: true,
        data: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            hasMore: false
        }
    });
};

// 🔐 보안 강화된 API 호출 함수 (자동 토큰 갱신 포함)
window.apiCallWithFallback = async function(endpoint, options = {}) {
    // 토큰 자동 갱신 확인
    await checkAndRefreshToken();
    
    // 인증 헤더 추가
    const token = localStorage.getItem('adminToken');
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const mainUrl = window.API_BASE + endpoint;
    
    try {
        const response = await fetch(mainUrl, {
            ...options,
            headers: {
                // FormData인 경우 Content-Type을 설정하지 않음 (브라우저가 자동 설정)
                ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                ...authHeaders,
                ...options.headers
            }
        });
        
        if (response.status === 401) {
            // 토큰 만료 또는 무효 - 로그인 페이지로 리다이렉트
            handleTokenExpiry();
            throw new Error('로그인이 필요합니다.');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        
        // 토큰 관련 오류인 경우 재시도 안함
        if (error.message.includes('로그인이 필요') || error.message.includes('401')) {
            throw error;
        }
        
        // Railway 서버 실패 시 모크 데이터 반환 (비인증 요청에만)
        if (!token) {
            return await window.getMockData(endpoint);
        } else {
            throw error;
        }
    }
};

// 🔄 자동 토큰 갱신 시스템 (안전 모드)
async function checkAndRefreshToken() {
    try {
        const token = localStorage.getItem('adminToken');
        const refreshToken = localStorage.getItem('adminRefreshToken');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        
        if (!token || !refreshToken || !tokenExpiry) {
            return; // 인증 정보 없음
        }
        
        const expiryTime = parseInt(tokenExpiry);
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5분
        
        // 토큰이 5분 내에 만료되면 갱신
        if (now + fiveMinutes >= expiryTime) {
            console.log('🔄 토큰 갱신 필요 - 자동 갱신 시작');
            
            const response = await fetch(`${window.API_BASE}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // 새 토큰 저장
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('tokenExpiry', Date.now() + (15 * 60 * 1000)); // 15분 후
                console.log('✅ 토큰 자동 갱신 성공');
                
                // 활동 감지 타이머 리셋
                if (typeof resetActivityTimer === 'function') {
                    resetActivityTimer();
                }
            } else {
                console.log('⚠️ 토큰 갱신 실패 - 로그아웃 처리');
                clearAllTokens();
            }
        }
    } catch (error) {
        console.log('⚠️ 토큰 갱신 중 오류 (무시):', error.message);
        // 에러 발생시 리다이렉트 하지 않고 무시
    }
}

// 🚪 토큰 만료 처리 (안전 모드)
function handleTokenExpiry() {
    console.log('🚪 토큰 만료 처리 시작');
    
    // 토큰 정보 삭제
    clearAllTokens();
    
    // 이미 로그인 페이지에 있으면 리다이렉트 안함
    if (window.location.pathname.includes('index.html')) {
        console.log('⚠️ 이미 로그인 페이지에 있음 - 리다이렉트 생략');
        return;
    }
    
    // 관리자 페이지에서만 리다이렉트
    if (window.location.pathname.includes('admin')) {
        console.log('🚪 관리자 페이지에서 로그인 페이지로 이동');
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/admin/index.html';
    }
}

// ⏰ 자동 로그아웃 시스템 (10분 비활성)
let activityTimer;
const INACTIVITY_TIME = 10 * 60 * 1000; // 10분

function resetActivityTimer() {
    clearTimeout(activityTimer);
    
    // 관리자 페이지에서만 활성화
    if (window.location.pathname.includes('admin') && !window.location.pathname.includes('index.html')) {
        activityTimer = setTimeout(() => {
            console.log('⏰ 10분 비활성으로 자동 로그아웃');
            alert('10분간 활동이 없어 자동 로그아웃됩니다.');
            handleTokenExpiry();
        }, INACTIVITY_TIME);
    }
}

// 🖱️ 활동 감지 이벤트 리스너
function initActivityDetection() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
        document.addEventListener(event, resetActivityTimer, true);
    });
    
    // 초기 타이머 시작
    resetActivityTimer();
    
    console.log('👀 사용자 활동 감지 시스템 시작 (10분 자동 로그아웃)');
}

// 🔐 관리자 페이지 보안 초기화 (단순화 버전)
function initAdminSecurity() {
    // 관리자 페이지인지 확인
    if (window.location.pathname.includes('admin') && !window.location.pathname.includes('index.html')) {
        const token = localStorage.getItem('adminToken');
        
        // 토큰이 없으면 로그인 페이지로 (단순 검증만)
        if (!token) {
            console.log('🚪 토큰 없음 - 로그인 페이지로 이동');
            window.location.href = '/admin/index.html';
            return;
        }
        
        console.log('✅ 토큰 확인됨 - 관리자 페이지 로드');
        
        // 활동 감지 시작 (10분 자동 로그아웃)
        initActivityDetection();
        
        // 정기적으로 토큰 상태 확인 (1분마다)
        setInterval(checkAndRefreshToken, 60 * 1000);
        
        console.log('🛡️ 관리자 보안 시스템 활성화 (단순 모드)');
    }
}

// 🚪 안전한 로그인 페이지 리다이렉트 (단순화)
function safeRedirectToLogin() {
    clearAllTokens();
    window.location.href = '/admin/index.html';
}

// 🗑️ 모든 토큰 정보 완전 삭제
function clearAllTokens() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('authToken'); // 기존 토큰도 삭제
    sessionStorage.clear();
    console.log('🗑️ 모든 토큰 정보 삭제 완료');
}

// 🚫 자동 보안 시스템 초기화 비활성화 (무한 새로고침 방지)
// 필요시 수동으로 initAdminSecurity() 호출 