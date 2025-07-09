#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
자유와혁신 정당 CMS 시스템
HTML → Jinja2 템플릿 자동 생성기

기존 HTML 파일을 분석하여 Jinja2 템플릿으로 변환합니다.
"""

import os
import re
import argparse
from pathlib import Path
from bs4 import BeautifulSoup, Comment
from typing import Dict, List, Tuple, Optional

class TemplateGenerator:
    """HTML을 Jinja2 템플릿으로 변환하는 클래스"""
    
    def __init__(self):
        """초기화"""
        self.replacements = []
        self.content_patterns = {
            # 제목 패턴들
            'title': [
                r'<title>(.*?)</title>',
                r'<h1[^>]*>(.*?)</h1>',
                r'<h2[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)</h2>'
            ],
            # 설명 패턴들
            'description': [
                r'<meta\s+name="description"\s+content="([^"]*)"',
                r'<p[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)</p>',
                r'<div[^>]*class="[^"]*intro[^"]*"[^>]*>(.*?)</div>'
            ],
            # 콘텐츠 패턴들
            'content': [
                r'<main[^>]*>(.*?)</main>',
                r'<article[^>]*>(.*?)</article>',
                r'<section[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)</section>'
            ],
            # 네비게이션 패턴들
            'navigation': [
                r'<nav[^>]*>(.*?)</nav>',
                r'<ul[^>]*class="[^"]*nav[^"]*"[^>]*>(.*?)</ul>'
            ]
        }
    
    def read_html_file(self, html_path: str) -> str:
        """HTML 파일 읽기"""
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            # UTF-8 실패시 다른 인코딩 시도
            encodings = ['cp949', 'euc-kr', 'latin-1']
            for encoding in encodings:
                try:
                    with open(html_path, 'r', encoding=encoding) as f:
                        content = f.read()
                        print(f"⚠️ {encoding} 인코딩으로 읽음: {html_path}")
                        return content
                except:
                    continue
            raise Exception(f"지원되지 않는 인코딩: {html_path}")
    
    def extract_dynamic_content(self, soup: BeautifulSoup) -> Dict[str, str]:
        """동적 콘텐츠 영역 식별 및 추출"""
        dynamic_areas = {}
        
        # 1. 페이지 제목
        title_tag = soup.find('title')
        if title_tag:
            dynamic_areas['page_title'] = title_tag.get_text(strip=True)
        
        # 2. 메타 설명
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            dynamic_areas['meta_description'] = meta_desc.get('content', '')
        
        # 3. 메인 제목 (h1)
        main_title = soup.find('h1')
        if main_title:
            dynamic_areas['main_title'] = main_title.get_text(strip=True)
        
        # 4. 섹션 제목들 (h2, h3)
        section_titles = soup.find_all(['h2', 'h3'])
        for i, title in enumerate(section_titles):
            dynamic_areas[f'section_title_{i+1}'] = title.get_text(strip=True)
        
        # 5. 주요 콘텐츠 영역
        content_selectors = [
            'main', 'article', '.content', '.main-content', 
            '#content', '#main', '.container .content'
        ]
        
        for selector in content_selectors:
            if selector.startswith('.'):
                elements = soup.find_all(class_=selector[1:])
            elif selector.startswith('#'):
                elements = [soup.find(id=selector[1:])]
            else:
                elements = soup.find_all(selector)
            
            for i, element in enumerate(elements):
                if element:
                    key = f'content_{selector.replace("#", "").replace(".", "")}_{i+1}'
                    dynamic_areas[key] = str(element)
        
        return dynamic_areas
    
    def identify_template_variables(self, html_content: str) -> List[Tuple[str, str, str]]:
        """템플릿 변수로 변환할 영역 식별"""
        replacements = []
        
        # HTML 파싱
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 1. 페이지 제목
        title_tag = soup.find('title')
        if title_tag:
            original = str(title_tag)
            replacement = '<title>{{ metadata.title }} - {{ site_name }}</title>'
            replacements.append((original, replacement, 'page_title'))
        
        # 2. 메타 설명
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            original = str(meta_desc)
            new_tag = soup.new_tag('meta', **{'name': 'description', 'content': '{{ metadata.description }}'})
            replacement = str(new_tag)
            replacements.append((original, replacement, 'meta_description'))
        
        # 3. 메인 제목
        h1_tags = soup.find_all('h1')
        for i, h1 in enumerate(h1_tags):
            original = str(h1)
            # 클래스와 다른 속성 보존
            attrs = h1.attrs
            attrs_str = ' '.join([f'{k}="{v}"' if isinstance(v, str) else f'{k}="{" ".join(v)}"' for k, v in attrs.items()])
            if attrs_str:
                replacement = f'<h1 {attrs_str}>{{{{ content.main_title or metadata.title }}}}</h1>'
            else:
                replacement = '<h1>{{ content.main_title or metadata.title }}</h1>'
            replacements.append((original, replacement, f'main_title_{i+1}'))
        
        # 4. 섹션 제목들
        for tag_name in ['h2', 'h3', 'h4']:
            headers = soup.find_all(tag_name)
            for i, header in enumerate(headers):
                original = str(header)
                text = header.get_text(strip=True)
                
                # 동적 콘텐츠로 보이는 헤더만 변환
                if self._is_dynamic_content(text):
                    attrs = header.attrs
                    attrs_str = ' '.join([f'{k}="{v}"' if isinstance(v, str) else f'{k}="{" ".join(v)}"' for k, v in attrs.items()])
                    
                    var_name = f'section_titles.{tag_name}_{i+1}'
                    if attrs_str:
                        replacement = f'<{tag_name} {attrs_str}>{{{{ {var_name} or "{text}" }}}}</{tag_name}>'
                    else:
                        replacement = f'<{tag_name}>{{{{ {var_name} or "{text}" }}}}</{tag_name}>'
                    
                    replacements.append((original, replacement, f'{tag_name}_title_{i+1}'))
        
        # 5. 텍스트 콘텐츠 영역
        content_elements = soup.find_all(['p', 'div'], class_=re.compile(r'(content|description|intro|summary)'))
        for i, element in enumerate(content_elements):
            original = str(element)
            text = element.get_text(strip=True)
            
            if self._is_dynamic_content(text) and len(text) > 20:
                tag_name = element.name
                attrs = element.attrs
                attrs_str = ' '.join([f'{k}="{v}"' if isinstance(v, str) else f'{k}="{" ".join(v)}"' for k, v in attrs.items()])
                
                var_name = f'content.{element.get("class", ["text"])[0]}_{i+1}'
                if attrs_str:
                    replacement = f'<{tag_name} {attrs_str}>{{{{ {var_name} | markdown_to_html | safe }}}}</{tag_name}>'
                else:
                    replacement = f'<{tag_name}>{{{{ {var_name} | markdown_to_html | safe }}}}</{tag_name}>'
                
                replacements.append((original, replacement, f'content_{i+1}'))
        
        return replacements
    
    def _is_dynamic_content(self, text: str) -> bool:
        """텍스트가 동적 콘텐츠인지 판단"""
        # 정적 텍스트 패턴들 (변환하지 않을 것들)
        static_patterns = [
            r'^(홈|소개|정책|뉴스|공지|자료|후원|로그인|회원가입)$',
            r'^(Copyright|©|\d{4}년?)',
            r'^(전체|목록|상세|이전|다음|첫째|둘째)$',
        ]
        
        for pattern in static_patterns:
            if re.match(pattern, text.strip()):
                return False
        
        # 동적 콘텐츠 패턴들
        dynamic_patterns = [
            r'자유와혁신',  # 당명
            r'\d{4}년 \d{1,2}월 \d{1,2}일',  # 날짜
            r'[가-힣]+위원회|[가-힣]+준비위|[가-힣]+본부',  # 조직명
            r'정책|공약|비전|목표|계획',  # 정책 관련
            r'행사|집회|토론회|간담회|설명회',  # 이벤트 관련
        ]
        
        for pattern in dynamic_patterns:
            if re.search(pattern, text):
                return True
        
        # 길이 기반 판단 (긴 텍스트는 보통 동적)
        return len(text.strip()) > 50
    
    def generate_template_structure(self, html_content: str) -> str:
        """Jinja2 템플릿 구조 생성"""
        # 기본 템플릿 헤더 추가
        template_content = html_content
        
        # HTML 주석으로 템플릿 정보 추가
        header_comment = """<!--
