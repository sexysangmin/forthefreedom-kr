// ======================================
// 자유와혁신 웹사이트 JavaScript
// ======================================

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
    alert('후원 기능은 준비 중입니다. 문의: 02-2634-2023');
}

// 자원봉사 신청 폼 열기 함수
function openVolunteerForm() {
    alert('자원봉사 신청 기능은 준비 중입니다. 문의: 02-2634-2023');
}

// 지원 폼 열기 함수
function openSupportForm() {
    alert('지원 신청 기능은 준비 중입니다. 문의: 02-2634-2023');
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
            description: '새로운 경제정책 방향과 청년 일자리 창출 방안에 대한 긴급 기자회견을 개최합니다.',
            details: `
                <h4 class="font-bold text-lg mb-3">주요 안건</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>청년 일자리 창출 정책</li>
                    <li>중소기업 지원 확대 방안</li>
                    <li>경제 활성화 로드맵</li>
                </ul>
                <div class="mt-4 p-3 bg-yellow-50 rounded">
                    <p class="text-sm text-yellow-800">
                        <strong>참석 문의:</strong> 02-2634-2023<br>
                        <strong>방송:</strong> 유튜브 라이브 동시 진행
                    </p>
                </div>
            `
        },
        'meeting-1': {
            title: '당원 정기 모임',
            date: '2025-01-30 (목) 19:00',
            location: '당사 2층 회의실',
            description: '1월 정기 당원 모임을 개최합니다. 모든 당원들의 참석을 부탁드립니다.',
            details: `
                <h4 class="font-bold text-lg mb-3">모임 일정</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>19:00 - 개회 및 인사</li>
                    <li>19:15 - 1월 활동 보고</li>
                    <li>19:45 - 2월 계획 발표</li>
                    <li>20:15 - 자유 토론</li>
                    <li>21:00 - 마무리</li>
                </ul>
            `
        }
    };

    currentEventData = eventDetails[eventId];
    if (!currentEventData) return;

    // 모달에 데이터 삽입
    document.getElementById('eventTitle').textContent = currentEventData.title;
    document.getElementById('eventDate').textContent = currentEventData.date;
    document.getElementById('eventLocation').textContent = currentEventData.location;
    document.getElementById('eventDescription').textContent = currentEventData.description;
    document.getElementById('eventDetails').innerHTML = currentEventData.details;

    // 모달 표시
    document.getElementById('eventModal').classList.remove('hidden');
}

function closeEventDetail() {
    document.getElementById('eventModal').classList.add('hidden');
    currentEventData = {};
}

// 갤러리 기능 (gallery.html용)
let currentGalleryData = {
    photos: [
        { id: 1, src: 'images/activity.jpg', title: '당원 모임', description: '월례 당원 모임 현장' },
        { id: 2, src: 'images/activity2.jpg', title: '정책 토론회', description: '청년 정책 토론회' },
        { id: 3, src: 'images/activity3.jpg', title: '거리 캠페인', description: '시민과 함께하는 캠페인' }
    ],
    videos: [
        { id: 1, src: 'https://example.com/video1.mp4', title: '정책 발표', description: '7대 핵심 정책 발표' }
    ]
};

let currentGalleryIndex = 0;
let currentGalleryType = 'photos';

function openGallery(type, index) {
    currentGalleryType = type;
    currentGalleryIndex = index;
    updateGalleryContent();
    document.getElementById('galleryModal').classList.remove('hidden');
}

function closeGallery() {
    document.getElementById('galleryModal').classList.add('hidden');
}

function prevGalleryItem() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryContent();
    }
}

function nextGalleryItem() {
    const maxIndex = currentGalleryData[currentGalleryType].length - 1;
    if (currentGalleryIndex < maxIndex) {
        currentGalleryIndex++;
        updateGalleryContent();
    }
}

function updateGalleryContent() {
    const item = currentGalleryData[currentGalleryType][currentGalleryIndex];
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    if (currentGalleryType === 'photos') {
        modalImage.src = item.src;
        modalImage.classList.remove('hidden');
        modalVideo.classList.add('hidden');
    } else {
        modalVideo.src = item.src;
        modalVideo.classList.remove('hidden');
        modalImage.classList.add('hidden');
    }

    modalTitle.textContent = item.title;
    modalDescription.textContent = item.description;
}

// FAQ 토글 기능
function toggleFAQ(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.faq-icon');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// 모바일 네비게이션 토글
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('block');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
            }
        });
    }
});

// Swiper 슬라이더 초기화
function initializeSwipers() {
    // Hero 슬라이더
    if (document.querySelector('.hero-swiper')) {
        new Swiper('.hero-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // 카드 슬라이더
    if (document.querySelector('.card-swiper')) {
        new Swiper('.card-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.card-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }
}

// 카운터 애니메이션
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = parseInt(start);
    const endValue = parseInt(end);
    const difference = endValue - startValue;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutQuart 이징 함수
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (difference * easedProgress));
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = endValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// 카운터 초기화
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const counter = entry.target;
                const endValue = parseInt(counter.dataset.count || counter.textContent.replace(/,/g, ''));
                counter.classList.add('animated');
                animateCounter(counter, 0, endValue, 2000);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// 스크롤 애니메이션
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0px)';
                entry.target.style.transition = '0.6s ease-out';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// 부드러운 스크롤
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const headerHeight = 80;
                
                window.scrollTo({
                    top: offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 연락 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 여기서 실제 서버로 데이터 전송 (구현 필요)
            console.log('폼 데이터:', data);
            
            // 성공 메시지 표시
            alert('메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
            
            // 폼 초기화
            this.reset();
        });
    }
});

// 이미지 갤러리 초기화
function initializeImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', function() {
            openGallery('photos', index);
        });
    });

    // 모달 클릭으로 닫기
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeGallery();
            }
        });
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeGallery();
            closeEventDetail();
        }
    });
}

// 페이지 상단으로 스크롤 버튼
window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById('scrollToTop');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.classList.remove('hidden');
        } else {
            scrollButton.classList.add('hidden');
        }
    }
});

// 이미지 지연 로딩
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    initializeImageGallery();
});

// 소셜 미디어 공유 함수
function shareOnSocialMedia(platform, url, text) {
    const encodedUrl = encodeURIComponent(url || window.location.href);
    const encodedText = encodeURIComponent(text || document.title);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'kakao':
            // 카카오 공유는 별도 SDK 필요
            alert('카카오 공유 기능은 준비 중입니다.');
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, 'share', 'width=600,height=400');
    }
}

// 반응형 처리
window.addEventListener('resize', function() {
    // 필요시 반응형 처리 로직 추가
});

// 이미지 지연 로딩 함수
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

// 메인 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    initializeSwipers();
    initializeCounters();
    initializeScrollAnimations();
    initializeSmoothScrolling();
}); 