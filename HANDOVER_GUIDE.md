# 프로젝트 인수인계 가이드

**수신**: kaivrary-forall (forall@kaivrary.com)  
**프로젝트**: 자유와혁신 공식 웹사이트  
**인수인계 일자**: 2025년 1월

---

## 📋 인수인계 체크리스트

### ✅ 완료된 항목
- [x] GitHub 협업자 초대 완료
- [ ] Vercel 프로젝트 소유권 이전
- [ ] Railway 프로젝트 소유권 이전
- [ ] MongoDB Atlas 권한 이전
- [ ] 환경 변수 문서 전달
- [ ] 관리자 계정 정보 전달
- [ ] 도메인 연결 확인

---

## 🔐 계정 정보 요약

### 1. GitHub
- **저장소**: https://github.com/sexysangmin/forthefreedom-kr
- **협업자 초대**: kaivrary-forall (완료 대기)
- **권한**: Admin (읽기/쓰기/설정 변경)

### 2. Vercel (프론트엔드 호스팅)
- **프로젝트명**: forthefreedom-kr
- **현재 URL**: https://forthefreedom-kr.vercel.app
- **이전 방법**: 프로젝트 소유권 이전
- **이전 대상**: forall@kaivrary.com

### 3. Railway (백엔드 서버)
- **프로젝트명**: forthefreedom-kr
- **서버 URL**: https://forthefreedom-kr-production.up.railway.app
- **이전 방법**: 팀 멤버 초대 후 소유권 이전
- **이전 대상**: forall@kaivrary.com

### 4. MongoDB Atlas (데이터베이스)
- **이전 방법**: Organization 또는 Project 권한 이전
- **이전 대상**: forall@kaivrary.com

### 5. 도메인
- **도메인**: forthefreedom.kr
- **현재 상태**: 구매 완료
- **연결 필요**: Vercel에 도메인 연결

---

## 🎯 서비스별 이관 절차

### A. GitHub 저장소 이관

#### 방법 1: 협업자로 시작 (추천)
```
1. 현재 상태: kaivrary-forall을 Collaborator로 초대 완료
2. kaivrary-forall이 초대 수락
3. 새 계정에서 저장소 접근 확인
4. 필요시 소유권 이전:
   - Settings → General → Transfer ownership
   - kaivrary-forall 입력
   - 이전 완료
```

#### 방법 2: 새 저장소 생성
```
1. kaivrary-forall 계정에서 새 저장소 생성
2. 현재 저장소 클론
3. 새 저장소에 푸시
4. Vercel/Railway 연결 업데이트
```

---

### B. Vercel 프로젝트 이관

```
1. Vercel 대시보드 접속
2. forthefreedom-kr 프로젝트 선택
3. Settings → General
4. "Transfer Project" 클릭
5. forall@kaivrary.com 입력
6. 이전 완료

이전 후 확인사항:
- 배포 상태 확인
- 도메인 연결 확인
- 환경 변수 확인 (현재는 없음)
```

---

### C. Railway 프로젝트 이관

```
1. Railway 대시보드 접속
2. forthefreedom-kr 프로젝트 선택
3. Settings → Members
4. forall@kaivrary.com 초대 (Owner 권한)
5. 새 계정에서 초대 수락
6. 새 계정에서 접근 확인 후 기존 계정 제거

중요: 환경 변수 백업
- Variables 탭에서 모든 환경 변수 복사
- ENVIRONMENT_VARIABLES.md 참조
```

---

### D. MongoDB Atlas 이관

```
방법 1: Organization 이전 (추천)
1. MongoDB Atlas 접속
2. Organization Settings → Users
3. forall@kaivrary.com 초대 (Organization Owner)
4. 새 계정에서 수락
5. 새 계정에서 접근 확인 후 기존 계정 제거

방법 2: 프로젝트 권한만 이전
1. Project Settings → Access Manager
2. forall@kaivrary.com을 Project Owner로 추가
3. 새 계정에서 접근 확인 후 기존 계정 제거
```

---

### E. 도메인 연결 (forthefreedom.kr)

```
1. 도메인 등록 업체 접속 (가비아/카페24 등)
2. DNS 설정 페이지 이동
3. CNAME 레코드 추가:
   - Type: CNAME
   - Name: @ (또는 www)
   - Value: cname.vercel-dns.com
   - TTL: 3600

4. Vercel 대시보드에서:
   - Project Settings → Domains
   - "Add Domain" 클릭
   - forthefreedom.kr 입력
   - DNS 설정 확인 대기 (최대 48시간)
```

---

## 📦 전달 파일 목록

### 1. 환경 변수 정보
- **파일**: ENVIRONMENT_VARIABLES.md
- **내용**: Railway 환경 변수, MongoDB URI, JWT Secret 등
- **전달 방법**: 이메일 (forall@kaivrary.com)

