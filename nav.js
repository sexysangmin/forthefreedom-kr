// 간결한 네비게이션 컴포넌트 (국민의힘 스타일)
document.addEventListener('DOMContentLoaded', function() {
    // 현재 경로 확인하여 하위 폴더 내부인지 감지
    const currentPath = window.location.pathname;
    // 하위 폴더들: about/, policy/, resources/ 등
    const isInSubFolder = currentPath.includes('/about/') || 
                          currentPath.includes('/policy/') || 
                          currentPath.includes('/resources/') ||
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
                        <!-- 소개 -->
                        <div class="relative group">
                            <a href="${pathPrefix}about.html" class="text-gray-700 hover:text-red-600 font-medium py-2 px-1 transition-colors duration-200 text-xl">
                                소개
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <a href="${pathPrefix}about.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당 소개</a>
                                    <a href="${pathPrefix}about/principles.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">강령·핵심가치</a>
                                    <a href="${pathPrefix}about/organization.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">조직 구성</a>
                                    <a href="${pathPrefix}about/people.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">주요 인물</a>
                                    <a href="${pathPrefix}about/location.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">찾아오시는 길</a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 정책 -->
                        <a href="${pathPrefix}policy.html" class="text-gray-700 hover:text-red-600 font-medium py-2 px-1 transition-colors duration-200 text-xl">
                            정책
                        </a>
                        
                        <!-- 정당소식 -->
                        <div class="relative group">
                            <a href="${pathPrefix}news.html" class="text-gray-700 hover:text-red-600 font-medium py-2 px-1 transition-colors duration-200 text-xl">
                                정당소식
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <a href="${pathPrefix}news/notices.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">공지사항</a>
                                    <a href="${pathPrefix}news/press-releases.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">보도자료</a>
                                    <a href="${pathPrefix}news/activities.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">활동소식</a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 참여 -->
                        <div class="relative group">
                            <a href="${pathPrefix}members.html" class="text-gray-700 hover:text-red-600 font-medium py-2 px-1 transition-colors duration-200 text-xl">
                                참여
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당원 가입 안내</a>
                                    <a href="${pathPrefix}members/dues.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">후원 안내</a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 자료실 -->
                        <div class="relative group">
                            <a href="${pathPrefix}resources.html" class="text-gray-700 hover:text-red-600 font-medium py-2 px-1 transition-colors duration-200 text-xl">
                                자료실
                            </a>
                            <div class="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div class="py-2">
                                    <a href="${pathPrefix}resources/policy-materials.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">정책자료</a>
                                    <a href="${pathPrefix}resources/party-constitution.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">당헌당규</a>
                                    <a href="${pathPrefix}resources/election-materials.html" class="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">선거자료</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 가입 및 후원 버튼 -->
                    <div class="hidden md:flex items-center space-x-3">
                        <a href="${pathPrefix}members/dues.html" class="border-2 border-red-600 text-red-600 px-4 py-1.5 rounded-md font-medium text-lg hover:border-b-4 transition-all duration-200">
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
                        <a href="${pathPrefix}policy.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">정책</a>
                        <a href="${pathPrefix}news.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">정당소식</a>
                        <a href="${pathPrefix}members.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">참여</a>
                        <a href="${pathPrefix}resources.html" class="block px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">자료실</a>
                        <div class="mt-2 mx-3 space-y-2">
                            <a href="${pathPrefix}members/dues.html" class="block px-3 py-2 text-lg border-2 border-red-600 text-red-600 rounded-md text-center hover:border-b-4 transition-all duration-200">후원하기</a>
                            <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank" class="block px-3 py-2 text-lg bg-red-600 text-white hover:bg-red-700 rounded-md text-center">당원 가입하기</a>
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
    }
}); 