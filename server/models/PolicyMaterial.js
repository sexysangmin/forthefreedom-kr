const mongoose = require('mongoose');

const policyMaterialSchema = new mongoose.Schema({
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
    enum: ['경제정책', '교육정책', '안보정책', '사회정책', '환경정책', '기타']
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '정책연구소'
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
  downloadCount: {
    type: Number,
    default: 0
  },
  policyType: {
    type: String,
    enum: ['제안서', '연구보고서', '백서', '토론자료'],
    default: '제안서'
  }
}, {
  timestamps: true
});

policyMaterialSchema.index({ createdAt: -1 });
policyMaterialSchema.index({ category: 1 });
policyMaterialSchema.index({ policyType: 1 });

module.exports = mongoose.model('PolicyMaterial', policyMaterialSchema); 