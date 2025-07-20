require('dotenv').config();
const mongoose = require('mongoose');
const { CardNews } = require('./models');

async function createSampleCardNews() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB 연결됨');
        
        // 기존 카드뉴스 삭제
        await CardNews.deleteMany({});
        console.log('기존 카드뉴스 삭제됨');
        
        // 샘플 카드뉴스 생성
        const sampleCards = [
            {
                title: '자유와혁신당 2025 경제정책 발표',
                excerpt: '미래 경제 성장을 위한 혁신적인 정책을 카드뉴스로 소개합니다.',
                category: '정책',
                content: '# 경제정책 주요 내용\n\n## 1. 혁신 기업 지원\n- 창업 생태계 활성화\n- R&D 투자 확대\n\n## 2. 일자리 창출\n- 새로운 산업 분야 개척\n- 청년 고용 확대',
                author: '뉴미디어팀',
                imageCount: 5,
                tags: ['경제정책', '혁신', '일자리', '창업'],
                attachments: [
                    {
                        filename: 'cardnews-policy-1.jpg',
                        originalName: '경제정책_카드뉴스_01.jpg',
                        mimetype: 'image/jpeg',
                        size: 512000,
                        path: '/uploads/cardnews-policy-1.jpg'
                    },
                    {
                        filename: 'cardnews-policy-2.jpg',
                        originalName: '경제정책_카드뉴스_02.jpg',
                        mimetype: 'image/jpeg',
                        size: 487000,
                        path: '/uploads/cardnews-policy-2.jpg'
                    },
                    {
                        filename: 'cardnews-policy-3.jpg',
                        originalName: '경제정책_카드뉴스_03.jpg',
                        mimetype: 'image/jpeg',
                        size: 523000,
                        path: '/uploads/cardnews-policy-3.jpg'
                    },
                    {
                        filename: 'cardnews-policy-4.jpg',
                        originalName: '경제정책_카드뉴스_04.jpg',
                        mimetype: 'image/jpeg',
                        size: 496000,
                        path: '/uploads/cardnews-policy-4.jpg'
                    },
                    {
                        filename: 'cardnews-policy-5.jpg',
                        originalName: '경제정책_카드뉴스_05.jpg',
                        mimetype: 'image/jpeg',
                        size: 518000,
                        path: '/uploads/cardnews-policy-5.jpg'
                    }
                ]
            },
            {
                title: '청년 정책 토론회 개최',
                excerpt: '청년들과 함께하는 정책 토론회 현장을 카드뉴스로 전합니다.',
                category: '활동',
                content: '# 청년 정책 토론회\n\n젊은 세대와의 소통을 위한 토론회가 성황리에 개최되었습니다.',
                author: '뉴미디어팀',
                imageCount: 3,
                tags: ['청년정책', '토론회', '소통'],
                attachments: [
                    {
                        filename: 'cardnews-youth-1.jpg',
                        originalName: '청년토론회_카드뉴스_01.jpg',
                        mimetype: 'image/jpeg',
                        size: 445000,
                        path: '/uploads/cardnews-youth-1.jpg'
                    },
                    {
                        filename: 'cardnews-youth-2.jpg',
                        originalName: '청년토론회_카드뉴스_02.jpg',
                        mimetype: 'image/jpeg',
                        size: 467000,
                        path: '/uploads/cardnews-youth-2.jpg'
                    },
                    {
                        filename: 'cardnews-youth-3.jpg',
                        originalName: '청년토론회_카드뉴스_03.jpg',
                        mimetype: 'image/jpeg',
                        size: 432000,
                        path: '/uploads/cardnews-youth-3.jpg'
                    }
                ]
            },
            {
                title: '당 대표 신년 메시지',
                excerpt: '2025년 새해를 맞아 당 대표가 전하는 신년 인사입니다.',
                category: '소식',
                content: '# 신년 메시지\n\n새해 복 많이 받으시고, 함께 더 나은 대한민국을 만들어 갑시다.',
                author: '뉴미디어팀',
                imageCount: 4,
                tags: ['신년인사', '당대표', '메시지'],
                attachments: [
                    {
                        filename: 'cardnews-newyear-1.jpg',
                        originalName: '신년메시지_카드뉴스_01.jpg',
                        mimetype: 'image/jpeg',
                        size: 478000,
                        path: '/uploads/cardnews-newyear-1.jpg'
                    },
                    {
                        filename: 'cardnews-newyear-2.jpg',
                        originalName: '신년메시지_카드뉴스_02.jpg',
                        mimetype: 'image/jpeg',
                        size: 456000,
                        path: '/uploads/cardnews-newyear-2.jpg'
                    },
                    {
                        filename: 'cardnews-newyear-3.jpg',
                        originalName: '신년메시지_카드뉴스_03.jpg',
                        mimetype: 'image/jpeg',
                        size: 492000,
                        path: '/uploads/cardnews-newyear-3.jpg'
                    },
                    {
                        filename: 'cardnews-newyear-4.jpg',
                        originalName: '신년메시지_카드뉴스_04.jpg',
                        mimetype: 'image/jpeg',
                        size: 468000,
                        path: '/uploads/cardnews-newyear-4.jpg'
                    }
                ]
            },
            {
                title: '국정감사 주요 쟁점 정리',
                excerpt: '국정감사에서 제기된 주요 쟁점들을 쉽게 정리했습니다.',
                category: '정보',
                content: '# 국정감사 주요 쟁점\n\n시민들이 알아야 할 핵심 내용들을 정리했습니다.',
                author: '뉴미디어팀',
                imageCount: 6,
                tags: ['국정감사', '쟁점', '정리'],
                attachments: [
                    {
                        filename: 'cardnews-audit-1.jpg',
                        originalName: '국정감사_카드뉴스_01.jpg',
                        mimetype: 'image/jpeg',
                        size: 534000,
                        path: '/uploads/cardnews-audit-1.jpg'
                    },
                    {
                        filename: 'cardnews-audit-2.jpg',
                        originalName: '국정감사_카드뉴스_02.jpg',
                        mimetype: 'image/jpeg',
                        size: 512000,
                        path: '/uploads/cardnews-audit-2.jpg'
                    },
                    {
                        filename: 'cardnews-audit-3.jpg',
                        originalName: '국정감사_카드뉴스_03.jpg',
                        mimetype: 'image/jpeg',
                        size: 487000,
                        path: '/uploads/cardnews-audit-3.jpg'
                    },
                    {
                        filename: 'cardnews-audit-4.jpg',
                        originalName: '국정감사_카드뉴스_04.jpg',
                        mimetype: 'image/jpeg',
                        size: 498000,
                        path: '/uploads/cardnews-audit-4.jpg'
                    },
                    {
                        filename: 'cardnews-audit-5.jpg',
                        originalName: '국정감사_카드뉴스_05.jpg',
                        mimetype: 'image/jpeg',
                        size: 523000,
                        path: '/uploads/cardnews-audit-5.jpg'
                    },
                    {
                        filename: 'cardnews-audit-6.jpg',
                        originalName: '국정감사_카드뉴스_06.jpg',
                        mimetype: 'image/jpeg',
                        size: 501000,
                        path: '/uploads/cardnews-audit-6.jpg'
                    }
                ]
            }
        ];
        
        // 카드뉴스 생성
        for (const cardData of sampleCards) {
            const card = new CardNews(cardData);
            await card.save();
            console.log(`카드뉴스 생성됨: ${card.title}`);
        }
        
        // 생성된 카드뉴스 확인
        const cards = await CardNews.find({}).sort({ createdAt: -1 });
        console.log(`\n총 ${cards.length}개의 카드뉴스가 생성되었습니다:`);
        cards.forEach((card, index) => {
            console.log(`${index + 1}. ${card.title} (${card.category}) - ${card.attachments.length}장`);
        });
        
        await mongoose.disconnect();
        console.log('\n완료!');
        
    } catch (error) {
        console.error('오류:', error);
        await mongoose.disconnect();
    }
}

createSampleCardNews(); 