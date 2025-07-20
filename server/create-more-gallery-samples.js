const mongoose = require('mongoose');
require('dotenv').config();

const { Gallery } = require('./models');

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결됨'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

async function createMoreGalleryData() {
  try {
    // 추가 갤러리 데이터
    const additionalData = [
      {
        title: '청년정책 세미나 개최',
        excerpt: '청년들을 위한 정책 방향을 논의하는 세미나가 열렸습니다.',
        category: '세미나',
        content: '청년 일자리 창출과 주거 안정을 위한 정책 세미나가 성공리에 개최되었습니다. 다양한 전문가와 청년 대표들이 참여하여 실질적인 해결방안을 모색했습니다.',
        author: '홍보팀',
        imageCount: 2,
        status: 'published',
        tags: ['청년정책', '세미나', '일자리', '주거'],
        attachments: [
          {
            filename: 'jpg-1752815725399-806118100.jpg',
            originalName: '청년세미나1.jpg',
            mimetype: 'image/jpeg',
            size: 245000,
            path: '/uploads/jpg-1752815725399-806118100.jpg'
          },
          {
            filename: 'win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg',
            originalName: '청년세미나2.jpg',
            mimetype: 'image/jpeg',
            size: 189000,
            path: '/uploads/win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg'
          }
        ],
        views: 22,
        publishDate: new Date('2025-01-12')
      },
      {
        title: '○○구 주민센터 방문',
        excerpt: '지역 주민들의 생활 현장을 직접 확인했습니다.',
        category: '지역활동',
        content: '○○구 주민센터를 방문하여 지역 주민들의 애로사항을 청취하고, 생활 불편 해소 방안을 논의했습니다. 교통 개선과 복지 확대에 대한 다양한 의견이 제시되었습니다.',
        author: '홍보팀',
        imageCount: 3,
        status: 'published',
        tags: ['지역활동', '주민센터', '생활개선', '복지'],
        attachments: [
          {
            filename: 'win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg',
            originalName: '주민센터방문1.jpg',
            mimetype: 'image/jpeg',
            size: 198000,
            path: '/uploads/win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg'
          },
          {
            filename: 'jpg-1752815725399-806118100.jpg',
            originalName: '주민센터방문2.jpg',
            mimetype: 'image/jpeg',
            size: 156000,
            path: '/uploads/jpg-1752815725399-806118100.jpg'
          }
        ],
        views: 18,
        publishDate: new Date('2025-01-13')
      },
      {
        title: '신년 하례식 및 시무식',
        excerpt: '2025년 새해를 맞아 당원들과 함께하는 뜻깊은 행사였습니다.',
        category: '당 행사',
        content: '2025년 신년 하례식과 시무식이 성대하게 열렸습니다. 당 대표의 신년사와 함께 올해의 비전과 목표를 다시 한번 다짐하는 시간을 가졌습니다.',
        author: '홍보팀',
        imageCount: 4,
        status: 'published',
        tags: ['신년', '하례식', '시무식', '2025년'],
        attachments: [
          {
            filename: 'jpg-1752815725399-806118100.jpg',
            originalName: '신년행사1.jpg',
            mimetype: 'image/jpeg',
            size: 267000,
            path: '/uploads/jpg-1752815725399-806118100.jpg'
          }
        ],
        views: 45,
        publishDate: new Date('2025-01-02')
      },
      {
        title: '기타 홍보 활동',
        excerpt: '다양한 홍보 활동을 통해 당의 정책을 알렸습니다.',
        category: '기타',
        content: 'SNS 홍보물 제작, 현수막 설치, 전단지 배포 등 다양한 홍보 활동을 통해 당의 정책과 활동을 시민들에게 널리 알렸습니다.',
        author: '홍보팀',
        imageCount: 1,
        status: 'published',
        tags: ['홍보', 'SNS', '현수막', '전단지'],
        attachments: [
          {
            filename: 'win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg',
            originalName: '홍보활동.jpg',
            mimetype: 'image/jpeg',
            size: 143000,
            path: '/uploads/win_20241107_19_01_30_pro-2-1752858352794-599807210.jpg'
          }
        ],
        views: 9,
        publishDate: new Date('2025-01-14')
      }
    ];

    // 데이터 삽입
    const galleries = await Gallery.insertMany(additionalData);
    console.log(`✅ ${galleries.length}개의 추가 갤러리 데이터가 생성되었습니다`);

    // 전체 갤러리 개수 확인
    const totalCount = await Gallery.countDocuments();
    console.log(`📊 총 갤러리 개수: ${totalCount}개`);

    // 카테고리별 개수 확인
    const categoryCounts = await Gallery.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 카테고리별 개수:');
    categoryCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}개`);
    });

  } catch (error) {
    console.error('❌ 추가 갤러리 데이터 생성 실패:', error);
  } finally {
    mongoose.connection.close();
  }
}

createMoreGalleryData(); 