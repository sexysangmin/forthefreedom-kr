// 공지사항 로더 스크립트

class NoticesLoader {
    constructor() {
        this.notices = [];
        this.jsonDataUrl = '/js/notices-data.json';
    }

    // 더 이상 사용하지 않는 메서드들 (JSON 사용으로 대체)
    // parseFrontmatter와 markdownToHtml는 Python 스크립트에서 처리됨

    // JSON 파일에서 공지사항 로드
    async loadNoticesFromJSON() {
        try {
            console.log('JSON에서 공지사항 로드 시작...');
            
            const response = await fetch(this.jsonDataUrl);
            if (!response.ok) {
                throw new Error(`JSON 파일을 불러올 수 없습니다: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.notices || !Array.isArray(data.notices)) {
                throw new Error('올바르지 않은 JSON 데이터 형식입니다');
            }
            
            this.notices = data.notices;
            
            console.log(`✅ ${this.notices.length}개의 공지사항 로드 완료`);
            console.log(`📅 마지막 업데이트: ${data.last_updated}`);
            console.log('📋 로드된 공지사항:', this.notices.map(n => `${n.priority ? '🔴' : '⚪'} ${n.title}`));
            
            return this.notices;
            
        } catch (error) {
            console.error('❌ 공지사항 로드 실패:', error);
            throw error;
        }
    }

    // 공지사항 HTML 생성
    generateNoticeHTML(notice, index) {
        const categoryClass = notice.priority ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
        const categoryIcon = notice.priority ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
        const borderClass = notice.priority ? 'border-l-4 border-red-500' : '';
        
        // 날짜 포맷팅
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        };

        return `
            <article class="bg-white rounded-lg shadow-sm ${borderClass} hover:shadow-md transition-shadow cursor-pointer" data-notice-id="notice-${index}">
                <div class="p-6">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-3">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryClass}">
                                    <i class="${categoryIcon} mr-2"></i>${notice.category}
                                </span>
                                <span class="text-gray-500 text-sm">${formatDate(notice.date)}</span>
                            </div>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">
                                ${notice.title}
                            </h2>
                            <p class="text-gray-600 leading-relaxed">
                                ${notice.excerpt}
                            </p>
                        </div>
                        <div class="ml-4">
                            <i class="fas fa-chevron-right text-gray-400"></i>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // 공지사항 목록 렌더링
    renderNotices(containerSelector = '#notices-container') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('공지사항 컨테이너를 찾을 수 없습니다:', containerSelector);
            return;
        }

        // 기존 하드코딩된 내용 제거
        container.innerHTML = '';

        // 공지사항 HTML 생성
        this.notices.forEach((notice, index) => {
            container.innerHTML += this.generateNoticeHTML(notice, index);
        });

        console.log(`${this.notices.length}개의 공지사항이 렌더링되었습니다.`);
    }

    // 모달용 데이터 반환
    getNoticeData() {
        const noticeData = {};
        
        this.notices.forEach((notice, index) => {
            const categoryClass = notice.priority ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
            const categoryIcon = notice.priority ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
            
            // 날짜 포맷팅
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}.${month}.${day}`;
            };

            noticeData[`notice-${index}`] = {
                category: { 
                    text: notice.category, 
                    class: categoryClass, 
                    icon: categoryIcon 
                },
                date: formatDate(notice.date),
                title: notice.title,
                content: notice.content
            };
        });

        return noticeData;
    }

    // 초기화 및 이벤트 리스너 설정
    async initialize() {
        await this.loadNoticesFromJSON();
        this.renderNotices();
        
        // 전역 변수로 설정하여 기존 모달 함수에서 사용할 수 있게 함
        window.noticeData = this.getNoticeData();
        
        // 클릭 이벤트 리스너 등록
        this.setupEventListeners();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        const articles = document.querySelectorAll('article[data-notice-id]');
        console.log('찾은 공지사항 개수:', articles.length);
        
        articles.forEach((article, index) => {
            console.log(`공지사항 ${index + 1}:`, article.getAttribute('data-notice-id'));
            article.addEventListener('click', function(e) {
                console.log('클릭됨:', this.getAttribute('data-notice-id'));
                e.preventDefault();
                e.stopPropagation();
                const noticeId = this.getAttribute('data-notice-id');
                if (window.openNoticeModal) {
                    window.openNoticeModal(noticeId);
                }
            });
        });
    }
}

// 전역에서 사용할 수 있도록 설정
window.NoticesLoader = NoticesLoader; 