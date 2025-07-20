require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

// MongoDB 연결
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB 연결됨');
    } catch (error) {
        console.error('❌ MongoDB 연결 실패:', error);
        process.exit(1);
    }
};

// 카드뉴스 스키마 정의
const cardNewsSchema = new mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    category: {
        type: String,
        enum: ['정책', '활동', '소식', '정보']
    },
    author: String,
    imageCount: Number,
    attachments: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String
    }],
    status: String,
    isImportant: Boolean,
    createdAt: Date,
    updatedAt: Date
});

const CardNews = mongoose.model('CardNews', cardNewsSchema);

// 카드뉴스 데이터 확인
const checkCardNews = async () => {
    try {
        await connectDB();
        
        console.log('\n📋 카드뉴스 목록:');
        const cardNewsList = await CardNews.find().sort({ createdAt: -1 });
        
        cardNewsList.forEach((item, index) => {
            console.log(`\n${index + 1}. ${item.title}`);
            console.log(`   ID: ${item._id}`);
            console.log(`   카테고리: ${item.category}`);
            console.log(`   작성자: ${item.author}`);
            console.log(`   첨부파일 개수: ${item.attachments ? item.attachments.length : 0}`);
            if (item.attachments && item.attachments.length > 0) {
                console.log('   첨부파일들:');
                item.attachments.forEach((att, attIndex) => {
                    console.log(`     ${attIndex + 1}. ${att.filename} (${att.originalName})`);
                });
            }
            console.log(`   생성일: ${item.createdAt}`);
            console.log(`   수정일: ${item.updatedAt}`);
        });
        
        console.log(`\n총 ${cardNewsList.length}개의 카드뉴스가 있습니다.`);
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 MongoDB 연결 종료');
    }
};

checkCardNews(); 