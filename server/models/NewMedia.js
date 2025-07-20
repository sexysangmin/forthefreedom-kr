const mongoose = require('mongoose');

const newMediaSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['카드뉴스', '영상', '홍보물', 'SNS콘텐츠', '인포그래픽', '웹툰']
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'audio', 'document', 'interactive']
  },
  platform: {
    type: String,
    required: true,
    enum: ['페이스북', '인스타그램', '유튜브', '트위터', '틱톡', '네이버블로그', '카카오스토리', '웹사이트']
  },
  dimensions: {
    width: Number,
    height: Number,
    format: String // 16:9, 1:1, 9:16 등
  },
  youtubeUrl: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true;
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(v);
      },
      message: '올바른 유튜브 URL 형식이 아닙니다.'
    }
  },
  socialMediaLinks: [{
    platform: String,
    url: String,
    postId: String
  }],
  hashtags: [{
    type: String,
    trim: true
  }],
  targetAudience: {
    type: String,
    enum: ['일반', '청년', '중장년', '전문가', '당원', '전체'],
    default: '일반'
  },
  publishSchedule: {
    type: Date,
    default: null
  },
  engagement: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '뉴미디어팀'
  },
  designer: {
    type: String,
    default: ''
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    thumbnailPath: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'published'
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    reach: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// 인덱스 설정
newMediaSchema.index({ createdAt: -1 });
newMediaSchema.index({ publishSchedule: 1 });
newMediaSchema.index({ category: 1 });
newMediaSchema.index({ mediaType: 1 });
newMediaSchema.index({ platform: 1 });
newMediaSchema.index({ priority: -1 });
newMediaSchema.index({ status: 1 });
newMediaSchema.index({ hashtags: 1 });
newMediaSchema.index({ targetAudience: 1 });

module.exports = mongoose.model('NewMedia', newMediaSchema); 