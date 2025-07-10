// CMS 데이터 로드 및 동기화 시스템
class CMSDataLoader {
    constructor() {
        this.cache = new Map();
        this.init();
    }

    async init() {
        // 페이지별 YAML 파일 매핑
        this.pageDataMap = {
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
            '/notice-2.html': 'content/notice-2.yml'
        };

        await this.loadCurrentPageData();
    }

    async loadCurrentPageData() {
        const currentPath = window.location.pathname;
        const yamlFile = this.pageDataMap[currentPath];
        
        if (yamlFile) {
            try {
                const data = await this.loadYAMLData(yamlFile);
                this.applyDataToPage(data);
            } catch (error) {
                console.warn(`CMS 데이터 로드 실패: ${yamlFile}`, error);
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
            this.applyCoreoliciesData(data.core_policies);
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

    applyCoreoliciesData(policiesData) {
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