const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
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
    enum: ['지역활동', '정책연구', '교육세미나', '회의', '기타']
  },
  activityType: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo'
  },
  youtubeUrl: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true; // 빈 문자열은 허용
        // 유튜브 URL 형식 검증
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(v);
      },
      message: '올바른 유튜브 URL 형식이 아닙니다.'
    }
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '활동팀'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String
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
  eventDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

activitySchema.index({ createdAt: -1 });
activitySchema.index({ eventDate: -1 });
activitySchema.index({ category: 1 });
activitySchema.index({ activityType: 1 });

module.exports = mongoose.model('Activity', activitySchema); 