자유와혁신 CMS 시스템 - Jinja2 템플릿
생성일: {{ generated_at }}
데이터 소스: {{ metadata.source or 'YAML 파일' }}

사용 가능한 변수들:
- metadata: 페이지 메타데이터 (title, description, keywords 등)
- content: 페이지 주요 콘텐츠
- site_name: 사이트명 (자유와혁신)
- current_year: 현재 연도
- generated_at: 생성 시간

필터들:
- format_date: 날짜 포맷팅
- markdown_to_html: 마크다운을 HTML로 변환
- truncate_words: 텍스트 길이 제한
- safe: HTML 태그 허용
-->

"""
        
        # DOCTYPE 뒤에 주석 삽입
        if '<!DOCTYPE' in template_content:
            parts = template_content.split('>', 1)
            if len(parts) == 2:
                template_content = parts[0] + '>\n' + header_comment + parts[1]
        else:
            template_content = header_comment + template_content
        
        return template_content
    
    def apply_replacements(self, html_content: str, replacements: List[Tuple[str, str, str]]) -> str:
        """식별된 영역을 Jinja2 변수로 교체"""
        template_content = html_content
        
        for original, replacement, var_name in replacements:
            template_content = template_content.replace(original, replacement)
        
        return template_content
    
    def add_conditional_blocks(self, template_content: str) -> str:
        """조건부 블록 추가"""
        # 네비게이션 활성 상태
        nav_pattern = r'<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>'
        
        def replace_nav_link(match):
            href = match.group(1)
            text = match.group(2)
            return f'<a href="{href}" class="{{{{ \'active\' if current_page == \'{href}\' else \'\' }}}}">{text}</a>'
        
        template_content = re.sub(nav_pattern, replace_nav_link, template_content)
        
        # 조건부 섹션들
        conditional_patterns = [
            (r'<section[^>]*class="[^"]*notices?[^"]*"[^>]*>(.*?)</section>', 
             '{% if content.notices %}<section class="notices">{{ content.notices | safe }}</section>{% endif %}'),
            (r'<section[^>]*class="[^"]*events?[^"]*"[^>]*>(.*?)</section>', 
             '{% if content.events %}<section class="events">{{ content.events | safe }}</section>{% endif %}'),
        ]
        
        for pattern, replacement in conditional_patterns:
            template_content = re.sub(pattern, replacement, template_content, flags=re.DOTALL)
        
        return template_content
    
    def add_loops(self, template_content: str) -> str:
        """반복 블록 추가 (리스트, 카드 등)"""
        # 카드/아이템 리스트 패턴
        card_patterns = [
            # 정책 카드
            r'<div[^>]*class="[^"]*policy-card[^"]*"[^>]*>.*?</div>',
            # 뉴스 아이템
            r'<div[^>]*class="[^"]*news-item[^"]*"[^>]*>.*?</div>',
            # 이벤트 카드
            r'<div[^>]*class="[^"]*event-card[^"]*"[^>]*>.*?</div>',
        ]
        
        for pattern in card_patterns:
            matches = re.findall(pattern, template_content, re.DOTALL)
            if matches:
                # 첫 번째 카드를 템플릿으로 사용
                original_card = matches[0]
                
                # 루프 템플릿 생성
                loop_template = """
{% for item in content.items %}
<div class="item-card">
    <h3>{{ item.title }}</h3>
    <p>{{ item.description | truncate_words(100) }}</p>
    {% if item.date %}
    <span class="date">{{ item.date | format_date }}</span>
    {% endif %}
    {% if item.link %}
    <a href="{{ item.link }}" class="read-more">자세히 보기</a>
    {% endif %}
