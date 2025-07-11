# CSS 경로 수정 스크립트
Write-Host "CSS 경로 수정 시작..." -ForegroundColor Green

# 모든 HTML 파일에서 CSS 경로를 절대 경로로 통일
$files = Get-ChildItem -Path "." -Recurse -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 다양한 CSS 경로 패턴을 절대 경로로 변경
    $content = $content -replace 'href="css/style\.css"', 'href="/style.css"'
    $content = $content -replace 'href="style\.css"', 'href="/style.css"'
    $content = $content -replace 'href="\.\./style\.css"', 'href="/style.css"'
    $content = $content -replace 'href="\.\./css/style\.css"', 'href="/style.css"'
    
    # 변경사항이 있으면 파일 저장
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -Encoding UTF8
        Write-Host "수정됨: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "CSS 경로 수정 완료!" -ForegroundColor Green 