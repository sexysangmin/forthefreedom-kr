require('dotenv').config();
const mongoose = require('mongoose');
const { Event } = require('./models');

async function cleanupEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB 연결됨');
        
        // 모든 이벤트 조회
        const events = await Event.find({}).sort({ createdAt: -1 });
        console.log(`총 ${events.length}개의 이벤트 발견`);
        
        // 중복 확인 (제목과 날짜가 같은 것들)
        const duplicates = {};
        const toDelete = [];
        
        events.forEach(event => {
            const key = `${event.title}-${event.eventDate.toISOString().split('T')[0]}`;
            if (duplicates[key]) {
                // 중복 발견 - 나중에 생성된 것만 남기고 이전 것들 삭제
                toDelete.push(duplicates[key]);
                console.log(`중복 발견: ${event.title} (${event.eventDate})`);
            }
            duplicates[key] = event._id;
        });
        
        if (toDelete.length > 0) {
            console.log(`${toDelete.length}개의 중복 이벤트 삭제 중...`);
            await Event.deleteMany({ _id: { $in: toDelete } });
            console.log('중복 이벤트 삭제 완료');
        } else {
            console.log('중복 이벤트 없음');
        }
        
        // 남은 이벤트 확인
        const remainingEvents = await Event.find({}).sort({ eventDate: 1 });
        console.log('\n남은 이벤트들:');
        remainingEvents.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   날짜: ${event.eventDate}`);
            console.log(`   장소: ${event.eventLocation}`);
            console.log('---');
        });
        
        await mongoose.disconnect();
        console.log('완료');
        
    } catch (error) {
        console.error('오류:', error);
        await mongoose.disconnect();
    }
}

cleanupEvents(); 