#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
공지사항 Markdown 파일들을 JSON으로 변환하는 스크립트
CMS에서 수정된 내용을 웹사이트에 반영하기 위함
"""

import os
import json
import re
from datetime import datetime

def parse_frontmatter(content):
    """Frontmatter 파싱"""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
    if not match:
        return {}, content
    
    frontmatter_text = match.group(1)
    body_content = match.group(2)
    
    frontmatter = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"\'')
            
            if value == 'true':
                value = True
            elif value == 'false':
                value = False
                
            frontmatter[key] = value
    
    return frontmatter, body_content

def markdown_to_html(markdown_text):
    """간단한 Markdown → HTML 변환"""
    html = markdown_text
    
    # 제목 변환
    html = re.sub(r'^### (.*$)', r'<h3 class="text-lg font-semibold mt-6 mb-3">\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2 class="text-xl font-semibold mt-6 mb-3">\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1 class="text-2xl font-bold mt-6 mb-4">\1</h1>', html, flags=re.MULTILINE)
    
    # 굵은 글씨
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    
    # 리스트 변환
    html = re.sub(r'^- (.*$)', r'<li>\1</li>', html, flags=re.MULTILINE)
    
    # 연속된 li 태그들을 ul로 감싸기
    html = re.sub(r'(<li>.*?</li>\s*)+', lambda m: f'<ul class="list-disc ml-6 space-y-2">{m.group(0)}</ul>', html, flags=re.DOTALL)
    
    # 문단 변환
    paragraphs = html.split('\n\n')
    html_paragraphs = []
    
    for para in paragraphs:
        para = para.strip()
        if para and not para.startswith('<'):
            html_paragraphs.append(f'<p class="mt-4">{para}</p>')
        elif para:
            html_paragraphs.append(para)
    
    return '\n'.join(html_paragraphs)

def build_notices():
    """공지사항 JSON 빌드"""
    notices_dir = '_posts/notices'
    output_file = 'js/notices-data.json'
    
    print(f"🔍 공지사항 디렉토리 확인: {notices_dir}")
    
    if not os.path.exists(notices_dir):
        print(f"❌ 공지사항 디렉토리가 없습니다: {notices_dir}")
        return
    
    notices = []
    
    print(f"📁 {notices_dir} 디렉토리에서 .md 파일들을 검색 중...")
    
    md_files = [f for f in os.listdir(notices_dir) if f.endswith('.md')]
    print(f"📄 발견된 .md 파일들: {md_files}")
    
    for filename in md_files:
        filepath = os.path.join(notices_dir, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            frontmatter, body = parse_frontmatter(content)
            html_content = markdown_to_html(body)
            
            notice = {
                'id': filename.replace('.md', ''),
                'filename': filename,
                'title': frontmatter.get('title', ''),
                'date': str(frontmatter.get('date', '')),
                'category': frontmatter.get('category', '일반'),
                'priority': frontmatter.get('priority', False),
                'excerpt': frontmatter.get('excerpt', ''),
                'author': frontmatter.get('author', '관리자'),
                'content': html_content
            }
            
            notices.append(notice)
            print(f"✅ 처리 완료: {filename} - {frontmatter.get('title', '제목 없음')}")
            
        except Exception as e:
            print(f"❌ 오류 발생: {filename} - {e}")
    
    # 정렬: 중요도 우선, 그 다음 날짜순 (최신순)
    def sort_notices(notice):
        # priority가 True면 0, False면 1 (중요 공지가 먼저)
        priority_order = 0 if notice['priority'] else 1
        # 날짜는 최신순으로 (음수를 곱해서 역순 정렬)
        date_str = notice['date']
        try:
            # YYYY-MM-DD 형식에서 정렬용 숫자로 변환
            date_parts = date_str.split('-')
            date_value = int(date_parts[0]) * 10000 + int(date_parts[1]) * 100 + int(date_parts[2])
            date_order = -date_value  # 음수로 최신순
        except:
            date_order = 0
        
        return (priority_order, date_order)
    
    notices.sort(key=sort_notices)
    
    # js 디렉토리 생성
    os.makedirs('js', exist_ok=True)
    
    # JSON 결과 생성
    result = {
        'notices': notices,
        'last_updated': datetime.now().isoformat(),
        'total_count': len(notices),
        'build_info': {
            'script_version': '1.0',
            'source_directory': notices_dir,
            'processed_files': [n['filename'] for n in notices]
        }
    }
    
    # JSON 파일로 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n🎉 빌드 완료!")
    print(f"📊 총 {len(notices)}개 공지사항이 {output_file}에 저장되었습니다.")
    print(f"📅 마지막 업데이트: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 결과 미리보기
    if notices:
        print(f"\n📋 생성된 공지사항 목록:")
        for i, notice in enumerate(notices, 1):
            priority_mark = "🔴" if notice['priority'] else "⚪"
            print(f"  {i}. {priority_mark} {notice['title']} ({notice['date']})")

if __name__ == '__main__':
    print("🚀 공지사항 JSON 빌드 시작...")
    build_notices()
    print("✨ 빌드 완료!") 