</div>
{% endfor %}
"""
                # 모든 카드를 루프로 교체
                for card in matches:
                    template_content = template_content.replace(card, loop_template, 1)
                    loop_template = ""  # 첫 번째 교체 후에는 빈 문자열
        
        return template_content
    
    def generate_template(self, html_path: str, output_path: str) -> bool:
        """HTML 파일을 Jinja2 템플릿으로 변환"""
        try:
            print(f"🔄 템플릿 생성 시작: {html_path}")
            
            # 1. HTML 파일 읽기
            html_content = self.read_html_file(html_path)
            
            # 2. 동적 영역 식별
            replacements = self.identify_template_variables(html_content)
            print(f"📊 식별된 동적 영역: {len(replacements)}개")
            
            # 3. 템플릿 구조 생성
            template_content = self.generate_template_structure(html_content)
            
            # 4. 변수 교체 적용
            template_content = self.apply_replacements(template_content, replacements)
            
            # 5. 조건부 블록 추가
            template_content = self.add_conditional_blocks(template_content)
            
            # 6. 반복 블록 추가
            template_content = self.add_loops(template_content)
            
            # 7. 출력 디렉토리 생성
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
            
            # 8. 템플릿 파일 저장
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(template_content)
            
            print(f"✅ 템플릿 생성 완료: {output_path}")
            print(f"📊 변환된 변수: {len(replacements)}개")
            
            # 변환 요약 출력
            if replacements:
                print("🔧 적용된 변환:")
                for i, (_, _, var_name) in enumerate(replacements[:5]):  # 처음 5개만 표시
                    print(f"  - {var_name}")
                if len(replacements) > 5:
                    print(f"  ... 외 {len(replacements) - 5}개")
            
            return True
            
        except Exception as e:
            print(f"❌ 템플릿 생성 실패: {html_path}")
            print(f"오류: {e}")
            return False

def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description='자유와혁신 CMS - HTML to Jinja2 템플릿 생성기',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  python template-generator.py --html index.html --output templates/index.template.html
  python template-generator.py --html about.html --output templates/about.template.html
  python template-generator.py --directory ./ --template-dir templates/
        """
    )
    
    parser.add_argument(
        '--html',
        help='변환할 HTML 파일 경로'
    )
    
    parser.add_argument(
        '--output',
        help='출력 템플릿 파일 경로'
    )
    
    parser.add_argument(
        '--directory',
        help='HTML 파일들이 있는 디렉토리 (일괄 변환)'
    )
    
    parser.add_argument(
        '--template-dir',
        default='templates',
        help='템플릿 출력 디렉토리 (기본값: templates)'
    )
    
    parser.add_argument(
        '--recursive',
        action='store_true',
        help='하위 디렉토리까지 재귀적으로 변환'
    )
    
    args = parser.parse_args()
    
    generator = TemplateGenerator()
    
    if args.html and args.output:
        # 단일 파일 변환
        success = generator.generate_template(args.html, args.output)
        sys.exit(0 if success else 1)
    
    elif args.directory:
        # 디렉토리 일괄 변환
        directory = Path(args.directory)
        template_dir = Path(args.template_dir)
        
        # 템플릿 디렉토리 생성
        template_dir.mkdir(exist_ok=True)
        
        # HTML 파일 찾기
        pattern = "**/*.html" if args.recursive else "*.html"
        html_files = list(directory.glob(pattern))
        
        print(f"🔍 발견된 HTML 파일: {len(html_files)}개")
        
        success_count = 0
        for html_file in html_files:
            # 템플릿 파일 경로 생성
            relative_path = html_file.relative_to(directory)
            template_path = template_dir / f"{relative_path.stem}.template.html"
            
            # 하위 디렉토리 생성
            template_path.parent.mkdir(parents=True, exist_ok=True)
            
            if generator.generate_template(str(html_file), str(template_path)):
                success_count += 1
        
        print(f"\n🎉 변환 완료: {success_count}/{len(html_files)}개 성공")
        sys.exit(0 if success_count == len(html_files) else 1)
    
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == '__main__':
    import sys
    main() 