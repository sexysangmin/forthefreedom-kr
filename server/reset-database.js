require('dotenv').config();
const mongoose = require('mongoose');

// 모든 모델들 import
const Activity = require('./models/Activity');
const CardNews = require('./models/CardNews');
const ElectionMaterial = require('./models/ElectionMaterial');
const Events = require('./models/Events');
const Gallery = require('./models/Gallery');
const MediaCoverage = require('./models/MediaCoverage');
const NewMedia = require('./models/NewMedia');
const Notice = require('./models/Notice');
const PartyConstitution = require('./models/PartyConstitution');
const PolicyCommittee = require('./models/PolicyCommittee');
const PolicyMaterial = require('./models/PolicyMaterial');
const Spokesperson = require('./models/Spokesperson');

async function resetDatabase() {
    try {
        console.log('🚀 데이터베이스 연결 중...');
        
        // MongoDB 연결
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ 데이터베이스 연결 성공');
        console.log('⚠️  모든 데이터를 삭제합니다...');
        
        // 모든 컬렉션 삭제
        const collections = [
            { name: 'Activity', model: Activity },
            { name: 'CardNews', model: CardNews },
            { name: 'ElectionMaterial', model: ElectionMaterial },
            { name: 'Events', model: Events },
            { name: 'Gallery', model: Gallery },
            { name: 'MediaCoverage', model: MediaCoverage },
            { name: 'NewMedia', model: NewMedia },
            { name: 'Notice', model: Notice },
            { name: 'PartyConstitution', model: PartyConstitution },
            { name: 'PolicyCommittee', model: PolicyCommittee },
            { name: 'PolicyMaterial', model: PolicyMaterial },
            { name: 'Spokesperson', model: Spokesperson }
        ];
        
        let totalDeleted = 0;
        
        for (const collection of collections) {
            try {
                const count = await collection.model.countDocuments();
                if (count > 0) {
                    const result = await collection.model.deleteMany({});
                    console.log(`🗑️  ${collection.name}: ${result.deletedCount}개 문서 삭제`);
                    totalDeleted += result.deletedCount;
                } else {
                    console.log(`📭 ${collection.name}: 삭제할 데이터 없음`);
                }
            } catch (error) {
                console.log(`❌ ${collection.name} 삭제 중 오류:`, error.message);
            }
        }
        
        console.log('\n📊 삭제 요약:');
        console.log(`총 ${totalDeleted}개의 문서가 삭제되었습니다.`);
        
        // uploads 폴더의 파일들도 삭제할지 확인
        console.log('\n⚠️  업로드된 파일들 정리 중...');
        const fs = require('fs');
        const path = require('path');
        
        const uploadsPath = path.join(__dirname, 'uploads');
        if (fs.existsSync(uploadsPath)) {
            const files = fs.readdirSync(uploadsPath);
            let fileCount = 0;
            
            for (const file of files) {
                const filePath = path.join(uploadsPath, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                    fileCount++;
                }
            }
            
            console.log(`🗂️  ${fileCount}개의 업로드 파일 삭제 완료`);
        }
        
        console.log('\n✅ 데이터베이스 초기화 완료!');
        console.log('🎉 관리자가 새로 시작할 수 있습니다.');
        
    } catch (error) {
        console.error('❌ 데이터베이스 초기화 중 오류:', error);
    } finally {
        // 연결 종료
        await mongoose.connection.close();
        console.log('🔌 데이터베이스 연결 종료');
        process.exit(0);
    }
}

// 확인 메시지
console.log('⚠️  경고: 이 스크립트는 모든 데이터를 영구적으로 삭제합니다!');
console.log('🗑️  삭제될 항목:');
console.log('   - 모든 공지사항');
console.log('   - 모든 대변인 보도자료');
console.log('   - 모든 갤러리 이미지');
console.log('   - 모든 활동 기록');
console.log('   - 모든 정책 자료');
console.log('   - 모든 업로드 파일');
console.log('   - 기타 모든 컨텐츠');

console.log('\n🚀 5초 후 삭제를 시작합니다...');

setTimeout(() => {
    console.log('🗑️  데이터베이스 초기화 시작!');
    resetDatabase();
}, 5000); 