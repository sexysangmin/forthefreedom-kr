#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
자유와혁신 정당 CMS 시스템
일괄 템플릿 생성기

프로젝트의 모든 HTML 파일을 Jinja2 템플릿으로 변환합니다.
"""

import os
import sys
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Tuple, Dict
import time

class BulkTemplateGenerator:
    """일괄 템플릿 생성 클래스"""
    
    def __init__(self, project_root: str = "."):
        """
        초기화
        
        Args:
            project_root: 프로젝트 루트 디렉토리
        """
        self.project_root = Path(project_root)
        self.template_dir = self.project_root / "templates"
        self.html_files = []
        
        # 제외할 파일/디렉토리
        self.exclude_patterns = [
            "freedom-control/*",
            "node_modules/*", 
            ".git/*",
            "*.min.html",
            "*test*.html",
            "*temp*.html"
        ]
        
        # 파일별 특별 매핑
        self.file_mappings = {
            # 메인 페이지
            "index.html": "templates/index.template.html",
            
            # 소개 페이지들
            "about.html": "templates/about.template.html",
            "about/founding.html": "templates/about/founding.template.html", 
            "about/location.html": "templates/about/location.template.html",
            "about/organization.html": "templates/about/organization.template.html",
            "about/people.html": "templates/about/people.template.html",
            "about/principles.html": "templates/about/principles.template.html",
            "about/schedule.html": "templates/about/schedule.template.html",
            
            # FAQ & 당원
            "faq.html": "templates/faq.template.html",
            "members.html": "templates/members.template.html",
            "members/join.html": "templates/members/join.template.html",
            "members/dues.html": "templates/members/dues.template.html",
            
            # 뉴스
            "news.html": "templates/news.template.html",
            "news/activities.html": "templates/news/activities.template.html",
            "news/events.html": "templates/news/events.template.html",
            "news/gallery.html": "templates/news/gallery.template.html", 
            "news/media.html": "templates/news/media.template.html",
            "news/press.html": "templates/news/press.template.html",
            
            # 공지사항
            "notices.html": "templates/notices.template.html",
            "notice-1.html": "templates/notice-detail.template.html",
            "notice-2.html": "templates/notice-detail.template.html",
            
            # 정책
            "policy.html": "templates/policy.template.html",
            "policy/economy.html": "templates/policy/economy.template.html",
            "policy/education.html": "templates/policy/education.template.html", 
            "policy/security.html": "templates/policy/security.template.html",
            
            # 자료실 & 후원
            "resources.html": "templates/resources.template.html",
            "resources/downloads.html": "templates/resources/downloads.template.html",
            "resources/media.html": "templates/resources/media.template.html",
            "resources/policy.html": "templates/resources/policy.template.html", 
            "resources/founding/founding-statement.html": "templates/resources/founding/founding-statement.template.html",
            "resources/policy/core-policies.html": "templates/resources/policy/core-policies.template.html",
            "support.html": "templates/support.template.html"
        }
    
    def discover_html_files(self) -> List[Path]:
        """HTML 파일 검색"""
        print("🔍 HTML 파일 검색 중...")
        
        html_files = []
        
        # 모든 HTML 파일 찾기
        for html_file in self.project_root.glob("**/*.html"):
            # 상대 경로 계산
            relative_path = html_file.relative_to(self.project_root)
            
            # 제외 패턴 확인
            should_exclude = False
            for pattern in self.exclude_patterns:
                if relative_path.match(pattern):
                    should_exclude = True
                    break
            
            if not should_exclude:
                html_files.append(html_file)
        
        print(f"📊 발견된 HTML 파일: {len(html_files)}개")
        return html_files
    
    def get_template_path(self, html_file: Path) -> Path:
        """HTML 파일에 대응하는 템플릿 경로 생성"""
        relative_path = html_file.relative_to(self.project_root)
        relative_str = str(relative_path).replace("\\", "/")  # Windows 호환
        
        # 특별 매핑 확인
        if relative_str in self.file_mappings:
            return self.project_root / self.file_mappings[relative_str]
        
        # 기본 매핑: HTML 파일명.template.html
        template_name = f"{html_file.stem}.template.html"
        template_path = self.template_dir / relative_path.parent / template_name
        
        return template_path
    
    def generate_single_template(self, html_file: Path) -> Tuple[bool, str, str]:
        """단일 템플릿 생성"""
        try:
            template_path = self.get_template_path(html_file)
            
            # 템플릿 디렉토리 생성
            template_path.parent.mkdir(parents=True, exist_ok=True)
            
            # template-generator.py 실행
            cmd = [
                sys.executable,
                "scripts/template-generator.py",
                "--html", str(html_file),
                "--output", str(template_path)
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            
            if result.returncode == 0:
                return True, str(html_file), str(template_path)
            else:
                error_msg = result.stderr or result.stdout or "알 수 없는 오류"
                return False, str(html_file), error_msg
                
        except Exception as e:
            return False, str(html_file), str(e)
    
    def generate_all_templates(self, max_workers: int = 4) -> Dict[str, any]:
        """모든 템플릿 생성 (병렬 처리)"""
        print("🚀 일괄 템플릿 생성 시작!")
        
        # HTML 파일 검색
        html_files = self.discover_html_files()
        
        if not html_files:
            print("❌ 변환할 HTML 파일이 없습니다.")
            return {"success": False, "message": "No HTML files found"}
        
        # 결과 추적
        results = {
            "total": len(html_files),
            "success": 0,
            "failed": 0,
            "errors": [],
            "success_files": [],
            "start_time": time.time()
        }
        
        # 병렬 처리로 템플릿 생성
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # 작업 제출
            future_to_file = {
                executor.submit(self.generate_single_template, html_file): html_file
                for html_file in html_files
            }
            
            # 결과 수집
            for future in as_completed(future_to_file):
                html_file = future_to_file[future]
                
                try:
                    success, source, target_or_error = future.result()
                    
                    if success:
                        results["success"] += 1
                        results["success_files"].append((source, target_or_error))
                        print(f"✅ {html_file.name} → {Path(target_or_error).name}")
                    else:
                        results["failed"] += 1
                        results["errors"].append((source, target_or_error))
                        print(f"❌ {html_file.name}: {target_or_error}")
                        
                except Exception as e:
                    results["failed"] += 1
                    results["errors"].append((str(html_file), str(e)))
                    print(f"💥 {html_file.name}: {e}")
        
        # 완료 시간 기록
        results["end_time"] = time.time()
        results["duration"] = results["end_time"] - results["start_time"]
        
        return results
    
    def create_template_registry(self, results: Dict[str, any]) -> None:
        """템플릿 레지스트리 파일 생성"""
        try:
            registry_content = f"""# 자유와혁신 CMS 템플릿 레지스트리
