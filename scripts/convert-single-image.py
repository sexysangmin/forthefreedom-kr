#!/usr/bin/env python3
"""
단일 이미지 WebP 변환 스크립트
- 지정된 이미지를 WebP로 변환
- 원본은 그대로 유지
- 고품질 압축 (85% 품질)
"""

import os
import sys
from PIL import Image
import pillow_heif

# HEIF 지원 등록
pillow_heif.register_heif_opener()

def convert_to_webp(input_path, quality=85, max_width=1920):
    """이미지를 WebP로 변환"""
    if not os.path.exists(input_path):
        print(f"❌ 파일을 찾을 수 없습니다: {input_path}")
        return False
    
    # 출력 파일명 생성
    base_name = os.path.splitext(input_path)[0]
    output_path = f"{base_name}.webp"
    
    try:
        with Image.open(input_path) as img:
            print(f"🖼️  원본 이미지: {img.size[0]}x{img.size[1]}")
            
            # RGBA 모드인 경우 RGB로 변환 (WebP 호환성)
            if img.mode in ('RGBA', 'LA', 'P'):
                # 투명 배경을 흰색으로 변환
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 리사이징 (너비 기준)
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"📐 리사이즈: {max_width}x{new_height}")
            
            # WebP로 저장
            img.save(output_path, 'WebP', quality=quality, optimize=True)
            
            # 파일 크기 비교
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            compression_ratio = (1 - new_size / original_size) * 100
            
            print(f"✅ 변환 완료: {os.path.basename(output_path)}")
            print(f"📊 크기: {original_size // 1024}KB → {new_size // 1024}KB ({compression_ratio:.1f}% 압축)")
            
            return True
            
    except Exception as e:
        print(f"❌ 변환 실패: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("사용법: python convert-single-image.py <이미지_파일_경로>")
        print("예시: python convert-single-image.py images/hero-image.jpg")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    print("🔄 이미지 WebP 변환 시작...")
    print("=" * 50)
    
    if convert_to_webp(input_file):
        print("=" * 50)
        print("🎉 변환 성공!")
    else:
        print("=" * 50)
        print("❌ 변환 실패!")
        sys.exit(1)

if __name__ == "__main__":
    main()