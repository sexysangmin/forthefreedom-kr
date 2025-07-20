// 간결한 네비게이션 컴포넌트 (국민의힘 스타일)
function loadNavigation() {
    // 현재 경로 확인하여 하위 폴더 내부인지 감지
    const currentPath = window.location.pathname;
    // 하위 폴더들: about/, policy/, resources/, news/ 등
    const isInSubFolder = currentPath.includes('/about/') || 
                          currentPath.includes('/policy/') || 
                          currentPath.includes('/resources/') ||
                          currentPath.includes('/news/') ||
                          currentPath.split('/').length > 2; // 일반적인 하위 폴더 감지
    const pathPrefix = isInSubFolder ? '../' : '';
    
    const navigationHTML = `
        <nav class="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <!-- 로고 -->
                    <div class="flex items-center">
                        <a href="${pathPrefix}index.html" class="flex items-center">
                            <img src="${pathPrefix}images/logo.png" alt="자유와혁신 로고" class="h-16 w-auto">
                        </a>
                    </div>
                    
                    <!-- 데스크톱 메뉴 -->
                    <div class="hidden md:flex items-center space-x-8">
                        <!-- 1. 소개 -->
                        <div class="relative group">
                            <a href="${pathPrefix}about.html" class="text-gray-700 hover:text-red-600 font-bold py-2 px-1 transition-colors duration-200 text-xl">
                                소개
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <a href="${pathPrefix}about.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당소개</a>
                                    <a href="${pathPrefix}about/principles.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">강령, 당헌, 당규</a>
                                    <a href="${pathPrefix}about/founding.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">창당 스토리</a>
                                    <a href="${pathPrefix}about/organization.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">조직도</a>
                                    <div class="relative group/sub">
                                        <a href="#" class="flex items-center justify-between px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                            일꾼들 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                        </a>
                                        <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                            <div class="py-2">
                                                <a href="${pathPrefix}about/people-central.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">중앙당</a>
                                                <a href="${pathPrefix}about/people-regional.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">시도당</a>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="${pathPrefix}resources/policy.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">정책</a>
                                    <a href="${pathPrefix}about/logo.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">로고</a>
                                    <a href="${pathPrefix}about/location.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">찾아오시는길</a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 2. 소식 -->
                        <div class="relative group">
                            <a href="${pathPrefix}news.html" class="text-gray-700 hover:text-red-600 font-bold py-2 px-1 transition-colors duration-200 text-xl">
                                소식
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-60 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <a href="${pathPrefix}news/notices.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">공지사항</a>
                                    <div class="relative group/sub">
                                        <a href="#" class="flex items-center justify-between px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                            보도자료, 논평 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                        </a>
                                        <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                            <div class="py-2">
                                                <a href="${pathPrefix}news/press-releases.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">대변인</a>
                                                <a href="${pathPrefix}news/press-policy.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">정책위</a>
                                                <a href="${pathPrefix}news/press-media.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">뉴미디어팀</a>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="${pathPrefix}news/media.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">언론보도</a>
                                    <a href="${pathPrefix}news/events.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">주요일정</a>
                                    <div class="relative group/sub">
                                        <a href="#" class="flex items-center justify-between px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                            홍보 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                        </a>
                                        <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                            <div class="py-2">
                                                <a href="${pathPrefix}news/card-news.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">카드뉴스</a>
                                                <a href="${pathPrefix}news/gallery.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">포토갤러리</a>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="${pathPrefix}resources.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">자료실</a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 3. 당원 -->
                        <div class="relative group">
                            <a href="${pathPrefix}members.html" class="text-gray-700 hover:text-red-600 font-bold py-2 px-1 transition-colors duration-200 text-xl">
                                당원
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <div class="relative group/sub">
                                        <a href="#" class="flex items-center justify-between px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                            당원가입안내 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                        </a>
                                        <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                            <div class="py-2">
                                                <a href="${pathPrefix}members/join.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">당원가입</a>
                                                <a href="${pathPrefix}members/faq.html" class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-red-600">당원가입 FAQ</a>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="#" onclick="console.log('나의정보조회 시스템 개발중'); alert('나의정보조회 시스템 개발중입니다.'); return false;" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">나의정보조회 <span class="text-xs text-gray-500">(개발중)</span></a>
                                    <a href="#" onclick="console.log('당비납부 시스템 개발중'); alert('당비납부 시스템 개발중입니다.'); return false;" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당비납부 <span class="text-xs text-gray-500">(준비중)</span></a>
                                    <a href="#" onclick="console.log('당원교육 시스템 개발중'); alert('당원교육 시스템 개발중입니다.'); return false;" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당원교육 <span class="text-xs text-gray-500">(개발중)</span></a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 4. 후원 -->
                        <a href="${pathPrefix}support.html" class="text-gray-700 hover:text-red-600 font-bold py-2 px-1 transition-colors duration-200 text-xl">
                            후원
                        </a>
                    </div>
                    
                    <!-- 가입 및 후원 버튼 -->
                    <div class="hidden md:flex items-center space-x-3">
                        <a href="${pathPrefix}support.html" class="border-2 border-red-600 text-red-600 px-4 py-1.5 rounded-md font-medium text-lg hover:border-b-4 transition-all duration-200">
                            후원하기
                        </a>
                        <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium text-xl">
                            당원 가입하기
                        </a>
                    </div>
                    
                    <!-- 모바일 메뉴 버튼 -->
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="text-gray-700 hover:text-red-600 focus:outline-none focus:text-red-600">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- 모바일 메뉴 -->
                <div id="mobile-menu" class="md:hidden hidden border-t border-gray-200">
                    <div class="py-2 space-y-1">
                        <a href="${pathPrefix}about.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">소개</a>
                        <a href="${pathPrefix}news.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">소식</a>
                        <a href="${pathPrefix}members.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당원</a>
                        <a href="${pathPrefix}support.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">후원</a>
                        <div class="border-t border-gray-200 mt-2 pt-2">
                            <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank" class="block px-3 py-2 text-lg bg-red-600 text-white rounded-md mx-3 text-center hover:bg-red-700 transition-colors">당원 가입하기</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        navigationContainer.innerHTML = navigationHTML;
        
        // 모바일 메뉴 토글
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // 플로팅 버튼 추가 (초기에는 숨김 상태)
        const floatingButtons = `
            <!-- 플로팅 버튼들 -->
            <div class="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 opacity-0 transition-opacity duration-300" id="floating-buttons">
                <!-- 당원가입 버튼 -->
                <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" 
                   target="_blank"
                   class="floating-btn bg-red-600 hover:bg-red-700 text-white shadow-lg"
                   title="당원가입하기">
                    <i class="fas fa-user-plus mr-2"></i>
                    <span class="hidden sm:inline">당원가입</span>
                    <span class="sm:hidden">가입</span>
                </a>
                
                <!-- 후원하기 버튼 -->
                <a href="${pathPrefix}support.html" 
                   class="floating-btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                   title="후원하기">
                    <i class="fas fa-heart mr-2"></i>
                    <span class="hidden sm:inline">후원하기</span>
                    <span class="sm:hidden">후원</span>
                </a>
            </div>
            
            <style>
            .floating-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 12px 16px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 500;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                min-width: 60px;
            }
            
            .floating-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 640px) {
                .floating-btn {
                    padding: 10px 12px;
                    font-size: 12px;
                    min-width: 50px;
                }
            }
            
            /* 모바일에서 하단 여백 조정 */
            @media (max-width: 768px) {
                #floating-buttons {
                    bottom: 80px !important;
                }
            }
            </style>
        `;
        
        // 기존 플로팅 버튼이 있으면 제거 (중복 방지)
        const existingFloatingButtons = document.getElementById('floating-buttons');
        if (existingFloatingButtons) {
            existingFloatingButtons.remove();
        }
        
        // body에 플로팅 버튼 추가
        document.body.insertAdjacentHTML('beforeend', floatingButtons);
        
        // 스크롤 이벤트로 플로팅 버튼 표시/숨김 제어
        const floatingButtonsElement = document.getElementById('floating-buttons');
        const navigationElement = document.querySelector('nav');
        
        if (floatingButtonsElement && navigationElement) {
            // 스크롤 이벤트 리스너 추가
            let ticking = false;
            
            function updateFloatingButtons() {
                const navBottom = navigationElement.getBoundingClientRect().bottom;
                const isNavVisible = navBottom > 0;
                
                if (isNavVisible) {
                    // 네비게이션이 보이면 플로팅 버튼 숨김
                    floatingButtonsElement.style.opacity = '0';
                    floatingButtonsElement.style.pointerEvents = 'none';
                } else {
                    // 네비게이션이 안보이면 플로팅 버튼 표시
                    floatingButtonsElement.style.opacity = '1';
                    floatingButtonsElement.style.pointerEvents = 'auto';
                }
                
                ticking = false;
            }
            
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateFloatingButtons);
                    ticking = true;
                }
            }
            
            // 스크롤 이벤트 등록
            window.addEventListener('scroll', requestTick);
            
            // 초기 상태 설정
            updateFloatingButtons();
        }
    }
}

// DOMContentLoaded에서 자동으로 loadNavigation 실행
document.addEventListener('DOMContentLoaded', loadNavigation);
