# 자유와 혁신당 웹사이트 🏛️

한국 정당 웹사이트 MVP 프로젝트입니다. 정당 기본 색상(Pantone 207C)을 활용한 현대적이고 깔끔한 디자인으로 구성되었습니다.

## 🚀 기술 스택

- **HTML5** - 시맨틱한 마크업
- **CSS3** - 커스텀 스타일링 및 애니메이션
- **Vanilla JavaScript** - 인터랙티브 기능
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Swiper.js** - 터치 지원 슬라이더
- **Google Fonts** - Inter & Noto Sans KR

## ✨ 주요 기능

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 완벽 지원
- 터치 친화적 인터페이스
- 어르신 독자층을 고려한 큰 폰트 크기

### 🎨 브랜드 통일성
- **정당 기본 색상**: Pantone 207C (#A50034)
- **일관된 디자인**: 직각 모서리, 깔끔한 레이아웃
- **한국어 최적화**: 천/만/억 단위, 적절한 폰트

### 🛠️ 인터랙티브 요소
- **슬라이더** - 행사 및 집회 섹션 (Swiper)
- **카운터 애니메이션** - 당원 가입 통계
- **토글 기능** - Q&A 섹션
- **당원 가입 연동** - 실제 가입 시스템 팝업

## 📋 페이지 구성

### 메인 페이지 (index.html)
1. **네비게이션** - 고정 헤더, 모바일 메뉴
2. **히어로 섹션** - 당명, 슬로건, 가입 버튼
3. **5대 정책** - 2열 레이아웃, 번호 박스
4. **행사 및 집회** - 6개 슬라이드, 수동 네비게이션
5. **당원 가입 현황** - 실시간 카운터
6. **공지사항** - 최신 공지 3개
7. **Q&A** - 토글 가능한 FAQ 5개
8. **푸터** - 정당 정보

### 세부 페이지
- **공지사항 페이지** (notices.html) - 목록 + 페이지네이션
- **공지사항 세부** (notice-1.html, notice-2.html)
- **행사 세부 페이지** (event-1.html ~ event-6.html)
- **FAQ 페이지** (faq.html) - 전체 질문 답변

## 🎯 특별한 기능들

### 당원 가입 시스템 연동
```javascript
// 실제 당원 가입 시스템과 연동
function openMembershipPopup() {
    window.open('https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3', 
                'membership', 'width=800,height=900,scrollbars=yes');
}
```

### 한국어 숫자 포맷팅
```javascript
// K/M 대신 한국어 단위 사용
function formatKoreanNumber(num) {
    if (num >= 100000000) return Math.floor(num/100000000) + '억';
    if (num >= 10000) return Math.floor(num/10000) + '만';
    if (num >= 1000) return Math.floor(num/1000) + '천';
    return num.toString();
}
```

### Q&A 토글 기능
```javascript
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.arrow');
    // 토글 애니메이션 및 화살표 회전
}
```

## 🚀 실행 방법

### 로컬 개발
```bash
# Python으로 로컬 서버 실행
python -m http.server 8000

# 또는 Node.js serve 사용
npx serve .
```

### Vercel 배포 (권장)
1. GitHub에 저장소 업로드
2. Vercel에서 Import Project
3. 자동 배포 완료

## 📱 모바일 최적화

- **터치 이벤트** - 스와이프, 탭 지원
- **적응형 레이아웃** - 모바일에서 1열, 데스크톱에서 2열
- **큰 버튼** - 터치하기 쉬운 크기
- **가독성** - 어르신도 읽기 쉬운 폰트 크기

## 🎨 브랜드 가이드

### 색상 팔레트
```css
/* Pantone 207C 기반 색상 체계 */
:root {
    --red-600: #A50034;  /* 기본 빨간색 */
    --red-700: #8B002C;  /* 진한 빨간색 */
    --red-800: #700024;  /* 더 진한 빨간색 */
    --red-900: #56001C;  /* 가장 진한 빨간색 */
    --red-100: #FCE7EA;  /* 연한 빨간색 */
    --red-50: #FDF2F4;   /* 매우 연한 빨간색 */
}
```

### 타이포그래피
- **제목**: Inter 폰트, 700 weight
- **본문**: Noto Sans KR 폰트, 400-500 weight
- **크기**: 어르신 가독성을 위해 기본보다 큰 크기 사용

## 🔧 커스터마이징

### 콘텐츠 수정
- `index.html`: 메인 페이지 내용 수정
- `notices.html`: 공지사항 목록 수정
- `faq.html`: FAQ 내용 수정

### 색상 변경
모든 파일에서 Tailwind config와 CSS custom properties 수정

### 이미지 교체
- `hero_image.jpg`: 히어로 섹션 배경
- 플레이스홀더 이미지들을 실제 사진으로 교체

## 📞 문의사항

프로젝트 관련 문의나 개선사항이 있으시면 연락주세요.

---

**© 2025 자유와 혁신당. 함께 만들어가는 대한민국의 미래.** 