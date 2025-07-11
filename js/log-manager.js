/**
 * 자유와혁신 로그 관리 시스템
 * 모든 사용자 활동과 파일 변경사항을 추적하고 기록합니다.
 */

class LogManager {
    constructor() {
        this.logs = [];
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackUserActions();
        this.trackFileUploads();
        this.setupBeforeUnload();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 현재 날짜를 YYYY-MM-DD 형식으로 반환
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    // 현재 시간을 ISO 형식으로 반환
    getCurrentTime() {
        return new Date().toISOString();
    }

    // 페이지 방문 추적
    trackPageView() {
        const log = {
            type: 'page_view',
            timestamp: this.getCurrentTime(),
            sessionId: this.sessionId,
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`
        };
        
        this.addLog(log);
    }

    // 사용자 액션 추적 (클릭, 폼 제출 등)
    trackUserActions() {
        // 링크 클릭 추적
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.addLog({
                    type: 'link_click',
                    timestamp: this.getCurrentTime(),
                    sessionId: this.sessionId,
                    link: e.target.href,
                    text: e.target.textContent.trim(),
                    page: window.location.pathname
                });
            }
        });

        // 버튼 클릭 추적
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.type === 'submit') {
                this.addLog({
                    type: 'button_click',
                    timestamp: this.getCurrentTime(),
                    sessionId: this.sessionId,
                    buttonText: e.target.textContent.trim(),
                    page: window.location.pathname
                });
            }
        });

        // 폼 제출 추적
        document.addEventListener('submit', (e) => {
            this.addLog({
                type: 'form_submit',
                timestamp: this.getCurrentTime(),
                sessionId: this.sessionId,
                formId: e.target.id || 'unknown',
                page: window.location.pathname
            });
        });
    }

    // 파일 업로드 추적
    trackFileUploads() {
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file' && e.target.files.length > 0) {
                Array.from(e.target.files).forEach(file => {
                    this.addLog({
                        type: 'file_upload',
                        timestamp: this.getCurrentTime(),
                        sessionId: this.sessionId,
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        page: window.location.pathname
                    });
                });
            }
        });
    }

    // 로그 추가
    addLog(logEntry) {
        this.logs.push(logEntry);
        
        // 로컬 스토리지에 임시 저장
        const existingLogs = JSON.parse(localStorage.getItem('pending_logs') || '[]');
        existingLogs.push(logEntry);
        localStorage.setItem('pending_logs', JSON.stringify(existingLogs));

        // 로그가 10개 이상 쌓이면 서버로 전송 시도
        if (existingLogs.length >= 10) {
            this.sendLogsToServer();
        }
    }

    // 서버로 로그 전송 (실제 구현에서는 서버 엔드포인트에 맞게 수정 필요)
    async sendLogsToServer() {
        const pendingLogs = JSON.parse(localStorage.getItem('pending_logs') || '[]');
        
        if (pendingLogs.length === 0) return;

        try {
            // 실제 서버 구현 시 이 부분을 수정
            console.log('로그 전송:', pendingLogs);
            
            // GitHub API나 Netlify Functions를 통해 로그 파일 생성
            await this.saveLogsAsFile(pendingLogs);
            
            // 전송 성공 시 로컬 스토리지 정리
            localStorage.removeItem('pending_logs');
        } catch (error) {
            console.error('로그 전송 실패:', error);
        }
    }

    // 로그를 파일로 저장 (브라우저 다운로드)
    async saveLogsAsFile(logs) {
        const logContent = this.formatLogsForFile(logs);
        const fileName = `activity_log_${this.getCurrentDate()}_${this.sessionId}.json`;
        
        // 브라우저에서 파일 다운로드
        const blob = new Blob([logContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // 자동 다운로드는 사용자 경험을 해칠 수 있으므로 콘솔에만 출력
        console.log('로그 파일 준비됨:', fileName);
        console.log('로그 내용:', logContent);
        
        // URL 정리
        URL.revokeObjectURL(url);
    }

    // 로그를 파일 형식으로 포맷팅
    formatLogsForFile(logs) {
        const metadata = {
            generatedAt: this.getCurrentTime(),
            sessionId: this.sessionId,
            pageTitle: document.title,
            domain: window.location.hostname,
            totalLogs: logs.length
        };

        return JSON.stringify({
            metadata,
            logs
        }, null, 2);
    }

    // 페이지 종료 시 로그 전송
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.addLog({
                type: 'page_unload',
                timestamp: this.getCurrentTime(),
                sessionId: this.sessionId,
                page: window.location.pathname,
                timeSpent: Date.now() - this.startTime.getTime()
            });

            // 남은 로그들 전송
            this.sendLogsToServer();
        });
    }

    // 수동으로 로그 다운로드
    downloadLogs() {
        const allLogs = [
            ...this.logs,
            ...JSON.parse(localStorage.getItem('pending_logs') || '[]')
        ];

        if (allLogs.length === 0) {
            alert('다운로드할 로그가 없습니다.');
            return;
        }

        const logContent = this.formatLogsForFile(allLogs);
        const fileName = `manual_log_export_${this.getCurrentDate()}.json`;
        
        const blob = new Blob([logContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // 특정 유형의 로그만 필터링
    getLogsByType(type) {
        return this.logs.filter(log => log.type === type);
    }

    // 세션 통계 생성
    getSessionStats() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            currentTime: new Date(),
            totalLogs: this.logs.length,
            pageViews: this.getLogsByType('page_view').length,
            linkClicks: this.getLogsByType('link_click').length,
            buttonClicks: this.getLogsByType('button_click').length,
            fileUploads: this.getLogsByType('file_upload').length,
            formSubmits: this.getLogsByType('form_submit').length
        };
    }
}

// 전역 로그 매니저 인스턴스 생성
window.logManager = new LogManager();

// 개발자 도구에서 사용할 수 있는 유틸리티 함수들
window.downloadLogs = () => window.logManager.downloadLogs();
window.getSessionStats = () => window.logManager.getSessionStats();
window.clearLogs = () => {
    localStorage.removeItem('pending_logs');
    window.logManager.logs = [];
    console.log('로그가 초기화되었습니다.');
};

// 페이지 로드 완료 후 초기화 메시지
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 로그 추적 시스템이 활성화되었습니다.');
    console.log('사용 가능한 명령어:');
    console.log('- downloadLogs(): 로그 파일 다운로드');
    console.log('- getSessionStats(): 세션 통계 확인');
    console.log('- clearLogs(): 로그 초기화');
}); 