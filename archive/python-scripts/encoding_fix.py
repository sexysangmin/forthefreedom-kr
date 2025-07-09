#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import sys
import codecs
from pathlib import Path

def fix_korean_encoding(text):
    """
    깨진 한글 인코딩을 복원하는 함수
    """
    
    # 방법 1: UTF-8 -> CP949 -> UTF-8 복원 시도
    try:
        # UTF-8로 인코딩된 텍스트를 latin-1로 디코딩한 후 다시 UTF-8로 디코딩
        fixed = text.encode('latin-1').decode('utf-8')
        print(f"Method 1 success: {text[:50]} -> {fixed[:50]}")
        return fixed
    except:
        pass
    
    # 방법 2: CP949 복원 시도
    try:
        fixed = text.encode('latin-1').decode('cp949')
        print(f"Method 2 success: {text[:50]} -> {fixed[:50]}")
        return fixed
    except:
        pass
    
    # 방법 3: EUC-KR 복원 시도
    try:
        fixed = text.encode('latin-1').decode('euc-kr')
        print(f"Method 3 success: {text[:50]} -> {fixed[:50]}")
        return fixed
    except:
        pass
    
    # 방법 4: UTF-8 BOM 문제 해결 시도
    try:
        if text.startswith('\ufeff'):
            fixed = text[1:]
            print(f"Method 4 success: Removed BOM")
            return fixed
    except:
        pass
    
    # 방법 5: 특정 패턴 치환
    replacements = {
        '?�': '',  # 물음표와 특수문자 제거
        '??': '',
        '???': '',
        '����': '',
        '\ufffd': '',  # 유니코드 대체 문자 제거
    }
    
    fixed = text
    for old, new in replacements.items():
        fixed = fixed.replace(old, new)
    
    # 알려진 패턴들 복원
    known_patterns = {
        '?�유?�?�신': '자유와혁신',
        '?�책': '정책',
        '?�원': '당원',
        '?�당': '창당',
        '?�식': '소식',
        '?�동': '활동',
        '?�료': '자료',
        '?�내': '안내',
        '?�청': '신청',
        '?�원': '후원',
        '참여': '참여',
        '?�무': '사무',
        '?�보': '홍보',
        '?�사': '행사',
        '?�문': '전문',
        '?�시': '정시',
        '?�영': '운영',
        '?�체': '이체',
        '?�라': '온라',
        '모바??': '모바일',
        '?�명': '투명',
        '공정': '공정',
        '?�스': '시스',
        '?�택': '혜택',
    }
    
    for old, new in known_patterns.items():
        fixed = fixed.replace(old, new)
    
    if fixed != text:
        print(f"Method 5 success: Pattern replacement applied")
        return fixed
    
    print(f"No method worked for: {text[:50]}")
    return text

def process_html_file(file_path):
    """
    HTML 파일의 인코딩을 복원하는 함수
    """
    print(f"\nProcessing: {file_path}")
    
    try:
        # 파일을 다양한 인코딩으로 읽기 시도
        encodings = ['utf-8', 'utf-8-sig', 'cp949', 'euc-kr', 'latin-1']
        
        content = None
        used_encoding = None
        
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    content = f.read()
                    used_encoding = encoding
                    print(f"Successfully read with {encoding}")
                    break
            except UnicodeDecodeError:
                continue
        
        if content is None:
            print(f"Failed to read {file_path} with any encoding")
            return False
        
        # 한글이 깨진 부분 찾기
        broken_patterns = re.findall(r'[?�]+[^<>\s]*', content)
        if broken_patterns:
            print(f"Found broken patterns: {broken_patterns[:5]}")
            
            # 각 깨진 패턴을 복원 시도
            fixed_content = content
            for pattern in set(broken_patterns):
                fixed_pattern = fix_korean_encoding(pattern)
                if fixed_pattern != pattern:
                    fixed_content = fixed_content.replace(pattern, fixed_pattern)
            
            # 수정된 내용을 UTF-8로 저장
            backup_path = file_path.with_suffix('.bak')
            file_path.rename(backup_path)
            print(f"Created backup: {backup_path}")
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            
            print(f"Fixed and saved: {file_path}")
            return True
        else:
            print("No broken Korean patterns found")
            return False
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    # 테스트할 파일들
    test_files = [
        'about/founding.html',
        'about/location.html', 
        'members/join.html',
    ]
    
    print("=== Korean Encoding Fix Tool ===")
    
    # 간단한 테스트
    test_texts = [
        '?�유?�?�신',
        '?�책',
        '?�원',
        '?�당'
    ]
    
    print("\n=== Testing encoding fix on sample texts ===")
    for text in test_texts:
        fixed = fix_korean_encoding(text)
        print(f"'{text}' -> '{fixed}'")
    
    print("\n=== Processing HTML files ===")
    for file_name in test_files:
        file_path = Path(file_name)
        if file_path.exists():
            process_html_file(file_path)
        else:
            print(f"File not found: {file_path}")

if __name__ == "__main__":
    main() 