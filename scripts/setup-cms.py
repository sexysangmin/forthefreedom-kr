#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
자유와혁신 정당 CMS 시스템
완전 설정 스크립트

이 스크립트는 CMS 시스템의 모든 구성 요소를 설정합니다:
1. 필요한 디렉토리 생성
2. 템플릿 생성
3. GitHub Actions 워크플로우 설정
4. Netlify CMS 설정
5. 검증 및 테스트
"""

import os
import sys
import subprocess
import json
import yaml
from pathlib import Path
from typing import Dict, List, Tuple
import shutil

class CMSSetup:
    """CMS 시스템 설정 클래스"""
    
    def __init__(self, project_root: str = "."):
        """
        초기화
        
        Args:
            project_root: 프로젝트 루트 디렉토리
        """
        self.project_root = Path(project_root)
        self.required_directories = [
            "content",
            "content/about",
            "content/members", 
            "content/news",
            "content/policy",
            "content/resources", 
            "content/resources/founding",
            "content/resources/policy",
            "templates",
            "templates/about",
            "templates/members",
            "templates/news",
            "templates/policy",
            "templates/resources",
            "templates/resources/founding",
            "templates/resources/policy",
            ".github",
            ".github/workflows",
            "freedom-control",
            "scripts"
        ]
        
        # 파일 매핑
        self.html_to_template = {
            "index.html": "templates/index.template.html",
            "about.html": "templates/about.template.html",
            "about/founding.html": "templates/about/founding.template.html",
            "about/location.html": "templates/about/location.template.html", 
            "about/organization.html": "templates/about/organization.template.html",
            "about/people.html": "templates/about/people.template.html",
            "about/principles.html": "templates/about/principles.template.html",
            "about/schedule.html": "templates/about/schedule.template.html",
            "faq.html": "templates/faq.template.html",
            "members.html": "templates/members.template.html",
            "members/join.html": "templates/members/join.template.html", 
            "members/dues.html": "templates/members/dues.template.html",
            "news.html": "templates/news.template.html",
            "news/activities.html": "templates/news/activities.template.html",
            "news/events.html": "templates/news/events.template.html",
            "news/gallery.html": "templates/news/gallery.template.html",
            "news/media.html": "templates/news/media.template.html",
            "news/press.html": "templates/news/press.template.html",
            "notices.html": "templates/notices.template.html",
            "notice-1.html": "templates/notice-detail.template.html",
            "notice-2.html": "templates/notice-detail.template.html",
            "policy.html": "templates/policy.template.html",
            "policy/economy.html": "templates/policy/economy.template.html",
            "policy/education.html": "templates/policy/education.template.html",
            "policy/security.html": "templates/policy/security.template.html",
            "resources.html": "templates/resources.template.html",
            "resources/downloads.html": "templates/resources/downloads.template.html",
            "resources/media.html": "templates/resources/media.template.html",
            "resources/policy.html": "templates/resources/policy.template.html",
            "resources/founding/founding-statement.html": "templates/resources/founding/founding-statement.template.html",
            "resources/policy/core-policies.html": "templates/resources/policy/core-policies.template.html",
            "support.html": "templates/support.template.html"
        }
    
    def create_directories(self) -> bool:
        """필요한 디렉토리 생성"""
        try:
            print("📁 디렉토리 구조 생성 중...")
            
            for directory in self.required_directories:
                dir_path = self.project_root / directory
                dir_path.mkdir(parents=True, exist_ok=True)
                print(f"  ✅ {directory}")
            
            print("📁 디렉토리 생성 완료!")
            return True
            
        except Exception as e:
            print(f"❌ 디렉토리 생성 실패: {e}")
            return False
    
    def check_html_files(self) -> List[Path]:
        """HTML 파일 존재 확인"""
        print("🔍 HTML 파일 확인 중...")
        
        existing_files = []
        missing_files = []
        
        for html_file in self.html_to_template.keys():
            file_path = self.project_root / html_file
            if file_path.exists():
                existing_files.append(file_path)
                print(f"  ✅ {html_file}")
            else:
                missing_files.append(html_file)
                print(f"  ❌ {html_file} (누락)")
        
        if missing_files:
            print(f"⚠️ 누락된 파일: {len(missing_files)}개")
            for file in missing_files[:5]:  # 처음 5개만 표시
                print(f"    - {file}")
            if len(missing_files) > 5:
                print(f"    ... 외 {len(missing_files) - 5}개")
        
        print(f"📊 확인 완료: {len(existing_files)}/{len(self.html_to_template)}개 파일 존재")
        return existing_files
    
    def generate_simple_template(self, html_file: Path, template_file: Path) -> bool:
        """간단한 템플릿 생성 (template-generator.py가 없을 경우)"""
        try:
            # HTML 파일 읽기
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # 기본 템플릿 변환
            template_content = f"""<!--
