// CMS 데이터 로드 및 동기화 시스템
class CMSDataLoader {
    constructor() {
        this.cache = new Map();
        this.logManager = null;
        this.init();
    }

    async init() {
        // 로그 관리자 초기화
        this.initLogManager();
        
        // 페이지별 YAML 파일 매핑
        this.pageDataMap = {
            // 메인 페이지들
            '/': 'content/homepage.yml',
            '/index.html': 'content/homepage.yml',
            '/about.html': 'content/about.yml',
            '/members.html': 'content/members.yml',
            '/news.html': 'content/news.yml',
            '/policy.html': 'content/policy.yml',
            '/notices.html': 'content/notices.yml',
            '/faq.html': 'content/faq.yml',
            '/resources.html': 'content/resources.yml',
            '/support.html': 'content/support.yml',
            '/notice-1.html': 'content/notice-1.yml',
            '/notice-2.html': 'content/notice-2.yml',
            
            // About 서브페이지들
            '/about/principles.html': 'content/about/principles.yml',
            '/about/people.html': 'content/about/people.yml',
            '/about/organization.html': 'content/about/organization.yml',
            '/about/location.html': 'content/about/location.yml',
            '/about/founding.html': 'content/about/founding.yml',
            '/about/schedule.html': 'content/about/schedule.yml',
            
            // Members 서브페이지들
            '/members/join.html': 'content/members/join.yml',
            '/members/dues.html': 'content/members/dues.yml',
            
            // News 서브페이지들
            '/news/gallery.html': 'content/news/gallery.yml',
            '/news/events.html': 'content/news/events.yml',
            '/news/media.html': 'content/news/media.yml',
            '/news/press.html': 'content/news/press.yml',
            
            // Policy 서브페이지들
            '/policy/economy.html': 'content/policies/economy.yml',
            '/policy/education.html': 'content/policies/education.yml',
            '/policy/security.html': 'content/policies/security.yml',
            
            // Resources 서브페이지들
            '/resources/downloads.html': 'content/resources/downloads.yml',
            '/resources/media.html': 'content/resources/media.yml',
            '/resources/policy.html': 'content/resources/policy.yml'
        };

        await this.loadCurrentPageData();
    }
    
    initLogManager() {
        try {
            // 로그 관리자가 로드되어 있다면 연결
            if (window.cmsLogManager) {
                this.logManager = window.cmsLogManager;
                console.log('✅ CMS 로그 관리자 연결됨');
            }
        } catch (error) {
            console.warn('⚠️ 로그 관리자 초기화 실패:', error);
        }
    }
    
    logDataLoad(yamlFile, success = true) {
        if (this.logManager) {
            const action = success ? 'LOAD_SUCCESS' : 'LOAD_FAILED';
            this.logManager.logAction(action, yamlFile, 
                success ? 'YAML 데이터 로드 성공' : 'YAML 데이터 로드 실패');
        }
    }

    async loadCurrentPageData() {
        const currentPath = window.location.pathname;
        const yamlFile = this.pageDataMap[currentPath];
        
        if (yamlFile) {
            try {
                const data = await this.loadYAMLData(yamlFile);
                this.applyDataToPage(data);
                this.logDataLoad(yamlFile, true);
            } catch (error) {
                console.warn(`CMS 데이터 로드 실패: ${yamlFile}`, error);
                this.logDataLoad(yamlFile, false);
            }
        }
    }

    async loadYAMLData(filePath) {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }

