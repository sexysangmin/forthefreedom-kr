# 웹사이트 보수 모드 사용법

## 📋 개요
웹사이트에 "보수중" 메시지를 표시하여 모든 콘텐츠를 숨기고 보수 안내만 보여주는 기능입니다.

## 🚀 보수 모드 활성화/비활성화

### 1. 보수 모드 켜기 (현재 설정)
- `maintenance.js` 파일이 존재하는 동안 항상 활성화됨
- 별도의 날짜 설정 없이 스크립트가 있으면 계속 보수 모드

### 2. 보수 모드 끄기 (완전 해제)
**방법 1: 파일 삭제 (권장)**
```bash
# maintenance.js 파일을 삭제하고 커밋/푸시
git rm maintenance.js
git commit -m "보수 모드 해제"
git push
```

**방법 2: 설정 변경**
```javascript
const MAINTENANCE_CONFIG = {
    enabled: false,          // ← 이 값을 false로 설정
    // ...
};
```

## 🎨 메시지 커스터마이징

```javascript
const MAINTENANCE_CONFIG = {
    // ...
    message: '웹사이트 보수중입니다',                    // 제목 변경
    description: '더 나은 서비스 제공을 위해...'        // 설명 변경
};
```

## 📁 적용된 페이지들

현재 다음 페이지들에 보수 모드가 적용되어 있습니다:
- `index.html` - 메인 페이지
- `about.html` - 소개 페이지  
- `about/principles.html` - 강령·당헌·당규 페이지
- `news.html` - 뉴스 페이지

## ⚡ 빠른 실행 가이드

### 보수 모드 즉시 활성화
1. `maintenance.js` 파일 열기
2. `enabled: true` 로 변경
3. 커밋 및 푸시
4. 웹사이트 확인

### 보수 모드 즉시 비활성화  
1. `maintenance.js` 파일 열기
2. `enabled: false` 로 변경
3. 커밋 및 푸시
4. 웹사이트 확인

## 🔧 기술적 동작 방식

1. 페이지 로드 시 `maintenance.js`가 실행됨
2. 현재 날짜와 설정을 비교하여 보수 모드 여부 판단
3. 보수 모드일 경우:
   - 기존 페이지 콘텐츠를 모두 숨김 (`display: none`)
   - 보수중 오버레이를 전체 화면에 표시
   - 스크롤 비활성화

## 🎯 주의사항

- JavaScript가 비활성화된 브라우저에서는 원본 페이지가 보일 수 있습니다
- 검색엔진 크롤러는 보수중 페이지를 인덱싱할 수 있습니다
- 보수 기간이 길 경우 SEO에 영향을 줄 수 있습니다

## 💡 팁

- 보수 종료일을 하루 여유있게 설정하는 것을 권장합니다
- 보수 완료 후에는 `enabled: false`로 설정하여 완전히 비활성화하세요
- 긴급하게 비활성화해야 할 경우 `enabled: false`만 변경하면 됩니다
