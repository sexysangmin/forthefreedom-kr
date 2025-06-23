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