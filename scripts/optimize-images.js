#!/usr/bin/env node
/**
 * Node.js 이미지 최적화 스크립트
 * - 모든 이미지를 WebP로 변환
 * - 파일 크기 80% 압축
 * - 최대 너비 1920px로 리사이징
 * - 원본 파일은 backup 폴더로 이동
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 백업 디렉토리 생성
function createBackupDir() {
    const backupDir = path.join('images', 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    return backupDir;
}

// 이미지 최적화 및 WebP 변환
async function optimizeImage(inputPath, outputPath, quality = 80, maxWidth = 1920) {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // 리사이징 (너비 기준)
        let resizedImage = image;
        if (metadata.width > maxWidth) {
            const ratio = maxWidth / metadata.width;
            const newHeight = Math.round(metadata.height * ratio);
            resizedImage = image.resize(maxWidth, newHeight);
        }

        // WebP로 변환 및 저장
        await resizedImage
            .webp({ quality: quality, effort: 6 })
            .toFile(outputPath);

        // 파일 크기 비교
        const originalStats = fs.statSync(inputPath);
        const newStats = fs.statSync(outputPath);
        const compressionRatio = (1 - newStats.size / originalStats.size) * 100;

        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   크기: ${Math.round(originalStats.size / 1024)}KB → ${Math.round(newStats.size / 1024)}KB (${compressionRatio.toFixed(1)}% 압축)`);

        return { success: true, originalSize: originalStats.size, newSize: newStats.size };
    } catch (error) {
        console.log(`❌ ${inputPath} 처리 실패: ${error.message}`);
        return { success: false, originalSize: 0, newSize: 0 };
    }
}

// 메인 실행 함수
async function main() {
    console.log('🖼️  이미지 최적화 시작...');
    console.log('='.repeat(50));

    // Sharp 라이브러리 확인
    try {
        require('sharp');
    } catch (error) {
        console.log('❌ Sharp 라이브러리가 설치되지 않았습니다.');
        console.log('💡 다음 명령으로 설치해주세요: npm install sharp');
        process.exit(1);
    }

    // 백업 디렉토리 생성
    const backupDir = createBackupDir();

    // 이미지 확장자 목록
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'];

    // images 폴더의 모든 파일 처리
    const imagesDir = 'images';
    let optimizedCount = 0;
    let totalOriginalSize = 0;
    let totalNewSize = 0;

    try {
        const files = fs.readdirSync(imagesDir);

        for (const filename of files) {
            const filePath = path.join(imagesDir, filename);
            const stats = fs.statSync(filePath);

            // 파일인지 확인하고 이미지 확장자인지 체크
            if (stats.isFile()) {
                const fileExt = path.extname(filename).toLowerCase();

                if (imageExtensions.includes(fileExt)) {
                    const baseName = path.basename(filename, fileExt);
                    const outputFilename = `${baseName}.webp`;
                    const outputPath = path.join(imagesDir, outputFilename);

                    // 이미지 최적화
                    const result = await optimizeImage(filePath, outputPath);

                    if (result.success) {
                        totalOriginalSize += result.originalSize;
                        totalNewSize += result.newSize;

                        // 원본 파일을 백업 폴더로 이동 (이미 WebP가 아닌 경우만)
                        if (fileExt !== '.webp') {
                            const backupPath = path.join(backupDir, filename);
                            fs.renameSync(filePath, backupPath);
                            console.log(`   원본 백업: ${backupPath}`);
                        }

                        optimizedCount++;
                        console.log();
                    }
                }
            }
        }

        // 최종 결과 출력
        console.log('='.repeat(50));
        console.log('🎉 최적화 완료!');
        console.log(`📊 처리된 이미지: ${optimizedCount}개`);
        console.log(`💾 전체 크기: ${Math.round(totalOriginalSize / 1024)}KB → ${Math.round(totalNewSize / 1024)}KB`);

        if (totalOriginalSize > 0) {
            const totalCompression = (1 - totalNewSize / totalOriginalSize) * 100;
            console.log(`🗜️  전체 압축률: ${totalCompression.toFixed(1)}%`);
            console.log(`⚡ 예상 로딩 속도 개선: ${Math.round(totalCompression)}%`);
        }

    } catch (error) {
        console.log(`❌ 폴더 읽기 실패: ${error.message}`);
    }
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
} 