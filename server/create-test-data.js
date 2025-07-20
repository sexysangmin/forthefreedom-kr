const axios = require('axios');

const API_BASE = 'http://localhost:9000/api';

// 테스트 데이터 정의
const testData = {
  notices: {
    title: "자유와혁신당 창당 발표",
    excerpt: "새로운 정당의 출범을 알려드립니다.",
    category: "중요",
    content: "# 자유와혁신당 창당 발표\n\n자유와혁신당이 공식 창당되었습니다. 우리는 새로운 정치의 시대를 열어가겠습니다.",
    author: "관리자",
    status: "published"
  },
  
  spokesperson: {
    title: "경제정책 관련 대변인 논평",
    excerpt: "현 정부의 경제정책에 대한 자유와혁신당의 입장을 발표합니다.",
    category: "논평",
    content: "# 경제정책 관련 논평\n\n현재의 경제상황에 대한 우리당의 견해를 밝힙니다.",
    author: "대변인실",
    spokespersonName: "김대변",
    spokespersonTitle: "대변인",
    issueDate: new Date().toISOString(),
    isUrgent: false,
    status: "published"
  },
  
  'policy-committee': {
    title: "교육정책 연구 보고서",
    excerpt: "미래 교육시스템 개선방안에 대한 정책위원회 연구결과입니다.",
    category: "정책연구",
    content: "# 교육정책 연구 보고서\n\n우리나라 교육시스템의 혁신방안을 제시합니다.",
    author: "정책위원회",
    policyArea: "교육",
    committeeName: "정책위원회",
    chairperson: "이정책",
    meetingDate: new Date().toISOString(),
    location: "당사 회의실",
    status: "published"
  },
  
  'new-media': {
    title: "청년정책 카드뉴스",
    excerpt: "청년들을 위한 정책을 카드뉴스로 제작했습니다.",
    category: "카드뉴스",
    content: "# 청년정책 카드뉴스\n\n청년 일자리 창출 정책을 알기 쉽게 설명합니다.",
    author: "뉴미디어팀",
    mediaType: "image",
    platform: "인스타그램",
    targetAudience: "청년",
    designer: "박디자인",
    status: "published"
  },
  
  'media-coverage': {
    title: "KBS 뉴스9 당 대표 인터뷰",
    excerpt: "당 대표가 KBS 뉴스9에 출연하여 주요 정책을 설명했습니다.",
    category: "인터뷰",
    content: "# KBS 뉴스9 인터뷰\n\n당 대표의 주요 발언 내용을 정리했습니다.",
    author: "미디어팀",
    mediaOutlet: "KBS",
    mediaType: "TV",
    journalist: "김기자",
    program: "뉴스9",
    broadcastDate: new Date().toISOString(),
    tone: "중립",
    importance: "상",
    status: "published"
  },
  
  events: {
    title: "정책토론회 개최",
    excerpt: "경제정책에 대한 시민토론회를 개최합니다.",
    category: "정책토론회",
    content: "# 정책토론회 안내\n\n시민 여러분과 함께하는 정책토론회에 많은 참여 부탁드립니다.",
    author: "기획조정실",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 일주일 후
    eventLocation: "시민회관 대강당",
    organizer: "자유와혁신당",
    contact: "02-1234-5678",
    status: "published"
  },
  
  'card-news': {
    title: "국정감사 주요 이슈",
    excerpt: "국정감사에서 제기된 주요 이슈들을 카드뉴스로 정리했습니다.",
    category: "정책",
    content: "# 국정감사 주요 이슈\n\n이번 국정감사의 핵심 쟁점들을 알아보세요.",
    author: "뉴미디어팀",
    imageCount: 8,
    status: "published"
  },
  
  gallery: {
    title: "당 창당대회 현장",
    excerpt: "자유와혁신당 창당대회 현장 사진들입니다.",
    category: "당 행사",
    content: "# 창당대회 현장\n\n역사적인 창당대회의 생생한 현장을 담았습니다.",
    author: "홍보팀",
    imageCount: 15,
    status: "published"
  },
  
  'press-releases': {
    title: "경제정책 발표 보도자료",
    excerpt: "자유와혁신당의 새로운 경제정책을 발표합니다.",
    category: "정책발표",
    content: "# 경제정책 발표\n\n지속가능한 경제성장을 위한 우리당의 정책을 제시합니다.",
    author: "대변인",
    originalUrl: "https://example.com/press-release-1",
    status: "published"
  },
  
  activities: {
    title: "지역 시민과의 만남",
    excerpt: "강남구 시민들과 함께한 정책간담회 현장입니다.",
    category: "지역활동",
    content: "# 시민과의 만남\n\n지역 현안에 대해 시민들과 소통했습니다.",
    author: "관리자",
    activityType: "photo",
    eventDate: new Date().toISOString().split('T')[0],
    location: "강남구민회관",
    status: "published"
  },
  
  'policy-materials': {
    title: "2024년 경제정책 백서",
    excerpt: "자유와혁신당의 경제정책 방향을 담은 백서입니다.",
    category: "경제정책",
    content: "# 경제정책 백서\n\n혁신적인 경제정책으로 새로운 미래를 만들어갑니다.",
    author: "정책연구소",
    status: "published"
  },
  
  'party-constitution': {
    title: "자유와혁신당 당헌",
    excerpt: "자유와혁신당의 기본 당헌입니다.",
    category: "당헌",
    content: "# 자유와혁신당 당헌\n\n제1조 (목적) 본 당은 자유민주주의와 혁신을 추구한다.",
    author: "당무위원회",
    status: "published"
  },
  
  'election-materials': {
    title: "2024년 총선 공약집",
    excerpt: "2024년 총선을 위한 자유와혁신당의 핵심 공약입니다.",
    category: "총선자료",
    content: "# 2024년 총선 공약\n\n국민과 함께하는 혁신정치를 실현하겠습니다.",
    author: "선거대책위원회",
    electionType: "국회의원선거",
    electionYear: 2024,
    status: "published"
  }
};

// 데이터 생성 함수
async function createTestData() {
  console.log('🚀 테스트 데이터 생성을 시작합니다...\n');
  
  for (const [endpoint, data] of Object.entries(testData)) {
    try {
      console.log(`📝 ${endpoint} 데이터 생성 중...`);
      const response = await axios.post(`${API_BASE}/${endpoint}`, data);
      console.log(`✅ ${endpoint} 생성 완료! ID: ${response.data.data._id}`);
    } catch (error) {
      console.error(`❌ ${endpoint} 생성 실패:`, error.response?.data?.message || error.message);
    }
  }
  
  console.log('\n🎉 모든 테스트 데이터 생성이 완료되었습니다!');
}

// 실행
createTestData().catch(console.error); 