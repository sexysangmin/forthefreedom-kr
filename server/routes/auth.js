const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

// 구글 OAuth 클라이언트 설정
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 허용된 관리자 이메일 리스트
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1 || 'admin@forthefreedom.kr',
  process.env.ADMIN_EMAIL_2 || 'manager@forthefreedom.kr',
  process.env.ADMIN_EMAIL_3 || 'editor@forthefreedom.kr'
].filter(email => email && email !== '');

// 구글 토큰 검증 함수
async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified
    };
  } catch (error) {
    throw new Error('유효하지 않은 Google 토큰입니다');
  }
}

// JWT 토큰 생성 함수
function generateJWT(user) {
  return jwt.sign(
    { 
      email: user.email, 
      name: user.name,
      picture: user.picture,
      type: 'admin'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

// 구글 OAuth 로그인
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google 인증 토큰이 필요합니다'
      });
    }

    // 구글 토큰 검증
    const userInfo = await verifyGoogleToken(credential);
    
    if (!userInfo.emailVerified) {
      return res.status(400).json({
        success: false,
        message: '이메일 인증이 완료되지 않은 Google 계정입니다'
      });
    }

    // 관리자 권한 확인
    if (!ADMIN_EMAILS.includes(userInfo.email)) {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 없는 계정입니다',
        email: userInfo.email
      });
    }

    // JWT 토큰 생성
    const token = generateJWT(userInfo);
    
    // 로그인 성공 로그
    console.log(`[AUTH] 관리자 로그인: ${userInfo.email} (${userInfo.name})`);
    
    res.json({
      success: true,
      message: '로그인이 완료되었습니다',
      token,
      user: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      }
    });

  } catch (error) {
    console.error('[AUTH] Google 로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 기존 비밀번호 로그인 (비상용)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '사용자명과 비밀번호를 입력해주세요'
      });
    }

    // 환경변수에서 관리자 계정 확인
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminUsername || !adminPassword) {
      return res.status(500).json({
        success: false,
        message: '관리자 계정이 설정되지 않았습니다'
      });
    }

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: '잘못된 사용자명 또는 비밀번호입니다'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        username,
        type: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    console.log(`[AUTH] 기본 계정 로그인: ${username}`);

    res.json({
      success: true,
      message: '로그인이 완료되었습니다',
      token,
      user: {
        username,
        email: 'admin@local'
      }
    });

  } catch (error) {
    console.error('[AUTH] 로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 토큰 검증
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 없습니다'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      user: decoded
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다'
    });
  }
});

// 로그아웃 (토큰 무효화)
router.post('/logout', (req, res) => {
  // 실제로는 클라이언트에서 토큰을 삭제하는 것으로 충분
  // 더 높은 보안을 위해서는 토큰 블랙리스트 구현 가능
  res.json({
    success: true,
    message: '로그아웃되었습니다'
  });
});

module.exports = router; 