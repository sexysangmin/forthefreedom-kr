const mongoose = require('mongoose');
require('dotenv').config();

const { PolicyMaterial } = require('./models');

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결됨'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

async function checkPolicyMaterials() {
  try {
    const count = await PolicyMaterial.countDocuments();
    console.log(`📊 정책자료 총 개수: ${count}개`);
    
    if (count > 0) {
      const items = await PolicyMaterial.find({}, '_id title category createdAt').sort({ createdAt: -1 });
      console.log('\n📋 현재 정책자료 목록:');
      items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} (${item.category})`);
        console.log(`   ID: ${item._id}`);
        console.log(`   생성일: ${item.createdAt.toISOString().split('T')[0]}`);
        console.log('');
      });
    } else {
      console.log('\n❌ 정책자료가 없습니다. 샘플 데이터를 생성해야 합니다.');
    }
  } catch (error) {
    console.error('❌ 정책자료 확인 실패:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkPolicyMaterials(); 