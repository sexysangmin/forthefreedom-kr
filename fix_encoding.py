#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import chardet

def detect_and_fix_encoding(file_path):
    """파일의 인코딩을 감지하고 UTF-8로 변환"""
    
    # 원본 파일의 바이트 읽기
    with open(file_path, 'rb') as f:
        raw_data = f.read()
    
    # 인코딩 감지
    detected = chardet.detect(raw_data)
    print(f"File: {file_path}")
    print(f"Detected encoding: {detected}")
    
    # 다양한 인코딩으로 시도
    encodings_to_try = [
        detected['encoding'] if detected['encoding'] else 'utf-8',
        'utf-8',
        'cp949', 
        'euc-kr',
        'iso-8859-1',
        'latin1'
    ]
    
    content = None
    used_encoding = None
    
    for encoding in encodings_to_try:
        try:
            content = raw_data.decode(encoding)
            used_encoding = encoding
            print(f"Successfully decoded with: {encoding}")
            break
        except UnicodeDecodeError as e:
            print(f"Failed with {encoding}: {e}")
            continue
    
    if content is None:
        print("Failed to decode with any encoding")
        return False
    
    # 백업 생성
    backup_path = file_path + '.backup'
    with open(backup_path, 'wb') as f:
        f.write(raw_data)
    print(f"Backup created: {backup_path}")
    
    # UTF-8로 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"File saved as UTF-8: {file_path}")
    
    # 결과 미리보기
    lines = content.split('\n')[:10]
    for i, line in enumerate(lines, 1):
        if any(ord(c) > 127 for c in line):  # 비ASCII 문자 포함 라인
            print(f"Line {i}: {line[:100]}")
            break
    
    return True

def fix_file_with_manual_patterns(file_path):
    """수동 패턴 매칭으로 복원"""
    
    # 백업부터 복원
    backup_path = file_path + '.backup'
    if os.path.exists(backup_path):
        with open(backup_path, 'rb') as f:
            raw_data = f.read()
    else:
        with open(file_path, 'rb') as f:
            raw_data = f.read()
    
    # UTF-8로 강제 디코딩 (에러 무시)
    content = raw_data.decode('utf-8', errors='ignore')
    
    # 알려진 패턴들 복원
    replacements = {
        # 주요 용어들
        'ì°½ë¹': '창당',
        'ì·¨ì?': '취지',
        '?ì ': '자유',
        '??ì ': '자유와',
        '?ì ??ì ': '자유와혁신',
        'êµ??': '국민',
        '?뺤튂': '정치',
        'ê°??': '개혁',
        '??': '혁신',
        '미래': '미래',
        '?ì±': '정책',
        '?곰윭': '경제',
        'êµì¡': '교육',
        '?¬ë??': '사회',
        '??': '복지',
        '?대쭅': '환경',
                 '?대똿': '외교',
         '?ë³´': '국방',
         'ì£¼ê±°': '주거',
         '?ì?': '안전',
         'ì·¨ì§': '취업',
        'ì¼ì리': '일자리',
        '?ê¸ê': '청년',
        '?¤ë?¸ë¼': '노인',
        '?ì??': '여성',
        '?°ë¦¬ì': '우리는',
        '?´ëµ': '이번',
        '?ì§': '지지',
        '?ì°?': '지원',
        '참여': '참여',
        '?썝?': '후원',
        '?¬?': '가입',
        '?쇱¼': '일정',
        '??': '행사',
        '?대떦': '활동',
        'ì°ë©´': '연락',
        '?ë?': '소개',
        '?´ê??': '이력',
        '겅쪽': '조직',
        '媛?': '강령',
        '湲?': '공약',
    }
    
    print(f"Applying manual patterns to: {file_path}")
    
    fixed_content = content
    changes_made = 0
    
    for old, new in replacements.items():
        if old in fixed_content:
            fixed_content = fixed_content.replace(old, new)
            changes_made += 1
            print(f"  Replaced: {old} → {new}")
    
    if changes_made > 0:
        # UTF-8로 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Applied {changes_made} manual fixes to {file_path}")
        return True
    else:
        print(f"No manual patterns found in {file_path}")
        return False

def main():
    # 테스트할 파일
    test_file = 'about/founding.html'
    
    if not os.path.exists(test_file):
        print(f"File not found: {test_file}")
        return
    
    print("=== Method 1: Auto-detect encoding ===")
    success1 = detect_and_fix_encoding(test_file)
    
    print("\n=== Method 2: Manual pattern replacement ===")
    success2 = fix_file_with_manual_patterns(test_file)
    
    if success1 or success2:
        print(f"\n파일 수정 완료: {test_file}")
        print("결과를 확인해보세요!")
    else:
        print(f"\n파일 수정 실패: {test_file}")

if __name__ == "__main__":
    main() 