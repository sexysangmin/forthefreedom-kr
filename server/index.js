// 환경변수 로딩
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// 설정 및 데이터베이스
const config = require('./config/config');
const connectDB = require('./config/database');

// Express 앱 생성
const app = express();

// 데이터베이스 연결
connectDB();

// 미들웨어 설정
app.use(helmet({
  contentSecurityPolicy: false, // 개발 중에는 비활성화
}));

// CORS 설정 - 임시로 모든 도메인 허용 (문제 해결 후 제한)
app.use(cors({
  origin: true, // 임시로 모든 origin 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// 조건부 JSON/URL 인코딩 미들웨어 (multipart/form-data는 제외)
app.use((req, res, next) => {
  const contentType = req.get('content-type') || '';
  
  // multipart/form-data는 multer가 처리하므로 제외
  if (!contentType.includes('multipart/form-data')) {
    if (contentType.includes('application/json')) {
      express.json({ limit: '10mb' })(req, res, next);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
    } else {
      next();
    }
  } else {
    next();
  }
});

// 정적 파일 제공
const uploadsPath = path.join(__dirname, 'uploads');
console.log('업로드 디렉토리 경로:', uploadsPath);

// uploads 디렉토리가 없으면 생성
const fs = require('fs');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('uploads 디렉토리 생성됨');
}

app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath, stat) => {
    // 기본 CORS 헤더
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    
    // Cross-Origin 정책 헤더
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.set('Cross-Origin-Opener-Policy', 'unsafe-none');
    
    // 캐시 및 보안 헤더
    res.set('Cache-Control', 'public, max-age=31536000');
    res.set('X-Content-Type-Options', 'nosniff');
    
    // 파일 타입별 Content-Type 명시적 설정
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    
    if (mimeTypes[ext]) {
      res.set('Content-Type', mimeTypes[ext]);
    }
    
    console.log('정적 파일 요청:', filePath, `(${stat.size} bytes)`);
  }
}));

// OPTIONS 요청 처리 (uploads 경로용)
app.options('/uploads/*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.set('Access-Control-Max-Age', '86400'); // 24시간
  res.status(200).end();
});

// 기본 라우트
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '자유와혁신 API 서버가 정상 작동 중입니다',
    timestamp: new Date().toISOString()
  });
});

// API 라우트들
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/policy-materials', require('./routes/policyMaterials'));
app.use('/api/party-constitution', require('./routes/partyConstitution'));
app.use('/api/election-materials', require('./routes/electionMaterials'));
app.use('/api/spokesperson', require('./routes/spokesperson'));
app.use('/api/policy-committee', require('./routes/policyCommittee'));
app.use('/api/new-media', require('./routes/newMedia'));
app.use('/api/media-coverage', require('./routes/mediaCoverage'));

// 추가 콘텐츠 타입 라우트들
app.use('/api/events', require('./routes/events'));
app.use('/api/card-news', require('./routes/cardNews'));
app.use('/api/gallery', require('./routes/gallery'));

// 404 에러 핸들링
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `경로를 찾을 수 없습니다: ${req.originalUrl}`
  });
});

// 글로벌 에러 핸들링
app.use((error, req, res, next) => {
  console.error('서버 에러:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: config.NODE_ENV === 'production' 
      ? '서버 내부 오류가 발생했습니다' 
      : error.message,
    stack: config.NODE_ENV === 'production' ? undefined : error.stack
  });
});

// 서버 시작
const PORT = config.PORT;
const HOST = '0.0.0.0'; // Railway에서 외부 접근을 위해 0.0.0.0으로 바인딩

app.listen(PORT, HOST, () => {
  console.log(`🚀 자유와혁신 API 서버가 포트 ${PORT}에서 시작되었습니다`);
  console.log(`🌍 환경: ${config.NODE_ENV}`);
  console.log(`🌐 호스트: ${HOST}:${PORT}`);
  
  // Railway 환경에서는 실제 공개 URL 표시
  if (config.NODE_ENV === 'production') {
    console.log(`📍 Health Check: https://forthefreedom-kr-production.up.railway.app/api/health`);
    console.log(`🔗 API Base: https://forthefreedom-kr-production.up.railway.app/api`);
  } else {
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  }
}); 