### 2. 관리자 계정 정보
```
CMS 관리자 페이지
- URL: https://forthefreedom.kr/admin/
- Username: admin
- Password: [Railway Variables의 ADMIN_PASSWORD 확인]
```

### 3. 프로젝트 문서
- README.md (업데이트 완료)
- ENVIRONMENT_VARIABLES.md (환경 변수 가이드)
- HANDOVER_GUIDE.md (이 문서)

---

## 🔧 인수인계 후 작업 사항

### 새 관리자가 해야 할 작업

#### 1. 보안 강화 (필수)
```
□ 모든 서비스 비밀번호 변경
  - GitHub 계정 비밀번호
  - Vercel 계정 비밀번호
  - Railway 계정 비밀번호
  - MongoDB Atlas 계정 비밀번호

□ JWT_SECRET 재생성
  - Railway Variables에서 새 값으로 변경
  - 생성: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

□ 관리자 비밀번호 변경
  - CMS 로그인 후 비밀번호 변경
  - Railway Variables의 ADMIN_PASSWORD 업데이트

□ MongoDB 보안 설정
  - Network Access → IP 화이트리스트 업데이트
  - 불필요한 사용자 제거

□ GitHub 2FA 활성화
  - Settings → Security → Two-factor authentication
```

#### 2. 서비스 확인
```
□ 웹사이트 접속 확인
  - https://forthefreedom.kr

□ 관리자 페이지 로그인 확인
  - https://forthefreedom.kr/admin/

□ API 서버 상태 확인
  - https://forthefreedom-kr-production.up.railway.app/api/health

□ 데이터베이스 연결 확인
  - MongoDB Atlas 대시보드에서 확인
```

#### 3. 테스트 배포
```
□ GitHub에 테스트 커밋
  - README.md 수정 등

□ Vercel 자동 배포 확인
  - 약 1-2분 소요

□ Railway 자동 배포 확인
  - 약 2-3분 소요

□ 변경사항 웹사이트에서 확인
```

---

## 💡 운영 가이드

### 콘텐츠 관리
```
1. https://forthefreedom.kr/admin/ 접속
2. 관리자 계정으로 로그인
3. 원하는 콘텐츠 섹션 선택:
   - 뉴스/공지사항
   - 포토 갤러리
   - 정책 자료
   - 선거 자료
4. 콘텐츠 추가/수정/삭제
5. 자동 저장 및 즉시 반영
```

### 코드 수정
```
1. GitHub 저장소 클론
2. 로컬에서 코드 수정
3. Git commit & push
4. Vercel/Railway 자동 배포 (1-3분)
5. 웹사이트에서 변경사항 확인
```

### 문제 해결
```
배포 실패 시:
- Railway 대시보드 → Deployments → 로그 확인
- Vercel 대시보드 → Deployments → 로그 확인

데이터베이스 오류 시:
- MongoDB Atlas → Metrics 확인
- Railway Variables → MONGODB_URI 확인

API 연결 오류 시:
- config.js의 API_BASE URL 확인
- Railway 서버 상태 확인
```

---

## 📊 서비스 비용 안내

### 현재 사용 중인 플랜
- **Vercel**: Hobby (무료) - 개인/소규모 프로젝트
- **Railway**: Hobby ($5/월) - 사용량에 따라 변동
- **MongoDB Atlas**: Free Tier (무료) - 512MB 스토리지

### 업그레이드 고려 시점
- 월 방문자 10만 이상: Vercel Pro ($20/월)
- 데이터베이스 512MB 초과: MongoDB Atlas M2 ($9/월)
- Railway 사용량 초과: 사용량에 따라 자동 청구

---

## 📞 기술 지원

### 공식 문서
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com

### 커뮤니티
- GitHub Issues: 프로젝트 저장소에서 이슈 등록
- Stack Overflow: 기술적 질문

---

## ✅ 최종 확인 사항

인수인계 완료 전 체크:

```
□ GitHub 접근 확인 (kaivrary-forall)
□ Vercel 프로젝트 접근 확인
□ Railway 프로젝트 접근 확인
□ MongoDB Atlas 접근 확인
□ 환경 변수 문서 수신 확인
□ 관리자 계정 로그인 확인
□ 웹사이트 정상 작동 확인
□ 테스트 배포 성공 확인
□ 도메인 연결 확인
□ 모든 비밀번호 변경 완료
```

---

## 🎯 다음 단계

1. **즉시**: GitHub 협업자 초대 수락
2. **1일 내**: Vercel, Railway, MongoDB 이관 완료
3. **3일 내**: 모든 비밀번호 변경 및 보안 강화
4. **1주일 내**: 도메인 연결 및 최종 테스트

---

**인수인계 담당자**: 전임 개발자  
**인수 담당자**: kaivrary-forall (forall@kaivrary.com)  
**긴급 연락**: 이메일로 문의

---

**중요**: 인수인계 완료 후 이 문서는 안전한 곳에 보관하시고, 
전임 개발자는 모든 서비스에서 계정을 제거합니다.

