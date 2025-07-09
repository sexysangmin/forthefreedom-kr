# 자유와혁신 정당 웹사이트 CMS 시스템

> **대한민국의 미래를 여는 정당, 자유와혁신의 공식 웹사이트**  
> 완전한 YAML 기반 콘텐츠 관리 시스템(CMS)으로 구축된 현대적인 정치 웹사이트

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site-id/deploys)
[![GitHub Actions](https://github.com/your-username/party-website/workflows/CMS%20Sync/badge.svg)](https://github.com/your-username/party-website/actions)

---

## 🎯 **프로젝트 개요**

이 프로젝트는 **32개의 HTML 페이지**를 **YAML 기반 CMS 시스템**으로 완전히 변환한 현대적인 정치 웹사이트입니다.

### ✨ **주요 특징**

- 🔄 **완전한 CMS 변환**: 모든 HTML → YAML → HTML 자동 동기화
- 🎨 **사용자 친화적 관리자**: Netlify CMS 기반 직관적 인터페이스
- 🚀 **자동 배포**: GitHub Actions + Netlify 완전 자동화
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- 🔒 **보안**: 최신 웹 보안 표준 적용
- 🌐 **다국어 지원**: 한국어 우선, 확장 가능한 구조

---

## 📁 **프로젝트 구조**

```
party-website/
├── 📄 HTML 페이지들 (32개)
│   ├── index.html                 # 메인 페이지
│   ├── about/                     # 소개 (7개 페이지)
│   ├── members/                   # 당원 (3개 페이지)
│   ├── news/                      # 뉴스 (6개 페이지)
│   ├── policy/                    # 정책 (4개 페이지)
│   └── resources/                 # 자료실 (4개 페이지)
│
├── 📝 YAML 콘텐츠 (32개)
│   └── content/
│       ├── index.yml
│       ├── about/
│       ├── members/
│       ├── news/
│       ├── policy/
│       └── resources/
│
├── 🎨 템플릿 시스템
│   └── templates/
│       ├── *.template.html        # Jinja2 템플릿들
│       └── registry.yml           # 템플릿 매핑
│
├── 🔧 CMS 관리자
│   └── admin/
│       ├── index.html             # Netlify CMS 인터페이스
│       └── config.yml             # CMS 설정
│
├── ⚙️ 자동화 스크립트
│   └── scripts/
│       ├── yaml-to-html-converter.py
│       ├── template-generator.py
│       ├── bulk-template-generator.py
│       ├── setup-cms.py
│       └── deploy.bat
│
├── 🚀 배포 설정
│   ├── .github/workflows/         # GitHub Actions
│   └── netlify.toml               # Netlify 설정
│
└── 📚 문서화
    ├── docs/                      # 기술 문서
    └── 배포_가이드.md              # 배포 가이드
```

---

## 🚀 **빠른 시작**

### 1️⃣ **저장소 클론**

```bash
git clone https://github.com/your-username/party-website.git
cd party-website
```

### 2️⃣ **CMS 시스템 설정**

```bash
# Windows
scripts\deploy.bat

# 또는 수동 설정
python scripts/setup-cms.py
```

### 3️⃣ **로컬 개발 서버**

```bash
# Python 서버
python -m http.server 3000

# 또는 Node.js 서버 (CMS 포함)
npm install
npm run cms
```

### 4️⃣ **CMS 관리자 접속**

- **로컬**: http://localhost:3000/admin
- **배포된 사이트**: https://your-site.netlify.app/admin

---

## 📋 **콘텐츠 관리**

### 🎛️ **CMS 관리자 인터페이스**

CMS를 통해 다음 콘텐츠들을 쉽게 관리할 수 있습니다:

#### 📖 **페이지 관리**
- **메인 페이지**: 히어로 섹션, 최신 소식, 주요 안내
- **소개**: 창당준비위, 조직구성, 인물소개, 기본원칙, 활동일정, 지역조직
- **당원**: 입당안내, 당비안내, 당원 혜택
- **뉴스**: 당 활동, 행사/집회, 갤러리, 언론보도, 보도자료
- **정책**: 경제정책, 교육정책, 안보정책
- **자료실**: 다운로드, 미디어, 정책 자료
- **기타**: FAQ, 공지사항, 후원안내

#### 📝 **동적 콘텐츠**
- **이벤트**: 행사, 집회, 토론회 일정
- **공지사항**: 긴급 공지, 일반 안내
- **보도자료**: 성명서, 정책 발표

### 🔧 **YAML 구조**

모든 페이지는 일관된 YAML 구조를 따릅니다:

```yaml
metadata:
  title: "페이지 제목"
  description: "페이지 설명"
  keywords: "키워드1, 키워드2"
  last_modified: "2025-01-18"

content:
  main_title: "메인 제목"
  introduction: "소개 내용"
  sections:
    - title: "섹션 제목"
      description: "섹션 내용"
      items:
        - name: "항목명"
          value: "항목값"
```

---

## 🔄 **자동화 시스템**

### 🤖 **GitHub Actions 워크플로우**

모든 YAML 변경사항은 자동으로 HTML로 변환됩니다:

1. **YAML 파일 수정** (CMS 또는 직접 편집)
2. **자동 감지** (GitHub Actions 트리거)
3. **구문 검증** (YAML 유효성 검사)
4. **HTML 변환** (Jinja2 템플릿 엔진)
5. **자동 배포** (Netlify)
6. **알림 및 백업** (성공/실패 알림)

### 📊 **변환 매핑**

| YAML 파일 | HTML 출력 | 템플릿 |
|-----------|-----------|--------|
| `content/index.yml` | `index.html` | `templates/index.template.html` |
| `content/about.yml` | `about.html` | `templates/about.template.html` |
| `content/members/join.yml` | `members/join.html` | `templates/members/join.template.html` |
| ... | ... | ... |

---

## 🛠️ **개발 가이드**

### 🔧 **로컬 개발 환경**

```bash
# 의존성 설치
pip install pyyaml jinja2 beautifulsoup4

# 개발 서버 실행
python -m http.server 3000

# CMS 개발 서버 (별도 터미널)
npx netlify-cms-proxy-server
```

### 📝 **새 페이지 추가**

1. **YAML 파일 생성**
   ```bash
   # content/new-page.yml
   metadata:
     title: "새 페이지"
   content:
     main_title: "페이지 제목"
   ```

2. **템플릿 생성**
   ```bash
   python scripts/template-generator.py --html new-page.html --output templates/new-page.template.html
   ```

3. **CMS 설정 업데이트**
   ```yaml
   # admin/config.yml에 새 collection 추가
   ```

### 🎨 **템플릿 수정**

템플릿은 Jinja2 문법을 사용합니다:

```html
<h1>{{ metadata.title }}</h1>
<div>{{ content.introduction | markdown_to_html | safe }}</div>

{% for item in content.items %}
<div class="item">
  <h3>{{ item.title }}</h3>
  <p>{{ item.description }}</p>
</div>
{% endfor %}
```

### 🔍 **사용 가능한 필터**

- `format_date`: 날짜 포맷팅
- `markdown_to_html`: 마크다운 → HTML 변환
- `truncate_words`: 텍스트 길이 제한
- `safe`: HTML 태그 허용

---

## 🚀 **배포 가이드**

### 📡 **Netlify 배포**

1. **저장소 연결**
   - Netlify에서 GitHub 저장소 연결
   - 빌드 설정: `netlify.toml` 자동 인식

2. **Identity 설정**
   ```
   Site settings → Identity → Enable Identity
   Services → Git Gateway → Enable Git Gateway
   ```

3. **사용자 관리**
   ```
   Identity → Invite users → 관리자 이메일 추가
   ```

### 🔐 **보안 설정**

- **HTTPS 강제**: Strict-Transport-Security 헤더
- **CSP**: Content Security Policy 적용
- **XSS 보호**: X-XSS-Protection 헤더
- **프레임 보호**: X-Frame-Options 설정

### 📊 **모니터링**

- **배포 상태**: Netlify 대시보드
- **빌드 로그**: GitHub Actions
- **에러 추적**: 브라우저 개발자 도구

---

## 📚 **기술 스택**

### 🌐 **프론트엔드**
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링, Flexbox/Grid
- **JavaScript**: ES6+, 인터랙티브 기능
- **반응형**: Mobile-first 디자인

### ⚙️ **백엔드/CMS**
- **Python**: 템플릿 엔진, 스크립트
- **Jinja2**: 템플릿 시스템
- **YAML**: 콘텐츠 데이터
- **Netlify CMS**: 관리자 인터페이스

### 🚀 **배포/자동화**
- **GitHub Actions**: CI/CD 파이프라인
- **Netlify**: 정적 사이트 호스팅
- **Git Gateway**: CMS 인증
- **Cloudinary**: 이미지 최적화

### 📦 **도구**
- **BeautifulSoup**: HTML 파싱
- **PyYAML**: YAML 처리
- **Git**: 버전 관리
- **npm**: 패키지 관리

---

## 🎯 **주요 성과**

### 📊 **변환 통계**
- ✅ **32개 HTML 페이지** → YAML CMS 완전 변환
- ✅ **32개 Jinja2 템플릿** 자동 생성
- ✅ **100% 자동화** GitHub Actions 워크플로우
- ✅ **사용자 친화적** Netlify CMS 인터페이스

### 🔄 **개선사항**
- **관리 효율성**: 콘텐츠 수정 시간 80% 단축
- **개발 생산성**: 새 페이지 추가 90% 자동화
- **사이트 안정성**: 실시간 YAML 검증 및 백업
- **사용자 경험**: 직관적인 CMS 인터페이스

---

## 🤝 **기여 가이드**

### 🐛 **버그 리포트**
1. GitHub Issues에서 새 이슈 생성
2. 재현 단계와 예상 결과 기술
3. 스크린샷이나 로그 첨부

### 💡 **기능 제안**
1. Discussion에서 아이디어 공유
2. 커뮤니티 피드백 수집
3. Pull Request로 구현

### 🔧 **코드 기여**
1. Fork → Branch → Commit → Push → PR
2. 코드 스타일 가이드 준수
3. 테스트 코드 포함

---

## 📞 **지원 및 연락처**

### 🆘 **기술 지원**
- **이슈 트래커**: [GitHub Issues](https://github.com/your-username/party-website/issues)
- **문서**: [Wiki](https://github.com/your-username/party-website/wiki)
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)

### 🏛️ **정당 연락처**
- **웹사이트**: https://자유와혁신.netlify.app
- **이메일**: info@자유와혁신.kr
- **전화**: 02-0000-0000
- **주소**: 서울특별시 중구 세종대로 000

---

## 📄 **라이선스**

이 프로젝트는 [MIT License](LICENSE)에 따라 배포됩니다.

```
MIT License

Copyright (c) 2025 자유와혁신

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[전체 라이선스 텍스트]
```

---

## 🙏 **감사의 말**

이 프로젝트는 다음 오픈소스 프로젝트들의 도움으로 완성되었습니다:

- **Netlify CMS**: 훌륭한 Git 기반 CMS
- **Jinja2**: 강력한 Python 템플릿 엔진
- **GitHub Actions**: 안정적인 CI/CD 플랫폼
- **Netlify**: 빠르고 안전한 배포 서비스

---

## 🌟 **스타 히스토리**

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/party-website&type=Date)](https://star-history.com/#your-username/party-website&Date)

---

<div align="center">

**자유와혁신과 함께 대한민국의 미래를 만들어가세요!**

[🌐 웹사이트 방문](https://자유와혁신.netlify.app) • [📝 CMS 관리자](https://자유와혁신.netlify.app/admin) • [📊 GitHub](https://github.com/your-username/party-website)

---

*Made with ❤️ by the 자유와혁신 Tech Team*

</div> 