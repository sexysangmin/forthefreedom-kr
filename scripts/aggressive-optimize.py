#!/usr/bin/env python3
"""
PageSpeed 최적화를 위한 적극적 이미지 압축
특정 이미지들을 더 작은 크기와 낮은 품질로 재압축
"""

import os
from PIL import Image
import pillow_heif

# HEIF 지원 등록
pillow_heif.register_heif_opener()

def aggressive_optimize(image_path, max_width, quality=60):
    """적극적인 이미지 최적화"""
    try:
        with Image.open(image_path) as img:
            # RGBA 모드인 경우 RGB로 변환
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 원본 크기 저장
            original_size = os.path.getsize(image_path)
            
            # 리사이징 (너비 기준)
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"   크기 조정: {img.width}x{img.height}")
            
            # WebP로 저장
            img.save(image_path, 'WebP', quality=quality, optimize=True)
            
            # 결과 출력
            new_size = os.path.getsize(image_path)
            reduction = ((original_size - new_size) / original_size) * 100
            print(f"✅ {os.path.basename(image_path)}")
            print(f"   {original_size//1024}KB → {new_size//1024}KB ({reduction:.1f}% 압축)")
            
    except Exception as e:
        print(f"❌ 오류: {image_path} - {e}")

# PageSpeed에서 지적한 큰 이미지들 최적화
optimizations = [
    ('images/activity.webp', 400, 55),     # 368KB → 50KB 목표
    ('images/sit-pic.webp', 400, 55),      # 241KB → 40KB 목표  
    ('images/hero-image.webp', 800, 65),   # 306KB → 120KB 목표
    ('images/profile-pic.webp', 350, 70),  # 51KB → 25KB 목표
]

print("🚀 PageSpeed 최적화를 위한 적극적 이미지 압축 시작...")
print("=" * 60)

for image_path, max_width, quality in optimizations:
    if os.path.exists(image_path):
        print(f"\n📸 {os.path.basename(image_path)} 최적화...")
        aggressive_optimize(image_path, max_width, quality)
    else:
        print(f"❌ 파일 없음: {image_path}")

print("\n" + "=" * 60)
print("🎉 적극적 최적화 완료!")