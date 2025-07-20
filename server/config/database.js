const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/party-website';
    
    // MongoDB 드라이버 4.0.0+ 에서는 useNewUrlParser, useUnifiedTopology 옵션이 불필요
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 