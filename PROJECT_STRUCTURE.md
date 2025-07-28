# 자유와혁신 정당 웹사이트 프로젝트 구조 분석

## 📋 프로젝트 개요
- **프로젝트명**: 자유와혁신 정당 웹사이트
- **기술 스택**: HTML5, CSS3, JavaScript, Tailwind CSS, 자체 관리자 시스템
- **배포**: Vercel + Railway (API 서버)
- **저장소**: GitHub
- **문서 생성일**: 2025년 1월 18일

---

## 🗂️ 전체 디렉토리 구조

```
party-website/
├── 📁 .git/                    # Git 버전 관리
├── 📁 .github/                 # GitHub Actions 워크플로우
│   └── workflows/
│       └── sync-cms-data.yml   # CMS 자동 동기화
├── 📁 .cursor/                 # 에디터 설정
├── 📄 index.html              # 🏠 메인 홈페이지 (515 lines)
├── 📄 style.css               # 전역 스타일시트 (690 lines)
├── 📄 script.js               # 메인 JavaScript (463 lines)
├── 📄 nav.js                  # 네비게이션 동적 생성 (148 lines)
├── 📄 .gitignore              # Git 제외 파일 목록
├── 📄 vercel.json             # Vercel 배포 설정
├── 📄 README.md               # 프로젝트 설명서
├── 📄 배포_가이드.md           # 배포 가이드
├── 📁 images/                  # 🖼️ 이미지 자산
│   ├── hero_bg.png            # 히어로 배경 이미지 (1.8MB)
│   ├── hero_image.png         # 히어로 이미지 (1.8MB)
│   └── hero_image.jpg         # 히어로 이미지 JPG (195KB)
├── 📁 about/                   # 🏛️ 당 소개 페이지들
│   ├── principles.html        # 강령·핵심가치 (320 lines)
│   ├── people.html            # 주요 인물 (507 lines)
│   ├── organization.html      # 조직 구성 (516 lines)
│   ├── location.html          # 찾아오시는 길 (373 lines)
│   ├── founding.html          # 창당 과정 (1120 lines)
│   └── schedule.html          # 일정 (351 lines)
├── 📁 policy/                  # 📋 정책 페이지들
│   ├── economy.html           # 경제·일자리 정책 (410 lines)
│   ├── education.html         # 교육·복지 정책 (462 lines)
│   └── security.html          # 안보·외교 정책 (286 lines)
├── 📁 news/                    # 📰 소식 페이지들
│   ├── gallery.html           # 포토 & 영상 (553 lines)
│   ├── events.html            # 행사안내 (429 lines)
│   ├── media.html             # 언론보도 (173 lines)
│   ├── press.html             # 보도자료 (165 lines)
│   └── activities.html        # 정당활동 (161 lines)
├── 📁 members/                 # 🤝 참여 페이지들
│   ├── join.html              # 당원 가입 안내 (189 lines)
│   └── dues.html              # 당비 안내 (198 lines)
├── 📁 resources/               # 📚 자료실 페이지들
│   ├── downloads.html         # 다운로드 (288 lines)
│   ├── media.html             # 홍보자료 (518 lines)
│   ├── policy.html            # 정책자료 (179 lines)
│   ├── 📁 policy/             # 정책자료 하위
│   └── 📁 founding/           # 창당자료 하위
├── 📄 about.html              # 당 소개 메인 (377 lines)
├── 📄 policy.html             # 정책 메인 (328 lines)
├── 📄 news.html               # 소식 메인 (230 lines)
├── 📄 members.html            # 참여 메인 (164 lines)
├── 📄 resources.html          # 자료실 메인 (163 lines)
├── 📄 support.html            # 후원 페이지 (210 lines)
├── 📄 faq.html                # FAQ 페이지 (297 lines)
├── 📄 notices.html            # 공지사항 목록 (119 lines)
├── 📄 notice-1.html           # 개별 공지사항 1 (225 lines)
├── 📄 notice-2.html           # 개별 공지사항 2 (242 lines)
├── 📁 content/                 # 🎛️ CMS 콘텐츠 데이터
│   ├── homepage.yml           # 홈페이지 데이터 (57 lines)
│   ├── about-page.yml         # 소개 페이지 데이터 (105 lines)
│   ├── 📁 events/             # 행사/집회 데이터
│   ├── 📁 notices/            # 공지사항 데이터
│   ├── 📁 news/               # 뉴스 데이터
│   ├── 📁 policies/           # 정책 데이터
│   ├── 📁 people/             # 인물 데이터
│   ├── 📁 members/            # 당원 데이터
│   ├── 📁 media/              # 미디어 데이터
│   └── 📁 settings/           # 사이트 설정
├── 📁 admin/                   # 🎛️ 자체 관리자 시스템
│   └── config.yml             # CMS 관리자 설정 (346 lines)
├── 📁 admin/                   # 🔧 CMS 관리자 인터페이스
│   └── config.yml             # 기존 CMS 설정 (15 lines)
├── 📁 docs/                    # 📖 프로젝트 문서
│   ├── 간단_체크리스트.md
│   ├── 국민의힘_웹사이트_분석보고서.md
│   └── 콘텐츠_요청사항.md
├── 📁 archive/                 # 🗃️ 정리된 파일들
│   ├── 📁 backup-files/       # 백업 파일들 (.bak, .backup)
│   ├── 📁 unused-files/       # 사용하지 않는 파일들
│   └── 📁 python-scripts/     # Python 스크립트들
├── 📁 _data/                   # Jekyll 데이터 (사용 안함)
├── 📁 _includes/               # Jekyll 인클루드 (사용 안함)
├── 📁 _layouts/                # Jekyll 레이아웃 (사용 안함)
├── 📁 _sass/                   # Jekyll Sass (사용 안함)
└── 📁 logs/                    # 변경 로그
```

