const mongoose = require('mongoose');

const pressReleaseSchema = new mongoose.Schema({
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
    enum: ['정책발표', '성명서', '논평', '기타']
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '대변인'
  },
  originalUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // 선택사항이므로 빈 값 허용
        return /^https?:\/\/.+/.test(v); // http:// 또는 https://로 시작하는 URL
      },
      message: '유효한 URL 형식이 아닙니다 (http:// 또는 https://로 시작해야 함)'
    }
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
  releaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

pressReleaseSchema.index({ createdAt: -1 });
pressReleaseSchema.index({ priority: -1 });
pressReleaseSchema.index({ releaseDate: -1 });

module.exports = mongoose.model('PressRelease', pressReleaseSchema); 