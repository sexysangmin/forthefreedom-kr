// 보수중 관리 스크립트
(function() {
    // 보수 모드 설정
    const MAINTENANCE_CONFIG = {
        enabled: true,           // 보수 모드 활성화 여부
        startDate: '2025-08-10', // 보수 시작일 (YYYY-MM-DD)
        endDate: '2025-08-13',   // 보수 종료일 (YYYY-MM-DD)
        message: '웹사이트 보수중입니다',
        description: '더 나은 서비스 제공을 위해 웹사이트를 개선하고 있습니다.<br>불편을 드려 죄송합니다.'
    };

    // 현재 날짜 확인
    function isMaintenanceTime() {
        if (!MAINTENANCE_CONFIG.enabled) return false;
        
        const now = new Date();
        const start = new Date(MAINTENANCE_CONFIG.startDate);
        const end = new Date(MAINTENANCE_CONFIG.endDate + 'T23:59:59');
        
        return now >= start && now <= end;
    }

    // 보수중 페이지 HTML 생성
    function createMaintenancePage() {
        return `
            <div id="maintenance-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 60px 40px;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    max-width: 500px;
                    margin: 20px;
                ">
                    <!-- 로고/아이콘 -->
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: #A50034;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 30px;
                    ">
                        <i class="fas fa-tools" style="color: white; font-size: 35px;"></i>
                    </div>

                    <!-- 제목 -->
                    <h1 style="
                        color: #333;
                        font-size: 28px;
                        font-weight: bold;
                        margin: 0 0 20px 0;
                        line-height: 1.2;
                    ">${MAINTENANCE_CONFIG.message}</h1>

                    <!-- 설명 -->
                    <p style="
                        color: #666;
                        font-size: 16px;
                        line-height: 1.6;
                        margin: 0 0 30px 0;
                    ">${MAINTENANCE_CONFIG.description}</p>

                    <!-- 날짜 정보 -->
                    <div style="
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                        margin-bottom: 30px;
                    ">
                        <p style="
                            color: #333;
                            font-size: 14px;
                            margin: 0;
                            font-weight: 600;
                        ">예상 완료일: 2025년 8월 13일</p>
                    </div>

                    <!-- 당 정보 -->
                    <div style="
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                    ">
                        <h2 style="
                            color: #A50034;
                            font-size: 20px;
                            font-weight: bold;
                            margin: 0 0 10px 0;
                        ">자유와혁신</h2>
                        <p style="
                            color: #888;
                            font-size: 14px;
                            margin: 0;
                        ">Freedom & Innovation</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 페이지 콘텐츠 숨기기
    function hidePageContent() {
        document.body.style.overflow = 'hidden';
        
        // 기존 콘텐츠 숨기기
        const allElements = document.body.children;
        for (let element of allElements) {
            if (element.id !== 'maintenance-overlay') {
                element.style.display = 'none';
            }
        }
    }

    // 보수중 페이지 표시
    function showMaintenancePage() {
        // 보수중 페이지 HTML 삽입
        document.body.insertAdjacentHTML('afterbegin', createMaintenancePage());
        
        // 기존 콘텐츠 숨기기
        hidePageContent();
        
        console.log('보수 모드 활성화됨');
    }

    // 페이지 로드 시 실행
    function init() {
        if (isMaintenanceTime()) {
            // DOM이 준비되면 보수중 페이지 표시
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showMaintenancePage);
            } else {
                showMaintenancePage();
            }
        }
    }

    // 초기화 실행
    init();
})();
