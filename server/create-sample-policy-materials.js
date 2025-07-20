const mongoose = require('mongoose');
require('dotenv').config();

const { PolicyMaterial } = require('./models');

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결됨'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

async function createSamplePolicyMaterials() {
  try {
    // 기존 정책자료 데이터 삭제
    await PolicyMaterial.deleteMany({});
    console.log('기존 정책자료 데이터 삭제됨');

    // 샘플 정책자료 데이터
    const sampleData = [
      {
        title: '4차 산업혁명 대응 종합 전략',
        excerpt: '4차 산업혁명 시대에 대비한 국가 차원의 종합적인 대응 전략을 제시합니다.',
        category: '경제정책',
        content: `# 4차 산업혁명 대응 종합 전략

## 개요
4차 산업혁명은 인공지능, 빅데이터, 사물인터넷 등의 기술이 융합되어 경제·사회 전반을 변화시키는 혁명적 변화입니다.

## 주요 정책 방향

### 1. 인공지능 생태계 구축
- AI 연구개발 투자 확대
- AI 전문인력 양성
- AI 윤리 가이드라인 마련

### 2. 디지털 인프라 강화
- 5G 네트워크 전국 구축
- 데이터센터 현대화
- 사이버보안 체계 강화

### 3. 규제혁신 추진
- 샌드박스 제도 확대
- 네거티브 규제 도입
- 신산업 규제 개선

## 기대효과
- GDP 성장률 2%p 상승
- 일자리 100만개 창출
- 국가 경쟁력 강화`,
        author: '정책연구소',
        status: 'published',
        policyType: '백서',
        tags: ['4차산업혁명', 'AI', '빅데이터', '디지털전환'],
        views: 156,
        downloadCount: 23,
        attachments: [
          {
            filename: '4차산업혁명_대응전략.pdf',
            originalName: '4차 산업혁명 대응 전략.pdf',
            path: '/resources/documents/4차산업혁명_대응전략.pdf',
            size: 2048000,
            mimeType: 'application/pdf',
            pages: 45
          }
        ]
      },
      {
        title: '개별맞춤형 교육시스템 구축 방안',
        excerpt: '학습자 개인의 특성과 수준에 맞는 맞춤형 교육시스템 구축을 위한 정책 방안을 제시합니다.',
        category: '교육정책',
        content: `# 개별맞춤형 교육시스템 구축 방안

## 배경 및 필요성
- 획일적 교육시스템의 한계
- 개인차를 고려한 교육 필요성 증대
- 디지털 기술을 활용한 교육혁신 요구

## 주요 추진 방향

### 1. AI 기반 학습 분석 시스템
- 학습자 데이터 수집 및 분석
- 개인별 학습 패턴 파악
- 맞춤형 학습 콘텐츠 추천

### 2. 유연한 교육과정 운영
- 학점제 고등학교 확산
- 온라인-오프라인 혼합 수업
- 프로젝트 기반 학습 활성화

### 3. 교사 역량 강화
- AI 활용 교육 연수
- 개별지도 역량 제고
- 교육 데이터 활용 능력 향상

## 추진 전략
1. 시범학교 운영 (2025년)
2. 점진적 확산 (2026-2027년)
3. 전면 도입 (2028년)`,
        author: '정책연구소',
        status: 'published',
        policyType: '연구보고서',
        tags: ['교육개혁', '맞춤형교육', 'AI교육', '디지털교육'],
        views: 89,
        downloadCount: 15,
        attachments: [
          {
            filename: '개별맞춤형_교육시스템.pdf',
            originalName: '개별맞춤형 교육시스템 구축방안.pdf',
            path: '/resources/documents/개별맞춤형_교육시스템.pdf',
            size: 1536000,
            mimeType: 'application/pdf',
            pages: 32
          }
        ]
      },
      {
        title: '국가안보 정책 방향',
        excerpt: '변화하는 안보환경에 대응한 국가안보 정책의 기본 방향과 세부 전략을 제시합니다.',
        category: '안보정책',
        content: `# 국가안보 정책 방향

## 안보환경 변화
- 전통적 안보위협의 다변화
- 신종 안보위협 등장
- 국제 안보협력 필요성 증대

## 정책 목표
1. **포괄적 안보체계 구축**
2. **능동적 억지력 강화**
3. **국제 안보협력 확대**

### 핵심 추진과제

#### 1. 국방력 현대화
- 첨단 무기체계 도입
- 국방 R&D 투자 확대
- 방산업체 경쟁력 강화

#### 2. 사이버 안보 강화
- 국가 사이버보안 체계 구축
- 민관 협력 강화
- 사이버 전문인력 양성

#### 3. 한반도 평화 정착
- 대북 정책 일관성 유지
- 국제사회와의 공조 강화
- 평화통일 기반 조성

## 투자 계획
- 국방예산 GDP 대비 3% 수준 유지
- 신기술 분야 투자 비중 확대
- 방위산업 수출 확대`,
        author: '정책연구소',
        status: 'published',
        policyType: '제안서',
        tags: ['국가안보', '국방정책', '사이버보안', '평화통일'],
        views: 134,
        downloadCount: 28,
        attachments: [
          {
            filename: '국가안보_정책방향.pdf',
            originalName: '국가안보 정책 방향.pdf',
            path: '/resources/documents/국가안보_정책방향.pdf',
            size: 1792000,
            mimeType: 'application/pdf',
            pages: 38
          }
        ]
      },
      {
        title: '사회안전망 강화정책',
        excerpt: '코로나19 이후 변화된 사회구조에 맞는 새로운 사회안전망 구축 방안을 제시합니다.',
        category: '사회정책',
        content: `# 사회안전망 강화정책

## 배경
코로나19 팬데믹은 우리 사회의 취약점을 드러내며, 새로운 형태의 사회안전망 필요성을 제기했습니다.

## 주요 정책

### 1. 전국민 기본소득 검토
- 시범사업 추진
- 재원 조달 방안 연구
- 사회적 합의 도출

### 2. 플랫폼 노동자 보호
- 사회보험 적용 확대
- 노동권 보장
- 안전망 구축

### 3. 청년 지원 강화
- 청년 기본소득 도입
- 주거 지원 확대
- 취업 지원 강화

## 기대효과
- 사회 불평등 완화
- 경제 안정성 제고
- 사회 통합 강화`,
        author: '정책연구소',
        status: 'published',
        policyType: '토론자료',
        tags: ['사회안전망', '기본소득', '플랫폼노동', '청년정책'],
        views: 67,
        downloadCount: 12,
        attachments: [
          {
            filename: '사회안전망_강화정책.pdf',
            originalName: '사회안전망 강화정책.pdf',
            path: '/resources/documents/사회안전망_강화정책.pdf',
            size: 1280000,
            mimeType: 'application/pdf',
            pages: 28
          }
        ]
      }
    ];

    // 데이터 삽입
    const policyMaterials = await PolicyMaterial.insertMany(sampleData);
    console.log(`✅ ${policyMaterials.length}개의 정책자료 샘플 데이터가 생성되었습니다`);

    // 생성된 데이터 확인
    for (const policy of policyMaterials) {
      console.log(`📋 ${policy.title} (${policy.category}) - ID: ${policy._id}`);
    }

    // 카테고리별 개수 확인
    const categoryCounts = await PolicyMaterial.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 카테고리별 개수:');
    categoryCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}개`);
    });

  } catch (error) {
    console.error('❌ 정책자료 샘플 데이터 생성 실패:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSamplePolicyMaterials(); 