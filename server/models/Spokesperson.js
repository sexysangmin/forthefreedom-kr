const mongoose = require('mongoose');

const spokespersonSchema = new mongoose.Schema({
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
    enum: ['논평', '성명', '입장발표', '브리핑', '인터뷰']
  },
  spokespersonName: {
    type: String,
    required: true,
    default: '당 대변인'
  },
  spokespersonTitle: {
    type: String,
    default: '대변인'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedTopics: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    required: true,
    default: '대변인실'
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
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 인덱스 설정
spokespersonSchema.index({ createdAt: -1 });
spokespersonSchema.index({ issueDate: -1 });
spokespersonSchema.index({ category: 1 });
spokespersonSchema.index({ priority: -1 });
spokespersonSchema.index({ status: 1 });
spokespersonSchema.index({ tags: 1 });

module.exports = mongoose.model('Spokesperson', spokespersonSchema); 