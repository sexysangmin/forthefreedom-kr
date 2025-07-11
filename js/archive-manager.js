/**
 * 자유와혁신 아카이브 관리 시스템
 * 파일 백업, 메타데이터 관리, 검색 기능을 제공합니다.
 */

class ArchiveManager {
    constructor() {
        this.archiveIndex = {};
        this.initializeArchive();
    }

    async initializeArchive() {
        await this.loadArchiveIndex();
        this.setupEventListeners();
    }

    // 아카이브 인덱스 로드
    async loadArchiveIndex() {
        try {
            // 로컬 스토리지에서 인덱스 로드
            const stored = localStorage.getItem('archiveIndex');
            if (stored) {
                this.archiveIndex = JSON.parse(stored);
            } else {
                this.archiveIndex = {
                    lastUpdated: new Date().toISOString(),
                    totalFiles: 0,
                    files: {},
                    categories: {
                        images: {},
                        documents: {},
                        news: {},
                        policies: {},
                        activities: {}
                    }
                };
            }
        } catch (error) {
            console.error('아카이브 인덱스 로드 실패:', error);
            this.initializeEmptyIndex();
        }
    }

    // 빈 인덱스 초기화
    initializeEmptyIndex() {
        this.archiveIndex = {
            lastUpdated: new Date().toISOString(),
            totalFiles: 0,
            files: {},
            categories: {
                images: {},
                documents: {},
                news: {},
                policies: {},
                activities: {}
            }
        };
        this.saveArchiveIndex();
    }

    // 아카이브 인덱스 저장
    saveArchiveIndex() {
        try {
            this.archiveIndex.lastUpdated = new Date().toISOString();
            localStorage.setItem('archiveIndex', JSON.stringify(this.archiveIndex));
        } catch (error) {
            console.error('아카이브 인덱스 저장 실패:', error);
        }
    }

    // 파일을 아카이브에 추가
    addFileToArchive(file, metadata = {}) {
        const fileId = this.generateFileId();
        const now = new Date().toISOString();
        
        const fileEntry = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            category: this.detectFileCategory(file),
            addedAt: now,
            lastAccessed: now,
            metadata: {
                uploader: metadata.uploader || 'unknown',
                description: metadata.description || '',
                tags: metadata.tags || [],
                originalPath: metadata.originalPath || '',
                ...metadata
            }
        };

        this.archiveIndex.files[fileId] = fileEntry;
        this.archiveIndex.totalFiles++;
        
        // 카테고리별 분류
        const category = fileEntry.category;
        if (!this.archiveIndex.categories[category]) {
            this.archiveIndex.categories[category] = {};
        }
        this.archiveIndex.categories[category][fileId] = fileEntry;

