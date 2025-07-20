require('dotenv').config();
const mongoose = require('mongoose');
const { Event } = require('./models');

async function fixEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB 연결됨');
        
        // 테스트 데이터 삭제
        await Event.deleteOne({ title: 'dsd' });
        console.log('테스트 데이터 삭제됨');
        
        // 오늘 날짜로 새로운 일정 생성 (7월 18일 14:00)
        const eventDate = new Date('2025-07-18T14:00:00+09:00');
        
        const newEvent = new Event({
            title: '자유와혁신당 정책설명회',
            excerpt: '당의 주요 정책에 대한 설명회를 개최합니다.',
            category: '정책토론회',
            content: '시민 여러분께 당의 주요 정책을 설명드리는 자리입니다.',
            author: '기획조정실',
            eventDate: eventDate,
            eventLocation: '당사 3층 회의실',
            organizer: '자유와혁신당',
            contact: '02-1234-5678',
            status: 'published'
        });
        
        await newEvent.save();
        console.log('새로운 일정 생성됨');
        
        // 모든 이벤트 확인
        const events = await Event.find({}).sort({ eventDate: 1 });
        console.log('현재 일정들:');
        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title} - ${event.eventDate} - ${event.eventLocation}`);
        });
        
        await mongoose.disconnect();
        console.log('완료');
        
    } catch (error) {
        console.error('오류:', error);
        await mongoose.disconnect();
    }
}

fixEvents(); 