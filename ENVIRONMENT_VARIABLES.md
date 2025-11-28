# 환경 변수 설정 가이드

이 문서는 프로젝트 인수인계를 위한 환경 변수 설정 정보입니다.

---

## 📋 백엔드 환경 변수 (Railway)

Railway 대시보드의 **Variables** 탭에서 다음 환경 변수들을 설정해야 합니다.

### 필수 환경 변수

```env
# 서버 설정
NODE_ENV=production
PORT=9000

# 데이터베이스 (MongoDB Atlas)
MONGODB_URI=[실제 MongoDB Atlas 연결 URI]
# 형식: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# CORS 설정 (프론트엔드 도메인)
ALLOWED_ORIGINS=https://forthefreedom.kr,https://www.forthefreedom.kr,https://forthefreedom-kr.vercel.app

# 파일 업로드 설정
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# 보안 설정
JWT_SECRET=[실제 JWT 시크릿 키]
# 추천: 32자 이상의 랜덤 문자열
# 생성 방법: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 관리자 계정
ADMIN_PASSWORD=[실제 관리자 비밀번호]
```

---

## 🔍 현재 설정된 값 확인 방법

### Railway 환경 변수 확인
1. Railway 대시보드 접속: https://railway.app
2. 프로젝트 선택: `forthefreedom-kr`
3. **Variables** 탭 클릭
4. 모든 환경 변수 값 확인 및 복사

### MongoDB Atlas 연결 URI 확인
1. MongoDB Atlas 접속: https://cloud.mongodb.com
2. 프로젝트 선택
3. **Connect** 버튼 클릭
4. **Connect your application** 선택
5. Connection String 복사

---

## 🎯 프론트엔드 환경 변수 (Vercel)

현재 프론트엔드는 환경 변수를 사용하지 않습니다.
API 연결은 `config.js` 파일에서 자동으로 설정됩니다.

### config.js 설정
```javascript
const API_CONFIG = {
    development: {
        API_BASE: 'http://localhost:9000/api'
    },
    production: {
        API_BASE: 'https://forthefreedom-kr-production.up.railway.app/api'
    }
};
```

---

## 🔐 로컬 개발 환경 설정

### 백엔드 .env 파일 생성

`server/.env` 파일을 생성하고 다음 내용을 입력:

```env
NODE_ENV=development
PORT=9000
MONGODB_URI=[MongoDB Atlas 연결 URI]
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000,http://127.0.0.1:8000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
JWT_SECRET=[JWT 시크릿 키]
ADMIN_PASSWORD=[관리자 비밀번호]
```

### 프론트엔드 설정

프론트엔드는 별도의 .env 파일이 필요 없습니다.
로컬 서버 실행 후 `http://localhost:8000` 접속하면 자동으로 로컬 API(`http://localhost:9000`)에 연결됩니다.

---

## 📝 환경 변수 설명

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `NODE_ENV` | 실행 환경 | `production` 또는 `development` |
| `PORT` | 서버 포트 | `9000` |
| `MONGODB_URI` | MongoDB 연결 주소 | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `ALLOWED_ORIGINS` | CORS 허용 도메인 | `https://forthefreedom.kr,https://www.forthefreedom.kr` |
| `MAX_FILE_SIZE` | 최대 파일 크기 (바이트) | `10485760` (10MB) |
| `UPLOAD_PATH` | 업로드 파일 저장 경로 | `./uploads` |
| `JWT_SECRET` | JWT 토큰 암호화 키 | 32자 이상 랜덤 문자열 |
| `ADMIN_PASSWORD` | 관리자 초기 비밀번호 | 강력한 비밀번호 |

---

## ⚠️ 보안 주의사항

1. **절대 GitHub에 업로드하지 마세요**
   - `.env` 파일은 `.gitignore`에 포함되어 있습니다
   - 환경 변수는 이메일이나 보안 채널로만 공유하세요

2. **비밀번호 강도**
   - JWT_SECRET: 최소 32자 이상
   - ADMIN_PASSWORD: 대소문자, 숫자, 특수문자 조합

3. **인수인계 후 변경 권장**
   - 모든 비밀번호 변경
   - JWT_SECRET 재생성
   - MongoDB 접근 IP 화이트리스트 업데이트

---

## 🔄 환경 변수 업데이트 방법

### Railway에서 업데이트
1. Railway 대시보드 → Variables 탭
2. 변경할 변수 선택
3. 새 값 입력
4. 저장 → 자동 재배포

### 로컬에서 업데이트
1. `server/.env` 파일 수정
2. 서버 재시작: `npm start`

---

**중요**: 이 문서는 인수인계 후 삭제하거나 안전한 곳에 보관하세요.

