# 🚀 자유와혁신 웹사이트 Git 마이그레이션 가이드

## 📋 현재 상황
- 기존 저장소: `https://github.com/sexysangmin/forthefreedom.git`
- 상태: 머지 충돌 + 많은 변경사항
- 권장: **새로운 저장소 생성**

## 🎯 1단계: 새로운 GitHub 저장소 생성

### GitHub에서 새 저장소 만들기
1. GitHub.com 로그인
2. 우상단 "+" → "New repository" 클릭
3. **추천 저장소명**: 
   - `liberty-innovation-party`
   - `freedom-innovation-kr`
   - `자유와혁신-official-website`

### 저장소 설정
```
Repository name: liberty-innovation-party
Description: 자유와혁신 공식 웹사이트 | Official website of Liberty and Innovation Party
Visibility: Public (추천) 또는 Private
```

## 🔧 2단계: 로컬 Git 재설정

### 현재 저장소와 연결 해제
```bash
# 현재 디렉토리에서 실행
git remote remove origin
```

### 새로운 저장소와 연결
```bash
# 새 저장소 URL로 변경 (예시)
git remote add origin https://github.com/[사용자명]/liberty-innovation-party.git
```

### 모든 변경사항 커밋
```bash
# 모든 파일 추가
git add .

# 초기 커밋
git commit -m "🎉 자유와혁신 공식 웹사이트 초기 버전

✨ 주요 기능:
- 완전한 CMS 시스템 (32개 YAML 파일)
- 로고 및 브랜딩 적용
- 친근한 네비게이션 메뉴
- 인터랙티브 당소개 페이지
- 모바일 반응형 디자인
- 실제 가입 시스템 연동

🚀 배포 준비 완료"
```

### 새 저장소에 푸시
```bash
# 메인 브랜치 푸시
git push -u origin main
```

## 🌐 3단계: 배포 설정

### Netlify 배포 (추천)
1. **Netlify 대시보드** 접속
2. **"New site from Git"** 클릭
3. **새로운 저장소** 선택
4. **빌드 설정**:
   ```
   Build command: (비워둠)
   Publish directory: . (루트)
   ```

### 도메인 설정
```
사이트명 예시:
- liberty-innovation-kr.netlify.app
- 자유와혁신.netlify.app
- freedom-innovation.netlify.app
```

## 📱 4단계: 최종 확인 체크리스트

### ✅ 웹사이트 기능 확인
- [ ] 홈페이지 로딩
- [ ] 모든 메뉴 작동
- [ ] 로고 표시
- [ ] 당원가입 링크 연결
- [ ] 모바일 반응형
- [ ] 폼 제출 기능

### ✅ 파일 확인
- [ ] 32개 HTML 페이지
- [ ] 32개 YAML CMS 파일
- [ ] 로고 파일 (logo.svg)
- [ ] 이미지 파일들
- [ ] CSS/JS 파일들

## 🔒 5단계: 보안 및 백업

### 저장소 보호 설정
```
GitHub Settings → Branches → Branch protection rules:
- Require pull request reviews
- Require status checks to pass
- Restrict pushes (선택사항)
```

### 백업 계획
- **자동 백업**: GitHub가 자동으로 처리
- **로컬 백업**: 정기적으로 `git pull` 실행
- **Netlify 백업**: 자동 배포 히스토리 보관

## 🚨 기존 저장소 처리

### 선택 1: 보관 (추천)
```bash
# 기존 저장소를 아카이브로 표시
GitHub에서 Settings → Archive this repository
```

### 선택 2: 삭제
- 완전히 확신하는 경우에만 삭제
- 백업 확인 후 진행

## 📞 문제 해결

### 자주 발생하는 문제
1. **푸시 실패**: 토큰 인증 확인
2. **빌드 오류**: 파일 경로 확인
3. **도메인 문제**: DNS 설정 확인

### 지원 연락처
- GitHub 지원: docs.github.com
- Netlify 지원: docs.netlify.com

---

## 🎉 완료!

새로운 저장소가 설정되면:
1. ✅ 깔끔한 Git 히스토리
2. ✅ 완벽한 배포 환경
3. ✅ 브랜드에 맞는 저장소명
4. ✅ 프로덕션 준비 완료

**최종 결과**: `https://새저장소명.netlify.app` 에서 완성된 웹사이트 확인! 