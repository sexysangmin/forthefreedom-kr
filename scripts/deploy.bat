@echo off
chcp 65001 > nul
echo.
echo ==========================================
echo 자유와혁신 CMS 시스템 배포 스크립트
echo ==========================================
echo.

REM 현재 디렉토리 확인
echo 📁 현재 위치: %CD%
echo.

REM Git 상태 확인
echo 🔍 Git 상태 확인 중...
git status --porcelain > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Git 저장소가 아니거나 Git이 설치되지 않았습니다.
    pause
    exit /b 1
)

REM 변경사항 확인
echo.
echo 📊 변경된 파일들:
git status --short
echo.

REM 사용자 확인
set /p CONFIRM="계속 진행하시겠습니까? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ⚠️ 배포가 취소되었습니다.
    pause
    exit /b 0
)

echo.
echo 🚀 배포 시작...
echo.

REM 1. 모든 변경사항 스테이징
echo 📦 1단계: 파일 스테이징
git add .
if %ERRORLEVEL% neq 0 (
    echo ❌ 파일 스테이징 실패!
    pause
    exit /b 1
)
echo ✅ 스테이징 완료
echo.

REM 2. 커밋
echo 💾 2단계: 변경사항 커밋
set /p COMMIT_MSG="커밋 메시지를 입력하세요 (기본: CMS 시스템 업데이트): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=CMS 시스템 업데이트

git commit -m "%COMMIT_MSG%"
if %ERRORLEVEL% neq 0 (
    echo ❌ 커밋 실패!
    pause
    exit /b 1
)
echo ✅ 커밋 완료
echo.

REM 3. 원격 저장소에 푸시
echo 🌐 3단계: 원격 저장소에 푸시
git push origin main
if %ERRORLEVEL% neq 0 (
    echo ❌ 푸시 실패!
    echo ℹ️ 다음을 확인해주세요:
    echo   - 인터넷 연결 상태
    echo   - GitHub 인증 정보
    echo   - 원격 저장소 권한
    pause
    exit /b 1
)
echo ✅ 푸시 완료
echo.

REM 4. 배포 상태 확인
echo 🔄 4단계: 배포 상태 확인
echo.
echo 📋 배포 정보:
echo   - 브랜치: main
echo   - 커밋: %COMMIT_MSG%
echo   - 시간: %DATE% %TIME%
echo.

echo ⏳ Netlify에서 자동 배포가 진행됩니다...
echo 📱 배포 상태 확인: https://app.netlify.com/sites/[your-site-id]/deploys
echo.

REM 5. CMS 관리자 안내
echo 🎯 5단계: CMS 관리자 설정 안내
echo.
echo 다음 단계를 완료하여 CMS를 활성화하세요:
echo.
echo 1️⃣ Netlify 대시보드에서 Identity 활성화
echo    → Site settings → Identity → Enable Identity
echo.
echo 2️⃣ Git Gateway 활성화
echo    → Identity → Services → Git Gateway → Enable Git Gateway
echo.
echo 3️⃣ 사용자 초대
echo    → Identity → Invite users → 관리자 이메일 입력
echo.
echo 4️⃣ CMS 관리자 접속
echo    → https://[your-site-url]/admin
echo.

REM 추가 도구 안내
echo 🔧 추가 도구:
echo   - 로컬 CMS 서버: npm run cms
echo   - 개발 서버: python -m http.server 3000
echo   - 상태 확인: git status
echo.

echo ✨ 배포 스크립트 완료!
echo.
echo 📞 문제가 있을 경우:
echo   1. GitHub Actions 로그 확인
echo   2. Netlify 빌드 로그 확인  
echo   3. 브라우저 개발자 도구 콘솔 확인
echo.

REM 선택적으로 브라우저에서 사이트 열기
set /p OPEN_SITE="사이트를 브라우저에서 여시겠습니까? (y/N): "
if /i "%OPEN_SITE%"=="y" (
    echo 🌐 사이트 열기...
    start https://자유와혁신.netlify.app
    start https://자유와혁신.netlify.app/admin
)

echo.
echo 🎉 모든 작업이 완료되었습니다!
pause 