자유와혁신 CMS 시스템 - Jinja2 템플릿
원본: {html_file.name}
생성일: {{{{ generated_at }}}}

사용 가능한 변수들:
- metadata: 페이지 메타데이터
- content: 페이지 주요 콘텐츠
- site_name: 사이트명
- current_year: 현재 연도
-->

{html_content}"""
            
            # 기본 변수 교체
            replacements = [
                ('<title>', '<title>{{ metadata.title }} - {{ site_name }}</title><title>'),
                ('자유와혁신', '{{ site_name }}'),
                ('2024', '{{ current_year }}'),
                ('2025', '{{ current_year }}')
            ]
            
            for old, new in replacements:
                template_content = template_content.replace(old, new, 1)  # 첫 번째 것만 교체
            
            # 템플릿 파일 저장
            template_file.parent.mkdir(parents=True, exist_ok=True)
            with open(template_file, 'w', encoding='utf-8') as f:
                f.write(template_content)
            
            return True
            
        except Exception as e:
            print(f"❌ 템플릿 생성 실패 ({html_file.name}): {e}")
            return False
    
    def generate_templates(self, html_files: List[Path]) -> Dict[str, any]:
        """모든 템플릿 생성"""
        print("🔄 템플릿 생성 시작...")
        
        results = {
            "total": len(html_files),
            "success": 0,
            "failed": 0,
            "errors": []
        }
        
        for html_file in html_files:
            try:
                # 상대 경로 계산
                relative_path = html_file.relative_to(self.project_root)
                relative_str = str(relative_path).replace("\\", "/")
                
                if relative_str in self.html_to_template:
                    template_path = self.project_root / self.html_to_template[relative_str]
                    
                    # 템플릿 생성
                    if self.generate_simple_template(html_file, template_path):
                        results["success"] += 1
                        print(f"  ✅ {html_file.name} → {template_path.name}")
                    else:
                        results["failed"] += 1
                        results["errors"].append(f"{html_file.name}: 생성 실패")
                else:
                    results["failed"] += 1
                    results["errors"].append(f"{html_file.name}: 매핑 없음")
                    
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"{html_file.name}: {str(e)}")
        
        print(f"🎯 템플릿 생성 완료: {results['success']}/{results['total']}개 성공")
        return results
    
    def create_template_registry(self) -> bool:
        """템플릿 레지스트리 생성"""
        try:
            print("📋 템플릿 레지스트리 생성 중...")
            
            registry = {
                "template_mappings": self.html_to_template,
                "generated_at": "{{ generated_at }}",
                "total_templates": len(self.html_to_template)
            }
            
            registry_path = self.project_root / "templates" / "registry.yml"
            with open(registry_path, 'w', encoding='utf-8') as f:
                yaml.dump(registry, f, default_flow_style=False, allow_unicode=True)
            
            print(f"✅ 레지스트리 생성: {registry_path}")
            return True
            
        except Exception as e:
            print(f"❌ 레지스트리 생성 실패: {e}")
            return False
    
    def verify_yaml_files(self) -> Dict[str, any]:
        """YAML 파일 검증"""
        print("🔍 YAML 파일 검증 중...")
        
        content_dir = self.project_root / "content"
        if not content_dir.exists():
            print("❌ content 디렉토리가 없습니다!")
            return {"total": 0, "valid": 0, "invalid": 0, "errors": []}
        
        yaml_files = list(content_dir.glob("**/*.yml"))
        results = {
            "total": len(yaml_files),
            "valid": 0,
            "invalid": 0,
            "errors": []
        }
        
        for yaml_file in yaml_files:
            try:
                with open(yaml_file, 'r', encoding='utf-8') as f:
                    yaml.safe_load(f)
                results["valid"] += 1
                print(f"  ✅ {yaml_file.name}")
            except Exception as e:
                results["invalid"] += 1
                results["errors"].append(f"{yaml_file.name}: {str(e)}")
                print(f"  ❌ {yaml_file.name}: {str(e)}")
        
        print(f"📊 YAML 검증 완료: {results['valid']}/{results['total']}개 유효")
        return results
    
    def create_package_json(self) -> bool:
        """package.json 생성 (Netlify 빌드용)"""
        try:
            print("📦 package.json 생성 중...")
            
            package_config = {
                "name": "자유와혁신-cms",
                "version": "1.0.0",
                "description": "자유와혁신 정당 CMS 시스템",
                "scripts": {
                    "build": "python scripts/yaml-to-html-converter.py --all",
                    "dev": "python -m http.server 3000",
                    "cms": "npx netlify-cms-proxy-server"
                },
                "dependencies": {
                    "netlify-cms-app": "^2.15.0"
                },
                "devDependencies": {
                    "netlify-cms-proxy-server": "^1.3.0"
                }
            }
            
            package_path = self.project_root / "package.json"
            with open(package_path, 'w', encoding='utf-8') as f:
                json.dump(package_config, f, indent=2, ensure_ascii=False)
            
            print(f"✅ package.json 생성: {package_path}")
            return True
            
        except Exception as e:
            print(f"❌ package.json 생성 실패: {e}")
            return False
    
    def create_netlify_toml(self) -> bool:
        """netlify.toml 업데이트"""
        try:
            print("🌐 netlify.toml 업데이트 중...")
            
            netlify_config = """[build]
  command = "python scripts/yaml-to-html-converter.py --all"
  publish = "."

