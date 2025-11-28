# 자유와혁신 공식 웹사이트

> 대한민국의 미래를 여는 정당, 자유와혁신의 공식 웹사이트

[![배포 상태](https://img.shields.io/badge/배포-활성화-green.svg)](https://forthefreedom.kr)
[![관리자 시스템](https://img.shields.io/badge/관리자-활성화-blue.svg)](https://forthefreedom.kr/admin)

---

## 🎯 프로젝트 개요

자유와혁신 정당의 공식 웹사이트입니다. 현대적인 웹 기술을 활용하여 구축되었으며, 관리자 페이지를 통해 콘텐츠를 쉽게 관리할 수 있습니다.

---

## 🛠️ 기술 스택

### 프론트엔드
- **HTML5, CSS3, JavaScript (ES6+)**
- **반응형 디자인** (모바일/태블릿/데스크톱)

### 백엔드
- **Node.js + Express**
- **MongoDB** (데이터베이스)
- **JWT 인증** (관리자 시스템)

### 배포
- **Vercel** (프론트엔드)
- **Railway** (백엔드 API)
- **MongoDB Atlas** (데이터베이스)

---

## 📁 프로젝트 구조

```
party-website/
├── index.html              # 메인 홈페이지
├── about/                  # 당 소개
├── news/                   # 소식 (활동, 행사, 갤러리)
├── members/                # 참여 (가입, 후원)
├── resources/              # 자료실
├── admin/                  # 관리자 페이지
├── server/                 # 백엔드 API 서버
│   ├── models/            # 데이터 모델
│   ├── routes/            # API 라우트
│   ├── controllers/       # 컨트롤러
│   └── middleware/        # 미들웨어
├── images/                 # 이미지 리소스
├── style.css              # 스타일시트
├── script.js              # 메인 스크립트
└── config.js              # API 설정
```

---

## 🚀 로컬 개발 환경 설정

### 1. 저장소 클론

```bash
git clone https://github.com/sexysangmin/forthefreedom-kr.git
cd forthefreedom-kr
```

### 2. 백엔드 서버 설정

```bash
cd server
npm install
```

환경 변수 설정 (`.env` 파일 생성):
```env
NODE_ENV=development
PORT=9000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=your_admin_password
```

백엔드 서버 실행:
```bash
npm start
```

### 3. 프론트엔드 실행

프로젝트 루트 디렉토리에서 로컬 서버 실행:
```bash
# Python 3 사용
python -m http.server 8000

# 또는 Node.js http-server 사용
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속

---

## 🎛️ 관리자 시스템

### 접속 방법
- URL: `https://forthefreedom.kr/admin/`
- 관리자 계정으로 로그인

### 관리 가능한 콘텐츠
- 📰 뉴스 및 공지사항
- 🖼️ 포토 갤러리
- 📄 정책 자료
- 🗳️ 선거 자료
- 📋 당헌당규

---

## 📦 배포 방법

### Vercel (프론트엔드)
1. Vercel에 GitHub 저장소 연결
2. 자동 배포 활성화
3. 도메인 연결

### Railway (백엔드)
1. Railway에 GitHub 저장소 연결
2. Root Directory를 `server`로 설정
3. 환경 변수 설정
4. 자동 배포 활성화

---

## 🔐 보안

- JWT 기반 인증 시스템
- HTTPS 강제 적용
- CORS 설정
- Rate Limiting
- XSS 보호

---

## 📞 지원

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**최종 업데이트**: 2025년 11월
**라이선스**: MIT