        this.saveArchiveIndex();
        return fileId;
    }

    // 파일 카테고리 감지
    detectFileCategory(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const type = file.type.toLowerCase();

        if (type.startsWith('image/')) {
            return 'images';
        } else if (extension === 'pdf' || type.includes('pdf')) {
            return 'documents';
        } else if (type.includes('video') || type.includes('audio')) {
            return 'media';
        } else if (extension === 'md' || extension === 'txt') {
            return 'content';
        } else {
            return 'others';
        }
    }

    // 파일 ID 생성
    generateFileId() {
        return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 파일 검색
    searchFiles(query, filters = {}) {
        const results = [];
        const searchTerm = query.toLowerCase();

        Object.values(this.archiveIndex.files).forEach(file => {
            let matches = false;

            // 파일명으로 검색
            if (file.name.toLowerCase().includes(searchTerm)) {
                matches = true;
            }

            // 메타데이터로 검색
            if (file.metadata.description.toLowerCase().includes(searchTerm)) {
                matches = true;
            }

            // 태그로 검색
            if (file.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
                matches = true;
            }

            // 필터 적용
            if (matches && filters.category && file.category !== filters.category) {
                matches = false;
            }

            if (matches && filters.dateFrom) {
                const fileDate = new Date(file.addedAt);
                const fromDate = new Date(filters.dateFrom);
                if (fileDate < fromDate) {
                    matches = false;
                }
            }

            if (matches && filters.dateTo) {
                const fileDate = new Date(file.addedAt);
                const toDate = new Date(filters.dateTo);
                if (fileDate > toDate) {
                    matches = false;
                }
            }

            if (matches) {
                results.push(file);
            }
        });

        return results.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }

    // 파일 메타데이터 업데이트
    updateFileMetadata(fileId, newMetadata) {
        if (this.archiveIndex.files[fileId]) {
            this.archiveIndex.files[fileId].metadata = {
                ...this.archiveIndex.files[fileId].metadata,
                ...newMetadata
            };
            this.archiveIndex.files[fileId].lastModified = new Date().toISOString();
            this.saveArchiveIndex();
            return true;
        }
        return false;
    }

    // 파일 삭제 (소프트 삭제)
    deleteFile(fileId, reason = '') {
        if (this.archiveIndex.files[fileId]) {
            this.archiveIndex.files[fileId].deleted = true;
            this.archiveIndex.files[fileId].deletedAt = new Date().toISOString();
            this.archiveIndex.files[fileId].deleteReason = reason;
            this.saveArchiveIndex();
            return true;
        }
        return false;
    }

    // 파일 복원
    restoreFile(fileId) {
        if (this.archiveIndex.files[fileId] && this.archiveIndex.files[fileId].deleted) {
            delete this.archiveIndex.files[fileId].deleted;
            delete this.archiveIndex.files[fileId].deletedAt;
            delete this.archiveIndex.files[fileId].deleteReason;
            this.saveArchiveIndex();
            return true;
        }
        return false;
    }

    // 통계 생성
    generateStats() {
        const stats = {
            totalFiles: this.archiveIndex.totalFiles,
            categories: {},
            recentActivity: [],
            storageUsed: 0
        };

        // 카테고리별 통계
        Object.keys(this.archiveIndex.categories).forEach(category => {
            const files = Object.values(this.archiveIndex.categories[category]);
            stats.categories[category] = {
                count: files.length,
                totalSize: files.reduce((sum, file) => sum + (file.size || 0), 0)
            };
            stats.storageUsed += stats.categories[category].totalSize;
        });

        // 최근 활동
        const recentFiles = Object.values(this.archiveIndex.files)
            .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
            .slice(0, 10);

        stats.recentActivity = recentFiles.map(file => ({
            name: file.name,
            addedAt: file.addedAt,
            category: file.category,
            size: file.size
        }));

        return stats;
    }

    // 백업 생성
    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            archiveIndex: this.archiveIndex,
            stats: this.generateStats()
        };

        const backupContent = JSON.stringify(backup, null, 2);
        const fileName = `archive_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        this.downloadAsFile(backupContent, fileName, 'application/json');
        return backup;
    }

    // 백업 복원
    restoreFromBackup(backupData) {
        try {
            if (backupData.archiveIndex) {
                this.archiveIndex = backupData.archiveIndex;
                this.saveArchiveIndex();
                return true;
            }
        } catch (error) {
            console.error('백업 복원 실패:', error);
        }
        return false;
    }

    // 파일 다운로드 유틸리티
    downloadAsFile(content, fileName, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 파일 드롭 영역 설정 (있는 경우)
        const dropZone = document.getElementById('archive-drop-zone');
        if (dropZone) {
            this.setupDropZone(dropZone);
        }

        // 검색 폼 설정
        const searchForm = document.getElementById('archive-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }
    }

    // 드롭 존 설정
    setupDropZone(dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFileUpload(files);
        });
    }

    // 파일 업로드 처리
    async handleFileUpload(files) {
        for (const file of files) {
            const metadata = {
                uploader: 'admin', // 실제로는 현재 사용자 정보 사용
                originalPath: file.webkitRelativePath || file.name,
                uploadedAt: new Date().toISOString()
            };

            const fileId = this.addFileToArchive(file, metadata);
            console.log(`파일 아카이브됨: ${file.name} (ID: ${fileId})`);
        }

        this.updateUI();
    }

    // 검색 처리
    handleSearch() {
        const query = document.getElementById('search-query')?.value || '';
        const category = document.getElementById('search-category')?.value || '';
        
        const filters = {};
        if (category) filters.category = category;

        const results = this.searchFiles(query, filters);
        this.displaySearchResults(results);
    }

    // 검색 결과 표시
    displaySearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<p class="text-gray-500">검색 결과가 없습니다.</p>';
            return;
        }

        results.forEach(file => {
            const item = document.createElement('div');
            item.className = 'border border-gray-200 rounded-lg p-4 mb-4';
            item.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${file.name}</h4>
                        <p class="text-sm text-gray-600">${file.metadata.description || '설명 없음'}</p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>카테고리: ${file.category}</span>
                            <span>크기: ${this.formatFileSize(file.size)}</span>
                            <span>추가일: ${new Date(file.addedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="archiveManager.downloadFile('${file.id}')" 
                                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            다운로드
                        </button>
                        <button onclick="archiveManager.deleteFile('${file.id}')" 
                                class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                            삭제
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // 파일 크기 포맷팅
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // UI 업데이트
    updateUI() {
        // 통계 업데이트
        const stats = this.generateStats();
        const statsContainer = document.getElementById('archive-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${stats.totalFiles}</div>
                        <div class="text-sm text-gray-600">총 파일 수</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">${this.formatFileSize(stats.storageUsed)}</div>
                        <div class="text-sm text-gray-600">사용 용량</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600">${Object.keys(stats.categories).length}</div>
                        <div class="text-sm text-gray-600">카테고리 수</div>
                    </div>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-orange-600">${stats.recentActivity.length}</div>
                        <div class="text-sm text-gray-600">최근 활동</div>
                    </div>
                </div>
            `;
        }
    }
}

// 전역 아카이브 매니저 인스턴스 생성
window.archiveManager = new ArchiveManager();

// 유틸리티 함수들
window.createBackup = () => window.archiveManager.createBackup();
window.getArchiveStats = () => window.archiveManager.generateStats();

console.log('📁 아카이브 관리 시스템이 로드되었습니다.'); 