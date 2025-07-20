const mongoose = require('mongoose');

const policyCommitteeSchema = new mongoose.Schema({
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
    enum: ['회의록', '정책연구', '토론회', '간담회', '세미나', '워크숍']
  },
  policyArea: {
    type: String,
    required: true,
    enum: ['경제', '교육', '국방', '외교', '복지', '환경', '과학기술', '문화', '법무', '기타']
  },
  committeeName: {
    type: String,
    default: '정책위원회'
  },
  chairperson: {
    type: String,
    default: ''
  },
  participants: [{
    name: String,
    role: String,
    organization: String
  }],
  meetingDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
  },
  agenda: [{
    order: Number,
    topic: String,
    presenter: String,
    duration: String
  }],
  decisions: [{
    item: String,
    decision: String,
    notes: String
  }],
  priority: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    required: true,
    default: '정책위원회'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String
  }],
  relatedPolicies: [{
    type: String,
    trim: true
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
  isConfidential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 인덱스 설정
policyCommitteeSchema.index({ createdAt: -1 });
policyCommitteeSchema.index({ meetingDate: -1 });
policyCommitteeSchema.index({ category: 1 });
policyCommitteeSchema.index({ policyArea: 1 });
policyCommitteeSchema.index({ priority: -1 });
policyCommitteeSchema.index({ status: 1 });
policyCommitteeSchema.index({ tags: 1 });

module.exports = mongoose.model('PolicyCommittee', policyCommitteeSchema); 