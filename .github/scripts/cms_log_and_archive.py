# TODO: 변경/삭제 파일을 분석하여 logs/changes.log와 archive/를 관리하는 코드 작성 예정 

import os
import subprocess
import datetime

LOG_FILE = 'logs/changes.log'
ARCHIVE_DIR = 'archive'

# 환경변수에서 정보 추출
github_actor = os.environ.get('GITHUB_ACTOR', 'unknown')
github_sha = os.environ.get('GITHUB_SHA', '')
github_before = os.environ.get('GITHUB_EVENT_BEFORE', '')

def run(cmd):
    return subprocess.check_output(cmd, shell=True, encoding='utf-8').strip()

def get_diff_files():
    # 변경/삭제 파일 목록 추출
    diff_cmd = f'git diff --name-status {github_before} {github_sha}'
    output = run(diff_cmd)
    files = []
    for line in output.splitlines():
        status, path = line.split('\t', 1)
        files.append((status, path))
    return files

def append_log(lines):
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        for line in lines:
            f.write(line + '\n')

def archive_file(path):
    # git show로 삭제된 파일 내용 추출
    try:
        content = run(f'git show {github_before}:{path}')
    except Exception:
        content = ''
    # 타임스탬프+경로명으로 저장
    now = datetime.datetime.now().strftime('%Y-%m-%dT%H-%M-%S')
    safe_path = path.replace('/', '_').replace('\\', '_')
    archive_path = os.path.join(ARCHIVE_DIR, f'{now}_{safe_path}')
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    with open(archive_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return archive_path

def main():
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    files = get_diff_files()
    log_lines = []
    for status, path in files:
        if path.startswith('logs/') or path.startswith('archive/'):
            continue  # 로그/아카이브 자체는 기록하지 않음
        if status == 'A':
            log_lines.append(f'{now} | {github_actor} | {path} | 생성')
        elif status == 'M':
            log_lines.append(f'{now} | {github_actor} | {path} | 수정')
        elif status == 'D':
            archive_path = archive_file(path)
            log_lines.append(f'{now} | {github_actor} | {path} | 삭제(archive: {archive_path})')
    if log_lines:
        append_log(log_lines)

if __name__ == '__main__':
    main() 