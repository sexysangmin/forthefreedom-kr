// Railway 환경 변수 테스트
console.log('🔍 환경 변수 테스트:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ 설정됨' : '❌ 없음');
console.log('PORT:', process.env.PORT);

// 모든 환경 변수 출력
console.log('\n📋 모든 환경 변수:');
Object.keys(process.env).forEach(key => {
  if (key.includes('MONGO') || key.includes('NODE') || key.includes('PORT')) {
    console.log(`${key}: ${process.env[key]}`);
  }
}); 