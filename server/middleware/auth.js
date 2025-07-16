const jwt = require('jsonwebtoken');

// JWT 토큰 검증 미들웨어
const auth = (req, res, next) => {
  try {
    // 헤더에서 토큰 추출
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '접근 권한이 없습니다. 로그인이 필요합니다.'
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 관리자 권한 확인
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다.'
      });
    }

    // 검증된 사용자 정보를 request에 추가
    req.user = decoded;
    next();

  } catch (error) {
    console.error('토큰 검증 오류:', error);
    
    // 토큰 만료 오류
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다. 다시 로그인해주세요.'
      });
    }
    
    // 기타 토큰 오류
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.'
    });
  }
};

// 선택적 인증 미들웨어 (토큰이 있으면 검증, 없으면 통과)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 통과
    next();
  }
};

module.exports = { auth, optionalAuth }; 