---

## 🏠 index.html 상세 분석

### 📱 페이지 구조
1. **HTML Head** (1-54행)
   - 메타데이터: UTF-8, viewport, 타이틀
   - Tailwind CSS CDN
   - 커스텀 색상 설정 (#A50034 브랜드 컬러)
   - Font Awesome, Swiper, Google Fonts
   - 인라인 CSS 스타일 오버라이드

2. **네비게이션** (55-56행)
   - `<div id="navigation-container"></div>`
   - nav.js에서 동적으로 생성

3. **히어로 섹션** (58-76행)
   - **배경**: `images/hero_bg.png?v=6`
   - **제목**: "자유와혁신 새로운 정치를 함께"
   - **설명**: "국민과 함께 더 나은 대한민국을 만들어갈 자유와혁신에 참여하세요"
   - **CTA 버튼**: "당원 가입하기" → `https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3`
   - **스타일**: 복잡한 인라인 스타일, 그라데이션 오버레이

4. **대표 인사말 섹션** (78-113행)
   - **제목**: "새로운 정치의 시작, 자유와혁신과 함께"
   - **대표명**: "김○○"
   - **직책**: "자유와혁신 당 대표"
   - **메시지 3개**:
     - "안녕하세요. 자유와혁신 당 대표입니다."
     - 당의 가치와 비전 설명
     - 국가 발전 약속
   - **이미지**: 플레이스홀더 (아이콘으로 대체)

5. **핵심 정책 섹션** (115-204행)
   - **제목**: "7대 핵심 정책으로 미래를 설계합니다"
   - **부제목**: "국민생활을 개선하고 국가 발전을 이끌어갈 핵심 정책들을 소개합니다"
   - **정책 카드 6개**:
     1. 경제 성장 (chart-line 아이콘)
     2. 교육 혁신 (graduation-cap 아이콘)
     3. 복지 확대 (heart 아이콘)
     4. 안보 강화 (shield-alt 아이콘)
     5. 환경 보호 (leaf 아이콘)
     6. 사법 개혁 (balance-scale 아이콘)
   - **CTA**: "전체 정책 보기" → `/policy`

6. **당원 활동 섹션** (206-280행)
   - **제목**: "함께 만들어가는 변화"
   - **이미지**: 플레이스홀더 3개
     - 당원 모임 (users 아이콘)
     - 시민 소통 (handshake 아이콘)
     - 당 활동 현장 (flag 아이콘)
   - **텍스트**: 실제 콘텐츠 필요
   - **통계**: 당원 수 등 (플레이스홀더)

7. **푸터** (480-515행)
   - **연락처**: 주소, 전화번호, 이메일
   - **소셜 미디어**: Facebook, Twitter, Instagram, YouTube
   - **링크**: 개인정보처리방침, 이용약관
   - **저작권**: © 2025 자유와혁신

### 🎨 이미지 및 미디어 자산
- **필수 이미지**: `images/hero_bg.png` (히어로 배경)
- **대체 필요**: 대표 사진, 당원 활동 사진들
- **아이콘**: Font Awesome 사용

### 🔗 외부 링크
- **당원 가입**: `https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3`
- **소셜 미디어**: 플레이스홀더 링크들

---

## 📄 주요 페이지별 콘텐츠 분석

### 🏛️ about.html (당 소개)
- **구조**: 히어로 + 소개 + 서브페이지 링크
- **서브페이지**: principles, people, organization, location, founding, schedule
- **특징**: 각 서브페이지로의 네비게이션 허브 역할

### 📋 policy.html (정책)
- **구조**: 7대 핵심정책 상세 설명
- **서브페이지**: economy, education, security
- **특징**: 정책별 상세 페이지 링크

### 📰 news.html (소식)
- **구조**: 최신 소식 목록 + 카테고리별 분류
- **서브페이지**: gallery, events, media, press, activities
- **특징**: 동적 콘텐츠 영역

### 🤝 members.html (참여)
- **구조**: 당원 가입 안내 + 참여 방법
- **서브페이지**: join, dues
- **특징**: 실제 가입 폼 연동

### 📚 resources.html (자료실)
- **구조**: 자료 카테고리별 분류
- **서브페이지**: downloads, media, policy
- **특징**: 파일 다운로드 기능

---

## 🎛️ CMS 시스템 구조

### 📁 content/ 디렉토리
- **homepage.yml**: 메인 페이지 모든 콘텐츠 (히어로, 대표 인사말, 정책)
- **about-page.yml**: 소개 페이지 콘텐츠
- **분류별 폴더**: events, notices, news, policies, people, members, media

### ⚙️ 자동화 시스템
- **GitHub Actions**: `.github/workflows/sync-cms-data.yml`
- **동기화 대상**: `content/homepage.yml` → `index.html`
- **업데이트 범위**: 히어로 섹션, 대표 인사말, 정책 섹션

---

## 🔧 기술적 특징

### 🎨 스타일링
- **Tailwind CSS**: CDN 방식 사용
- **커스텀 색상**: #A50034 (브랜드 컬러)
- **반응형**: 모바일 퍼스트 디자인
- **애니메이션**: 스크롤 애니메이션, 호버 효과

### 📱 네비게이션
- **동적 생성**: nav.js로 모든 페이지에 일관된 네비게이션
- **반응형**: 데스크톱 드롭다운 + 모바일 햄버거 메뉴
- **경로 감지**: 하위 폴더 자동 감지 (../ 경로 처리)

### 🚀 성능 최적화
- **이미지**: WebP 형식 사용 권장
- **스크립트**: 필요시에만 로드
- **CSS**: 인라인 + 외부 파일 조합

---

## 📋 개선 필요사항

### 🖼️ 콘텐츠
1. **실제 이미지 교체**
   - 대표 프로필 사진
   - 당원 활동 사진들
   - 정책 관련 이미지들

2. **텍스트 완성**
   - 대표 실명 입력
   - 구체적인 정책 내용
   - 연락처 정보 업데이트

### 🔧 기능
1. **폼 기능**
   - 실제 당원 가입 시스템 연동
   - 문의 폼 백엔드 연결

2. **SEO 최적화**
   - 메타 태그 완성
   - 구조화된 데이터 추가
   - 사이트맵 생성

### 📊 분석
1. **Google Analytics 연동**
2. **사용자 행동 분석**
3. **성능 모니터링**

---

## 🗃️ 정리된 파일들

### 📁 archive/backup-files/
- `*.bak` 파일들
- `*.backup` 파일들
- 이전 버전들

### 📁 archive/unused-files/
- `support_fixed*.html` (중복 파일들)

### 📁 archive/python-scripts/
- `fix_encoding.py`
- `encoding_fix.py`

---

## 📞 유지보수 가이드

### �� CMS 콘텐츠 업데이트
1. `/admin/` 관리자 시스템 접속
2. 해당 섹션 편집
3. 자동 동기화 확인

### 🐛 문제 해결
1. **네비게이션 문제**: nav.js 확인
2. **스타일 문제**: style.css + Tailwind 설정 확인
3. **CMS 동기화 문제**: GitHub Actions 로그 확인

### 📱 새 페이지 추가
1. HTML 파일 생성
2. nav.js에 링크 추가
3. CMS config에 관리 항목 추가 (선택사항)

---

**📅 최종 업데이트**: 2025년 1월 18일  
**📝 작성자**: AI Assistant  
**🔍 분석 범위**: 전체 프로젝트 파일 구조 및 HTML 콘텐츠 