# 생성일: {time.strftime('%Y-%m-%d %H:%M:%S')}
# 총 템플릿 수: {results['success']}개

template_mappings:
"""
            
            for source, template in results["success_files"]:
                source_rel = os.path.relpath(source, self.project_root)
                template_rel = os.path.relpath(template, self.project_root)
                registry_content += f"  \"{source_rel}\": \"{template_rel}\"\n"
            
            registry_path = self.template_dir / "template-registry.yml"
            with open(registry_path, 'w', encoding='utf-8') as f:
                f.write(registry_content)
            
            print(f"📋 템플릿 레지스트리 생성: {registry_path}")
            
        except Exception as e:
            print(f"⚠️ 레지스트리 생성 실패: {e}")
    
    def print_summary(self, results: Dict[str, any]) -> None:
        """결과 요약 출력"""
        print("\n" + "="*60)
        print("📊 일괄 템플릿 생성 완료 요약")
        print("="*60)
        
        print(f"🎯 전체 파일: {results['total']}개")
        print(f"✅ 성공: {results['success']}개")
        print(f"❌ 실패: {results['failed']}개")
        print(f"⏱️ 소요 시간: {results['duration']:.2f}초")
        print(f"🚀 성공률: {(results['success']/results['total']*100):.1f}%")
        
        if results['errors']:
            print(f"\n❌ 실패한 파일들:")
            for source, error in results['errors']:
                print(f"  - {Path(source).name}: {error}")
        
        if results['success_files']:
            print(f"\n✅ 성공한 템플릿들:")
            for source, template in results['success_files'][:10]:  # 처음 10개만
                print(f"  - {Path(source).name} → {Path(template).name}")
            
            if len(results['success_files']) > 10:
                print(f"  ... 외 {len(results['success_files']) - 10}개")
        
        print("\n🎉 템플릿 생성이 완료되었습니다!")
        print(f"📁 템플릿 위치: {self.template_dir}")

def main():
    """메인 함수"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='자유와혁신 CMS - 일괄 템플릿 생성기',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  python bulk-template-generator.py
  python bulk-template-generator.py --workers 8
  python bulk-template-generator.py --project-root ../my-website
        """
    )
    
    parser.add_argument(
        '--project-root',
        default='.',
        help='프로젝트 루트 디렉토리 (기본값: 현재 디렉토리)'
    )
    
    parser.add_argument(
        '--workers',
        type=int,
        default=4,
        help='병렬 처리 워커 수 (기본값: 4)'
    )
    
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='실제 생성 없이 계획만 출력'
    )
    
    args = parser.parse_args()
    
    # 일괄 생성기 초기화
    generator = BulkTemplateGenerator(project_root=args.project_root)
    
    if args.dry_run:
        # 계획만 출력
        html_files = generator.discover_html_files()
        print(f"\n📋 생성 계획:")
        for html_file in html_files:
            template_path = generator.get_template_path(html_file)
            print(f"  {html_file.name} → {template_path.name}")
        print(f"\n총 {len(html_files)}개 파일이 변환됩니다.")
        return
    
    # 실제 생성 실행
    results = generator.generate_all_templates(max_workers=args.workers)
    
    # 템플릿 레지스트리 생성
    if results["success"] > 0:
        generator.create_template_registry(results)
    
    # 결과 요약 출력
    generator.print_summary(results)
    
    # 종료 코드 설정
    sys.exit(0 if results["failed"] == 0 else 1)

if __name__ == '__main__':
    main() 