[build.environment]
  PYTHON_VERSION = "3.9"

[[redirects]]
  from = "/freedom-control/*"
  to = "/freedom-control/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/freedom-control/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"

[dev]
  command = "python -m http.server 3000"
  targetPort = 3000
  port = 8888
  autoLaunch = true
"""
            
            netlify_path = self.project_root / "netlify.toml"
            with open(netlify_path, 'w', encoding='utf-8') as f:
                f.write(netlify_config)
            
            print(f"✅ netlify.toml 업데이트: {netlify_path}")
            return True
            
        except Exception as e:
            print(f"❌ netlify.toml 업데이트 실패: {e}")
            return False
    
    def run_setup(self) -> bool:
        """전체 설정 실행"""
        print("🚀 자유와혁신 CMS 시스템 설정 시작!")
        print("=" * 60)
        
        success_count = 0
        total_steps = 7
        
        # 1. 디렉토리 생성
        if self.create_directories():
            success_count += 1
        
        # 2. HTML 파일 확인
        html_files = self.check_html_files()
        if html_files:
            success_count += 1
        
        # 3. 템플릿 생성
        template_results = self.generate_templates(html_files)
        if template_results["failed"] == 0:
            success_count += 1
        
        # 4. 레지스트리 생성
        if self.create_template_registry():
            success_count += 1
        
        # 5. YAML 검증
        yaml_results = self.verify_yaml_files()
        if yaml_results["invalid"] == 0:
            success_count += 1
        
        # 6. package.json 생성
        if self.create_package_json():
            success_count += 1
        
        # 7. netlify.toml 업데이트
        if self.create_netlify_toml():
            success_count += 1
        
        # 결과 요약
        print("\n" + "=" * 60)
        print("📊 CMS 설정 완료 요약")
        print("=" * 60)
        
        print(f"🎯 전체 단계: {total_steps}개")
        print(f"✅ 성공: {success_count}개")
        print(f"❌ 실패: {total_steps - success_count}개")
        print(f"🚀 성공률: {(success_count/total_steps*100):.1f}%")
        
        if template_results:
            print(f"\n📄 템플릿: {template_results['success']}/{template_results['total']}개 생성")
        
        if yaml_results:
            print(f"📝 YAML: {yaml_results['valid']}/{yaml_results['total']}개 유효")
        
        print(f"\n🌐 다음 단계:")
        print(f"  1. GitHub에 변경사항 커밋 및 푸시")
        print(f"  2. Netlify에서 사이트 배포")
        print(f"  3. /freedom-control 페이지에서 CMS 관리자 접속")
        print(f"  4. Git Gateway 설정 (Netlify Identity)")
        
        if success_count == total_steps:
            print(f"\n🎉 CMS 설정이 완전히 완료되었습니다!")
            return True
        else:
            print(f"\n⚠️ 일부 단계에서 오류가 발생했습니다. 로그를 확인해주세요.")
            return False

def main():
    """메인 함수"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='자유와혁신 CMS 시스템 완전 설정',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  python setup-cms.py                    # 현재 디렉토리에서 설정
  python setup-cms.py --project-root ..  # 상위 디렉토리에서 설정
        """
    )
    
    parser.add_argument(
        '--project-root',
        default='.',
        help='프로젝트 루트 디렉토리 (기본값: 현재 디렉토리)'
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='상세 로그 출력'
    )
    
    args = parser.parse_args()
    
    # 설정 실행
    setup = CMSSetup(project_root=args.project_root)
    success = setup.run_setup()
    
    # 종료 코드
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main() 