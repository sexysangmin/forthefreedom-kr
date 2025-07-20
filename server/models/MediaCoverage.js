const mongoose = require('mongoose');

const mediaCoverageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200
  },
  mediaOutlet: {
    type: String,
    required: true,
    trim: true // KBS, MBC, SBS, 조선일보, 중앙일보 등
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['TV', '신문', '온라인', '라디오', '잡지']
  },
  journalist: {
    type: String,
    default: ''
  },
  program: {
    type: String,
    default: '' // 프로그램명 또는 지면
  },
  broadcastDate: {
    type: Date,
    required: true
  },
  broadcastTime: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['뉴스', '토론', '인터뷰', '기획', '칼럼', '사설', '기타']
  },
  tone: {
    type: String,
    enum: ['긍정', '중립', '부정', '비판', '지지'],
    default: '중립'
  },
  importance: {
    type: String,
    enum: ['상', '중', '하'],
    default: '중'
  },
  originalUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        const urlRegex = /^https?:\/\/.+/;
        return urlRegex.test(v);
      },
      message: '올바른 URL 형식이 아닙니다.'
    }
  },
  archiveUrl: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String,
    trim: true
  }],
  mentionedPersons: [{
    name: String,
    role: String,
    quotes: [String]
  }],
  relatedTopics: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    maxlength: 500
  },
  impact: {
    type: String,
    enum: ['높음', '보통', '낮음'],
    default: '보통'
  },
  sentiment: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 }
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '미디어팀'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String
  }],
  screenshots: [{
    filename: String,
    path: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  responseRequired: {
    type: Boolean,
    default: false
  },
  responseNote: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// 인덱스 설정
mediaCoverageSchema.index({ createdAt: -1 });
mediaCoverageSchema.index({ broadcastDate: -1 });
mediaCoverageSchema.index({ mediaOutlet: 1 });
mediaCoverageSchema.index({ mediaType: 1 });
mediaCoverageSchema.index({ category: 1 });
mediaCoverageSchema.index({ tone: 1 });
mediaCoverageSchema.index({ importance: 1 });
mediaCoverageSchema.index({ priority: -1 });
mediaCoverageSchema.index({ status: 1 });
mediaCoverageSchema.index({ keywords: 1 });

module.exports = mongoose.model('MediaCoverage', mediaCoverageSchema); 