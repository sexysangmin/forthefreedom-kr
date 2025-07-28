#!/usr/bin/env python3
"""
이미지 최적화 스크립트
- 모든 이미지를 WebP로 변환
- 파일 크기 80% 압축
- 최대 너비 1920px로 리사이징
- 원본 파일은 백업 폴더로 이동
"""

import os
import shutil
from PIL import Image
import pillow_heif

# HEIF 지원 등록
pillow_heif.register_heif_opener()

def create_backup_dir():
    """백업 디렉토리 생성"""
    backup_dir = "images/backup"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    return backup_dir

def optimize_image(input_path, output_path, quality=80, max_width=1920):
    """이미지 최적화 및 WebP 변환"""
    try:
        with Image.open(input_path) as img:
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
            
            # WebP로 저장
            img.save(output_path, 'WebP', quality=quality, optimize=True)
            
            # 파일 크기 비교
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            compression_ratio = (1 - new_size / original_size) * 100
            
            print(f"✅ {os.path.basename(input_path)} → {os.path.basename(output_path)}")
            print(f"   크기: {original_size // 1024}KB → {new_size // 1024}KB ({compression_ratio:.1f}% 압축)")
            
            return True
            
    except Exception as e:
        print(f"❌ {input_path} 처리 실패: {e}")
        return False

def main():
    """메인 실행 함수"""
    print("🖼️  이미지 최적화 시작...")
    print("=" * 50)
    
    # 백업 디렉토리 생성
    backup_dir = create_backup_dir()
    
    # 이미지 확장자 목록
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'}
    
    # images 폴더의 모든 파일 처리
    images_dir = "images"
    optimized_count = 0
    total_original_size = 0
    total_new_size = 0
    
    for filename in os.listdir(images_dir):
        file_path = os.path.join(images_dir, filename)
        
        # 파일인지 확인하고 이미지 확장자인지 체크
        if os.path.isfile(file_path):
            file_ext = os.path.splitext(filename)[1].lower()
            
            if file_ext in image_extensions:
                # 원본 파일 크기 계산
                original_size = os.path.getsize(file_path)
                total_original_size += original_size
                
                # 출력 파일명 (WebP로 변환)
                base_name = os.path.splitext(filename)[0]
                output_filename = f"{base_name}.webp"
                output_path = os.path.join(images_dir, output_filename)
                
                # 이미지 최적화
                if optimize_image(file_path, output_path):
                    # 최적화된 파일 크기 계산
                    new_size = os.path.getsize(output_path)
                    total_new_size += new_size
                    
                    # 원본 파일을 백업 폴더로 이동 (이미 WebP가 아닌 경우만)
                    if file_ext != '.webp':
                        backup_path = os.path.join(backup_dir, filename)
                        shutil.move(file_path, backup_path)
                        print(f"   원본 백업: {backup_path}")
                    
                    optimized_count += 1
                    print()
    
    # 최종 결과 출력
    print("=" * 50)
    print(f"🎉 최적화 완료!")
    print(f"📊 처리된 이미지: {optimized_count}개")
    print(f"💾 전체 크기: {total_original_size // 1024}KB → {total_new_size // 1024}KB")
    
    if total_original_size > 0:
        total_compression = (1 - total_new_size / total_original_size) * 100
        print(f"🗜️  전체 압축률: {total_compression:.1f}%")
        print(f"⚡ 예상 로딩 속도 개선: {total_compression:.0f}%")

if __name__ == "__main__":
    main() 