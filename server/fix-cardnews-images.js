const mongoose = require('mongoose');
const path = require('path');

// 모델 불러오기
const { CardNews } = require('./models');

async function fixCardNewsImages() {
    try {
        console.log('🔄 MongoDB 연결 중...');
        await mongoose.connect('mongodb://localhost:27017/party-website');
        console.log('✅ MongoDB 연결 성공');

        // 기존 카드뉴스 모두 삭제
        console.log('🗑️ 기존 카드뉴스 데이터 삭제 중...');
        await CardNews.deleteMany({});
        console.log('✅ 기존 데이터 삭제 완료');

        // 실제 존재하는 이미지 파일들로 새 카드뉴스 생성
        const cardNewsData = [
            {
                title: "2025년 신년 정책 발표 - 경제 혁신 정책",
                excerpt: "새해를 맞아 발표하는 경제 혁신 정책의 주요 내용을 카드뉴스로 소개합니다.",
                category: "정책",
                content: "## 경제 혁신 정책 주요 내용\n\n1. 중소기업 지원 확대\n2. 창업 생태계 활성화\n3. 디지털 경제 전환 지원\n4. 고용 창출 정책\n5. 지역 경제 균형 발전",
                author: "뉴미디어",
                imageCount: 3,
                tags: ["경제정책", "신년정책", "혁신"],
                attachments: [
                    {
                        filename: "cardnews_01.jpg",
                        originalName: "경제정책_카드뉴스_1.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/cardnews_01.jpg"
                    },
                    {
                        filename: "cardnews_02.jpg",
                        originalName: "경제정책_카드뉴스_2.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/cardnews_02.jpg"
                    },
                    {
                        filename: "cardnews_03.jpg",
                        originalName: "경제정책_카드뉴스_3.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/cardnews_03.jpg"
                    }
                ],
                status: "published",
                views: 127
            },
            {
                title: "교육 혁신 정책 - 미래형 교육 시스템 구축",
                excerpt: "21세기 교육 혁신을 위한 미래형 교육 시스템 구축 방안을 소개합니다.",
                category: "활동",
                content: "## 교육 혁신 정책\n\n1. 개별 맞춤형 교육 시스템\n2. 디지털 교육 인프라 확충\n3. 교사 역량 강화 프로그램\n4. 창의적 사고력 개발 과정",
                author: "뉴미디어",
                imageCount: 2,
                tags: ["교육정책", "혁신교육", "미래교육"],
                attachments: [
                    {
                        filename: "test-cardnews-1.jpg",
                        originalName: "교육혁신_카드뉴스_1.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/test-cardnews-1.jpg"
                    },
                    {
                        filename: "test-cardnews-2.jpg",
                        originalName: "교육혁신_카드뉴스_2.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/test-cardnews-2.jpg"
                    }
                ],
                status: "published",
                views: 89
            },
            {
                title: "청년 일자리 창출 프로젝트",
                excerpt: "청년들을 위한 체계적인 일자리 창출 프로젝트의 주요 내용입니다.",
                category: "소식",
                content: "## 청년 일자리 창출 프로젝트\n\n1. 스타트업 인큐베이팅 지원\n2. 직업 교육 훈련 프로그램\n3. 멘토링 시스템 구축\n4. 취업 연계 서비스",
                author: "뉴미디어",
                imageCount: 3,
                tags: ["청년정책", "일자리", "창업지원"],
                attachments: [
                    {
                        filename: "jpg-1752815725399-806118100.jpg",
                        originalName: "청년일자리_카드뉴스_1.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/jpg-1752815725399-806118100.jpg"
                    },
                    {
                        filename: "jpg-1752815268675-748960731.jpg",
                        originalName: "청년일자리_카드뉴스_2.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/jpg-1752815268675-748960731.jpg"
                    },
                    {
                        filename: "jpg-1752811428788-578550730.jpg",
                        originalName: "청년일자리_카드뉴스_3.jpg",
                        mimetype: "image/jpeg",
                        size: 116665,
                        path: "/uploads/jpg-1752811428788-578550730.jpg"
                    }
                ],
                status: "published",
                views: 156
            }
        ];

        console.log('📝 새로운 카드뉴스 데이터 생성 중...');
        for (const cardData of cardNewsData) {
            const card = new CardNews(cardData);
            await card.save();
            console.log(`✅ 카드뉴스 생성 완료: "${card.title}"`);
        }

        console.log('✅ 모든 카드뉴스 데이터 생성 완료!');
        
        // 생성된 데이터 확인
        const totalCards = await CardNews.countDocuments();
        console.log(`📊 총 카드뉴스 개수: ${totalCards}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ 오류 발생:', error);
        process.exit(1);
    }
}

console.log('🚀 카드뉴스 이미지 문제 해결 스크립트 시작');
fixCardNewsImages(); 