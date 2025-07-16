module.exports = {
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB 설정
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/party-website',
  
  // JWT 설정
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
  // 관리자 계정
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@party.kr',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123!',
  
  // 파일 업로드 설정
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads'
}; 