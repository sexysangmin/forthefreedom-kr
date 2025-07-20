const mongoose = require('mongoose');
require('dotenv').config();

const { Gallery } = require('./models');

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결됨'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

async function createSampleGallery() {
  try {
    // 기존 갤러리 데이터 삭제
    await Gallery.deleteMany({});
    console.log('기존 갤러리 데이터 삭제됨');

    // 샘플 갤러리 데이터
    const sampleData = [
      {
        title: '2025년 첫 번째 당원 대회',
        excerpt: '새해를 맞아 당원들이 모여 올해 목표와 계획을 논의했습니다.',
        category: '당 행사',
        content: '2025년 첫 번째 당원 대회가 성황리에 개최되었습니다. 이번 대회에서는 올해의 주요 정책 방향과 활동 계획을 논의하고, 당원들 간의 소통을 강화하는 시간을 가졌습니다.',
        author: '홍보팀',
        imageCount: 3,
        status: 'published',
        tags: ['당원대회', '2025년', '새해', '계획'],
        attachments: [
          {
            filename: 'jpg-1752815725399-806118100.jpg',
            originalName: '당원대회1.jpg',
            mimetype: 'image/jpeg',
            size: 256000,
            path: '/uploads/jpg-1752815725399-806118100.jpg'
          },
          {
            filename: 'win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg',
            originalName: '당원대회2.jpg',
            mimetype: 'image/jpeg',
            size: 182000,
            path: '/uploads/win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg'
          }
        ],
        views: 15,
        publishDate: new Date('2025-01-15')
      },
      {
        title: '지역 주민과의 간담회',
        excerpt: '지역 주민들의 목소리를 직접 듣는 소중한 시간을 가졌습니다.',
        category: '지역활동',
        content: '○○구 주민들과의 간담회를 통해 지역 현안에 대한 다양한 의견을 수렴했습니다. 교통, 교육, 환경 등 다양한 분야에서 건설적인 논의가 이어졌습니다.',
        author: '홍보팀',
        imageCount: 2,
        status: 'published',
        tags: ['간담회', '주민', '지역활동', '소통'],
        attachments: [
          {
            filename: 'jpg-1752815725399-806118100.jpg',
            originalName: '간담회1.jpg',
            mimetype: 'image/jpeg',
            size: 245000,
            path: '/uploads/jpg-1752815725399-806118100.jpg'
          }
        ],
        views: 8,
        publishDate: new Date('2025-01-10')
      },
      {
        title: '정책위원회 정기회의',
        excerpt: '중요 정책안에 대한 심도 있는 토론이 진행되었습니다.',
        category: '회의',
        content: '정책위원회 정기회의에서 교육개혁안과 경제정책에 대한 집중 논의가 있었습니다. 전문가 의견과 현장 목소리를 종합하여 더 나은 정책 방향을 모색했습니다.',
        author: '홍보팀',
        imageCount: 1,
        status: 'published',
        tags: ['정책위원회', '회의', '교육개혁', '경제정책'],
        attachments: [
          {
            filename: 'win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg',
            originalName: '정책회의.jpg',
            mimetype: 'image/jpeg',
            size: 189000,
            path: '/uploads/win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg'
          }
        ],
        views: 12,
        publishDate: new Date('2025-01-08')
      }
    ];

    // 데이터 삽입
    const galleries = await Gallery.insertMany(sampleData);
    console.log(`✅ ${galleries.length}개의 갤러리 샘플 데이터가 생성되었습니다`);

    // 생성된 데이터 확인
    for (const gallery of galleries) {
      console.log(`📷 ${gallery.title} (${gallery.category}) - ${gallery.attachments.length}개 이미지`);
    }

  } catch (error) {
    console.error('❌ 갤러리 샘플 데이터 생성 실패:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSampleGallery(); 