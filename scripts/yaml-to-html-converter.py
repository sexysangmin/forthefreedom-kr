#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
자유와혁신 정당 CMS 시스템
YAML → HTML 변환 스크립트

이 스크립트는 YAML 콘텐츠 파일을 HTML 템플릿과 결합하여
완전한 웹페이지를 생성합니다.
"""

import os
import sys
import yaml
import argparse
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional
from jinja2 import Template, Environment, FileSystemLoader
from bs4 import BeautifulSoup
import re

class YAMLToHTMLConverter:
    """YAML을 HTML로 변환하는 메인 클래스"""
    
    def __init__(self, template_dir: str = "templates"):
        """
        초기화
        
        Args:
            template_dir: 템플릿 디렉토리 경로
        """
        self.template_dir = Path(template_dir)
        self.env = Environment(
            loader=FileSystemLoader(self.template_dir),
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True
        )
        
        # 사용자 정의 필터 등록
        self.register_custom_filters()
    
    def register_custom_filters(self):
        """Jinja2 사용자 정의 필터 등록"""
        
        @self.env.filter('format_date')
        def format_date(date_str: str, format_str: str = '%Y년 %m월 %d일') -> str:
            """날짜 포맷팅"""
            try:
                if isinstance(date_str, str):
                    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                    return date_obj.strftime(format_str)
                return str(date_str)
            except:
                return str(date_str)
        
        @self.env.filter('truncate_words')
        def truncate_words(text: str, length: int = 100) -> str:
            """텍스트 단어 수 제한"""
            if len(text) <= length:
                return text
            return text[:length] + '...'
        
        @self.env.filter('markdown_to_html')
        def markdown_to_html(text: str) -> str:
            """간단한 마크다운 → HTML 변환"""
            if not text:
                return ''
            
            # 볼드 텍스트
            text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
            text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
            
            # 링크
            text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
            
            # 줄바꿈
            text = text.replace('\n', '<br>')
            
            return text
        
        @self.env.filter('safe_html')
        def safe_html(text: str) -> str:
            """HTML 안전 처리"""
            if not text:
                return ''
            
            # BeautifulSoup으로 HTML 정리
            soup = BeautifulSoup(text, 'html.parser')
            return str(soup)
        
        @self.env.filter('json_encode')
        def json_encode(obj: Any) -> str:
            """JSON 인코딩"""
            return json.dumps(obj, ensure_ascii=False, indent=2)
    
    def load_yaml(self, yaml_path: str) -> Dict[str, Any]:
        """
        YAML 파일 로드
        
        Args:
            yaml_path: YAML 파일 경로
            
        Returns:
            로드된 YAML 데이터
        """
        try:
            with open(yaml_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                
            if data is None:
                raise ValueError(f"YAML 파일이 비어있습니다: {yaml_path}")
                
            return data
            
        except yaml.YAMLError as e:
            raise ValueError(f"YAML 구문 오류: {yaml_path}\n{e}")
        except FileNotFoundError:
            raise FileNotFoundError(f"YAML 파일을 찾을 수 없습니다: {yaml_path}")
        except Exception as e:
            raise Exception(f"YAML 로드 실패: {yaml_path}\n{e}")
    
    def validate_yaml_structure(self, data: Dict[str, Any], yaml_path: str) -> bool:
        """
        YAML 데이터 구조 검증
        
        Args:
            data: YAML 데이터
            yaml_path: YAML 파일 경로
            
        Returns:
            검증 성공 여부
        """
        required_fields = ['metadata', 'content']
        
        for field in required_fields:
            if field not in data:
                print(f"❌ 필수 필드 누락: {field} in {yaml_path}")
                return False
        
        # metadata 검증
        metadata = data.get('metadata', {})
        if 'title' not in metadata:
            print(f"❌ metadata.title 필드 누락: {yaml_path}")
            return False
        
        return True
    
    def load_template(self, template_path: str) -> Template:
        """
        템플릿 파일 로드
        
        Args:
            template_path: 템플릿 파일 경로
            
        Returns:
            Jinja2 템플릿 객체
        """
        try:
            # 템플릿 경로에서 상대 경로 추출
            template_name = os.path.relpath(template_path, self.template_dir)
            return self.env.get_template(template_name)
            
        except Exception as e:
            raise Exception(f"템플릿 로드 실패: {template_path}\n{e}")
    
    def render_html(self, template: Template, data: Dict[str, Any]) -> str:
        """
        HTML 렌더링
        
        Args:
            template: Jinja2 템플릿
            data: YAML 데이터
            
        Returns:
            렌더링된 HTML
        """
        try:
            # 공통 컨텍스트 추가
            context = {
                **data,
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'site_name': '자유와혁신',
                'site_description': '대한민국의 미래를 여는 자유와혁신 정당',
                'current_year': datetime.now().year
            }
            
            return template.render(context)
            
        except Exception as e:
            raise Exception(f"HTML 렌더링 실패:\n{e}")
    
    def beautify_html(self, html_content: str) -> str:
        """
        HTML 포맷팅 및 최적화
        
        Args:
            html_content: 원본 HTML
            
        Returns:
            포맷팅된 HTML
        """
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # HTML 구조 정리
            prettified = soup.prettify()
            
            # 불필요한 공백 제거
            prettified = re.sub(r'\n\s*\n', '\n', prettified)
            
            return prettified
            
        except Exception as e:
            print(f"⚠️ HTML 포맷팅 실패: {e}")
            return html_content
    
    def convert(self, yaml_path: str, template_path: str, output_path: str, validate: bool = True) -> bool:
        """
        YAML을 HTML로 변환
        
        Args:
            yaml_path: YAML 파일 경로
            template_path: 템플릿 파일 경로  
            output_path: 출력 HTML 파일 경로
            validate: YAML 구조 검증 여부
            
        Returns:
            변환 성공 여부
        """
        try:
            print(f"🔄 변환 시작: {yaml_path} → {output_path}")
            
            # 1. YAML 로드
            data = self.load_yaml(yaml_path)
            
            # 2. YAML 구조 검증
            if validate and not self.validate_yaml_structure(data, yaml_path):
                return False
            
            # 3. 템플릿 로드
            template = self.load_template(template_path)
            
            # 4. HTML 렌더링
            html_content = self.render_html(template, data)
            
            # 5. HTML 포맷팅
            formatted_html = self.beautify_html(html_content)
            
            # 6. 출력 디렉토리 생성
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
            
            # 7. HTML 파일 저장
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(formatted_html)
            
            print(f"✅ 변환 완료: {output_path}")
            print(f"📊 파일 크기: {os.path.getsize(output_path):,} bytes")
            
            return True
            
        except Exception as e:
            print(f"❌ 변환 실패: {yaml_path}")
            print(f"오류: {e}")
            return False

def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description='자유와혁신 CMS - YAML to HTML 변환기',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  python yaml-to-html-converter.py --yaml content/index.yml --template templates/index.template.html --output index.html
  python yaml-to-html-converter.py --yaml content/about.yml --template templates/about.template.html --output about.html --validate
        """
    )
    
    parser.add_argument(
        '--yaml', 
        required=True,
        help='변환할 YAML 파일 경로'
    )
    
    parser.add_argument(
        '--template',
        required=True, 
        help='사용할 템플릿 파일 경로'
    )
    
    parser.add_argument(
        '--output',
        required=True,
        help='출력 HTML 파일 경로'
    )
    
    parser.add_argument(
        '--template-dir',
        default='templates',
        help='템플릿 디렉토리 경로 (기본값: templates)'
    )
    
    parser.add_argument(
        '--validate',
        action='store_true',
        help='YAML 구조 검증 활성화'
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='상세 로그 출력'
    )
    
    args = parser.parse_args()
    
    # 로그 레벨 설정
    if args.verbose:
        print(f"🔧 설정:")
        print(f"  YAML: {args.yaml}")
        print(f"  템플릿: {args.template}")
        print(f"  출력: {args.output}")
        print(f"  검증: {args.validate}")
        print()
    
    # 변환기 초기화
    converter = YAMLToHTMLConverter(template_dir=args.template_dir)
    
    # 변환 실행
    success = converter.convert(
        yaml_path=args.yaml,
        template_path=args.template,
        output_path=args.output,
        validate=args.validate
    )
    
    # 결과 출력
    if success:
        print(f"\n🎉 변환 성공!")
        sys.exit(0)
    else:
        print(f"\n💥 변환 실패!")
        sys.exit(1)

if __name__ == '__main__':
    main() 