        try {
            const response = await fetch(`/${filePath}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const yamlText = await response.text();
            const data = this.parseYAML(yamlText);
            
            this.cache.set(filePath, data);
            return data;
        } catch (error) {
            console.warn(`YAML 로드 실패: ${filePath}`, error);
            return null;
        }
    }

    parseYAML(yamlText) {
        // 개선된 YAML 파서 - 따옴표 없는 값도 처리
        const data = {};
        const lines = yamlText.split('\n');
        let currentSection = null;
        let currentIndent = 0;
        
        for (let line of lines) {
            const originalLine = line;
            line = line.trim();
            
            // 빈 줄이나 주석 스킵
            if (!line || line.startsWith('#')) continue;
            
            // 들여쓰기 계산
            const indent = originalLine.length - originalLine.trimStart().length;
            
            // 섹션 헤더 (key:)
            if (line.endsWith(':') && !line.includes(' ')) {
                const sectionName = line.slice(0, -1);
                if (indent === 0) {
                    currentSection = sectionName;
                    data[currentSection] = {};
                    currentIndent = 0;
                }
                continue;
            }
            
            // 키-값 쌍 처리
            if (line.includes(': ')) {
                const colonIndex = line.indexOf(': ');
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 2).trim();
                
                // 값 처리 - 따옴표 제거, 타입 변환
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                } else if (value === 'true' || value === 'false') {
                    value = value === 'true';
                } else if (!isNaN(value) && value !== '') {
                    value = Number(value);
                }
                
                // 현재 섹션에 할당
                if (currentSection && indent > 0) {
                    data[currentSection][key] = value;
                } else {
                    data[key] = value;
                }
            }
        }
        
        return data;
    }

    applyDataToPage(data) {
        if (!data) return;

        // 메타 정보 적용
        if (data.meta || data.metadata) {
            const meta = data.meta || data.metadata;
            if (meta.title) {
                document.title = meta.title;
                const titleElements = document.querySelectorAll('h1, .page-title, .hero-title');
                titleElements.forEach(el => {
                    if (el.textContent.includes('당 소개') || el.textContent.includes('정책') || 
                        el.textContent.includes('소식') || el.textContent.includes('당원') ||
                        el.textContent.includes('자료실') || el.textContent.includes('후원') ||
                        el.textContent.includes('FAQ') || el.textContent.includes('공지사항')) {
                        el.textContent = meta.title.replace(' - 자유와혁신', '');
                    }
                });
            }
            
            if (meta.description) {
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.name = 'description';
                    document.head.appendChild(metaDesc);
                }
                metaDesc.content = meta.description;
            }
        }

        // 히어로 섹션 적용
        if (data.hero) {
            this.applyHeroData(data.hero);
        }

        // 대표 인사말 적용 (홈페이지)
        if (data.representative) {
            this.applyRepresentativeData(data.representative);
        }

        // 핵심 정책 적용 (홈페이지)
        if (data.core_policies) {
            this.applyCorePoliciesData(data.core_policies);
        }

        // 당원 정보 적용 (홈페이지)
        if (data.members) {
            this.applyMembersData(data.members);
        }
    }

    applyHeroData(heroData) {
        if (heroData.title) {
            const heroTitle = document.querySelector('.hero h1, .hero-title, .page-title');
            if (heroTitle) heroTitle.textContent = heroData.title;
        }

        if (heroData.subtitle) {
            const heroSubtitle = document.querySelector('.hero .subtitle, .hero-subtitle');
            if (heroSubtitle) heroSubtitle.textContent = heroData.subtitle;
        }

        if (heroData.background_image) {
            const heroSection = document.querySelector('.hero, .hero-section');
            if (heroSection) {
                heroSection.style.backgroundImage = `url('${heroData.background_image}')`;
            }
        }

        if (heroData.cta_text) {
            const ctaButtons = document.querySelectorAll('.cta-button, .btn-cta');
            ctaButtons.forEach(btn => {
                if (btn.textContent.includes('가입') || btn.textContent.includes('참여')) {
                    btn.textContent = heroData.cta_text;
                }
            });
        }

        if (heroData.cta_link) {
            const ctaButtons = document.querySelectorAll('.cta-button, .btn-cta');
            ctaButtons.forEach(btn => {
                if (btn.textContent.includes('가입') || btn.textContent.includes('참여')) {
                    btn.href = heroData.cta_link;
                    btn.onclick = () => window.open(heroData.cta_link, '_blank');
                }
            });
        }
    }

    applyRepresentativeData(repData) {
        if (repData.name) {
            const nameElements = document.querySelectorAll('.representative-name, .leader-name');
            nameElements.forEach(el => el.textContent = repData.name);
        }

        if (repData.title) {
            const titleElements = document.querySelectorAll('.representative-title, .leader-title');
            titleElements.forEach(el => el.textContent = repData.title);
        }

        if (repData.greeting_title) {
            const greetingTitle = document.querySelector('.greeting-title, .message-title');
            if (greetingTitle) greetingTitle.textContent = repData.greeting_title;
        }

        if (repData.greeting_message) {
            const greetingMsg = document.querySelector('.greeting-message, .message-content');
            if (greetingMsg) {
                greetingMsg.innerHTML = repData.greeting_message.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
            }
        }
    }

    applyCorePoliciesData(policiesData) {
        if (policiesData.section_title) {
            const sectionTitle = document.querySelector('.policies-section .section-title');
            if (sectionTitle) sectionTitle.textContent = policiesData.section_title;
        }

        if (policiesData.main_title) {
            const mainTitle = document.querySelector('.policies-section h2, .policies-main-title');
            if (mainTitle) mainTitle.textContent = policiesData.main_title;
        }

        if (policiesData.description) {
            const description = document.querySelector('.policies-section .description, .policies-description');
            if (description) description.textContent = policiesData.description;
        }
    }

    applyMembersData(membersData) {
        if (membersData.count) {
            const countElements = document.querySelectorAll('.member-count, .members-count');
            countElements.forEach(el => el.textContent = membersData.count.toLocaleString());
        }

        if (membersData.main_title) {
            const mainTitle = document.querySelector('.members-section h2, .members-main-title');
            if (mainTitle) {
                mainTitle.textContent = membersData.main_title.replace('1,247', membersData.count?.toLocaleString() || '1,247');
            }
        }

        if (membersData.description) {
            const description = document.querySelector('.members-section .description, .members-description');
            if (description) {
                description.innerHTML = membersData.description.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
            }
        }
    }

    // 데이터 새로고침 (CMS 변경 감지 시)
    async refreshData() {
        this.cache.clear();
        await this.loadCurrentPageData();
    }
}

// CMS 데이터 로더 초기화
let cmsDataLoader;

// DOM 로드 완료 시 CMS 데이터 로더 시작
document.addEventListener('DOMContentLoaded', () => {
    cmsDataLoader = new CMSDataLoader();
    
    // 5분마다 데이터 새로고침 (CMS 변경 감지용)
    setInterval(() => {
        if (cmsDataLoader) {
            cmsDataLoader.refreshData();
        }
    }, 5 * 60 * 1000);
});

// 당원 가입 팝업 창 열기 함수
function openMembershipPopup() {
    const url = 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3';
    const windowFeatures = 'width=800,height=900,scrollbars=yes,resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no';
    
    // 화면 중앙에 위치시키기
    const left = (screen.width - 800) / 2;
    const top = (screen.height - 900) / 2;
    
    const finalFeatures = windowFeatures + `,left=${left},top=${top}`;
    
    window.open(url, 'membershipPopup', finalFeatures);
}

// 후원 폼 열기 함수
function openDonationForm() {
    alert('후원 기능은 준비 중입니다. 문의: 02-1234-5678');
}

// 자원봉사 신청 폼 열기 함수
function openVolunteerForm() {
    alert('자원봉사 신청 기능은 준비 중입니다. 문의: 02-1234-5678');
}

// 지원 폼 열기 함수
function openSupportForm() {
    alert('지원 신청 기능은 준비 중입니다. 문의: 02-1234-5678');
}

// 이벤트 상세 정보 모달 (events.html용)
let currentEventData = {};

function openEventDetail(eventId) {
    // 이벤트 데이터 매핑
    const eventDetails = {
        'urgent-1': {
            title: '긴급 기자회견: 경제정책 발표',
            date: '2025-01-25 (토) 14:00',
            location: '국회 정론관',
            description: '현재 경제 상황에 대한 자유와혁신의 입장과 대안을 발표합니다.',
            contact: '02-1234-5671'
        },
        'urgent-2': {
            title: '시민과의 대화: 청년정책 간담회',
            date: '2025-01-28 (화) 19:00',
            location: '강남구민회관',
            description: '청년들의 목소리를 직접 듣고 정책에 반영하는 소통의 시간입니다.',
            contact: '02-1234-5672'
        },
        'urgent-3': {
            title: '당원 교육: 정치참여 아카데미',
            date: '2025-01-30 (목) 18:30',
            location: '당사 교육장',
            description: '효과적인 정치 참여 방법과 시민 의식에 대한 교육 프로그램입니다.',
            contact: '02-1234-5673'
        },
        'event-1': {
            title: '서울 시민과의 만남',
            date: '2025-02-01 (토) 15:00',
            location: '서울 광화문광장',
            description: '서울 시민들과 함께하는 정책 토론 및 의견 수렴',
            contact: '02-1234-5671'
        },
        'event-2': {
            title: '부산 지역 순회 간담회',
            date: '2025-02-05 (수) 19:00',
            location: '부산 시민회관',
            description: '부산 지역 현안과 발전 방안에 대한 토론',
            contact: '051-1234-5671'
        },
        'event-3': {
            title: '대구 청년정책 포럼',
            date: '2025-02-08 (토) 14:00',
            location: '대구 EXCO',
            description: '대구 지역 청년들을 위한 정책 개발 포럼',
            contact: '053-1234-5671'
        },
        'event-4': {
            title: '전국 당원 대회',
            date: '2025-02-15 (토) 10:00',
            location: '서울 올림픽공원',
            description: '전국 당원들이 모이는 대규모 집회',
            contact: '02-1234-5678'
        }
    };

    const event = eventDetails[eventId];
    if (!event) return;

    currentEventData = event;

    // 모달 내용 업데이트
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.querySelector('#eventDetailTitle').textContent = event.title;
        modal.querySelector('#eventDetailDate').textContent = event.date;
        modal.querySelector('#eventDetailLocation').textContent = event.location;
        modal.querySelector('#eventDetailDescription').textContent = event.description;
        modal.querySelector('#eventDetailContact').textContent = event.contact;
        
        // 모달 표시
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeEventDetail() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// 갤러리 기능 (gallery.html용)
let currentGalleryType = 'photo';
let currentGalleryIndex = 0;
let galleryData = {
    photo: [
        { src: '../images/hero_image.png', title: '당원 모임', description: '정기 당원 모임에서 활발한 토론이 이루어지고 있습니다.' },
        { src: '../images/hero_image.png', title: '시민 대화', description: '시민들과의 열린 대화 시간을 가졌습니다.' },
        { src: '../images/hero_image.png', title: '정책 발표', description: '주요 정책 발표 현장입니다.' },
        { src: '../images/hero_image.png', title: '청년 간담회', description: '청년들과의 간담회 모습입니다.' },
        { src: '../images/hero_image.png', title: '지역 순회', description: '지역 순회 활동 중입니다.' },
        { src: '../images/hero_image.png', title: '토론회', description: '정책 토론회에서 열띤 토론이 진행되었습니다.' }
    ],
    video: [
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: '당 소개 영상', description: '자유와혁신을 소개하는 영상입니다.' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: '정책 설명', description: '주요 정책에 대한 설명 영상입니다.' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: '토론회 하이라이트', description: '정책 토론회의 주요 내용을 정리했습니다.' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: '시민과의 대화', description: '시민들과의 대화 현장입니다.' }
    ]
};

function openGallery(type, index) {
    currentGalleryType = type;
    currentGalleryIndex = index - 1; // 1-based to 0-based
    
    updateGalleryContent();
    
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function prevGalleryItem() {
    const data = galleryData[currentGalleryType];
    currentGalleryIndex = (currentGalleryIndex - 1 + data.length) % data.length;
    updateGalleryContent();
}

function nextGalleryItem() {
    const data = galleryData[currentGalleryType];
    currentGalleryIndex = (currentGalleryIndex + 1) % data.length;
    updateGalleryContent();
}

function updateGalleryContent() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    
    const data = galleryData[currentGalleryType];
    const item = data[currentGalleryIndex];
    
    const content = modal.querySelector('#galleryContent');
    const title = modal.querySelector('#galleryTitle');
    const description = modal.querySelector('#galleryDescription');
    
    if (currentGalleryType === 'photo') {
        content.innerHTML = `<img src="${item.src}" alt="${item.title}" class="max-w-full max-h-full object-contain">`;
    } else {
        content.innerHTML = `<iframe src="${item.src}" frameborder="0" allowfullscreen class="w-full h-96"></iframe>`;
    }
    
    if (title) title.textContent = item.title;
    if (description) description.textContent = item.description;
}

// FAQ 토글 함수
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Initialize Swipers
    initializeSwipers();
    
    // Initialize Counter Animation
    initializeCounters();
    
    // Initialize Scroll Animations
    initializeScrollAnimations();
    
    // Initialize Smooth Scrolling
    initializeSmoothScrolling();
});

// Initialize Swiper Sliders
function initializeSwipers() {
    // Destroy existing swiper if it exists
    const existingSwiper = document.querySelector('.events-swiper')?.swiper;
    if (existingSwiper) {
        existingSwiper.destroy(true, true);
    }
    
    // Events Swiper
    if (document.querySelector('.events-swiper')) {
        console.log('Events swiper element found');
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            const eventsSwiper = new Swiper('.events-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: false, // Disable loop to prevent content changes
                allowTouchMove: true,
                simulateTouch: true,
                grabCursor: true,
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                },
                // autoplay 비활성화 - 수동으로만 조작 가능
                // autoplay: {
                //     delay: 5000,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true,
                // },
                speed: 600,
                on: {
                    init: function() {
                        console.log('Events Swiper initialized successfully');
                        console.log('Total slides:', this.slides.length);
                        console.log('Slides per view at current breakpoint:', this.params.slidesPerView);
                    },
                    slideChange: function() {
                        console.log('Current slide index:', this.activeIndex);
                        console.log('Is beginning:', this.isBeginning);
                        console.log('Is end:', this.isEnd);
                    },
                    reachEnd: function() {
                        console.log('Reached end of slides');
                    }
                }
            });
            
            // Connect navigation buttons after swiper initialization
            const nextButton = document.querySelector('.events-next-btn');
            const prevButton = document.querySelector('.events-prev-btn');
            
            console.log('Next button found:', !!nextButton);
            console.log('Prev button found:', !!prevButton);
            
            if (nextButton) {
                nextButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Next button clicked');
                    
                    // Manual infinite loop: if at end, go to beginning
                    if (eventsSwiper.isEnd) {
                        console.log('At end, going to beginning');
                        eventsSwiper.slideTo(0, 600);
                    } else {
                        eventsSwiper.slideNext();
                    }
                });
                console.log('Next button event listener added');
            }
            
            if (prevButton) {
                prevButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Prev button clicked');
                    
                    // Manual infinite loop: if at beginning, go to end
                    if (eventsSwiper.isBeginning) {
                        console.log('At beginning, going to end');
                        // Calculate the last possible slide index considering slides per view
                        const slidesPerView = eventsSwiper.params.slidesPerView === 'auto' ? 1 : eventsSwiper.params.slidesPerView;
                        const lastSlideIndex = Math.max(0, eventsSwiper.slides.length - slidesPerView);
                        eventsSwiper.slideTo(lastSlideIndex, 600);
                    } else {
                        eventsSwiper.slidePrev();
                    }
                });
                console.log('Prev button event listener added');
            }
            
            // Store reference globally for debugging
            window.eventsSwiper = eventsSwiper;
            
        }, 300);
    } else {
        console.log('Events swiper element not found');
    }

    // Testimonials Swiper
    if (document.querySelector('.testimonials-swiper')) {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }
}

// Counter Animation
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    
    // Ensure the element maintains red color throughout animation
    element.style.color = '#A50034';
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // Format large numbers in Korean units
        if (currentValue >= 100000000) {
            element.textContent = Math.floor(currentValue / 100000000) + '억';
        } else if (currentValue >= 10000) {
            element.textContent = Math.floor(currentValue / 10000) + '만';
        } else if (currentValue >= 1000) {
            element.textContent = Math.floor(currentValue / 1000) + '천';
        } else {
            element.textContent = currentValue.toLocaleString('ko-KR');
        }
        
        // Maintain red color during animation
        element.style.color = '#A50034';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Final formatting in Korean units
            if (end >= 100000000) {
                element.textContent = Math.floor(end / 100000000) + '억';
            } else if (end >= 10000) {
                element.textContent = Math.floor(end / 10000) + '만';
            } else if (end >= 1000) {
                element.textContent = Math.floor(end / 1000) + '천';
            } else {
                element.textContent = end.toLocaleString('ko-KR');
            }
            
            // Ensure final color is correct
            element.style.color = '#A50034';
            element.setAttribute('data-animated', 'true');
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize Counters with Intersection Observer
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.getAttribute('data-animated')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 2000);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.policy-card, .bg-white:not(nav *)');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        scrollObserver.observe(element);
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop; // No fixed nav offset needed
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('모든 필드를 입력해주세요.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('올바른 이메일 주소를 입력해주세요.');
                return;
            }
            
            // Show success message (in real app, this would send to server)
            alert('감사합니다! 곧 연락드리겠습니다.');
            this.reset();
        });
    }
});

// Image Gallery Modal (for snapshot progress section)
function initializeImageGallery() {
    const galleryImages = document.querySelectorAll('.aspect-square');
    
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', function() {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="relative max-w-4xl max-h-full p-4">
                    <button class="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="w-full h-96 bg-gray-300 rounded-lg"></div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal on click
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.querySelector('.fa-times')) {
                    document.body.removeChild(modal);
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }
            });
        });
    });
}

// Initialize image gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeImageGallery);

// Navbar scroll effect removed - nav is now inside hero section

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation to placeholder images
document.addEventListener('DOMContentLoaded', function() {
    const placeholderImages = document.querySelectorAll('.bg-gray-200');
    
    placeholderImages.forEach(placeholder => {
        // Simulate image loading delay
        setTimeout(() => {
            placeholder.style.backgroundImage = 'none';
            placeholder.style.backgroundColor = '#e5e7eb';
        }, Math.random() * 2000 + 1000);
    });
});

// Social Media Share Functions (if needed)
function shareOnSocialMedia(platform, url, text) {
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Add resize listener for responsive adjustments
window.addEventListener('resize', function() {
    // Reinitialize swipers on resize if needed
    if (window.innerWidth <= 768) {
        // Mobile specific adjustments
    } else {
        // Desktop specific adjustments
    }
});

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    initializeSwipers();
    initializeCounters();
    initializeScrollAnimations();
    initializeSmoothScrolling();
}); 