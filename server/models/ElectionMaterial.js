const mongoose = require('mongoose');

const electionMaterialSchema = new mongoose.Schema({
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
    enum: ['대선자료', '총선자료', '지방선거', '당내선거', '기타']
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '선거대책위원회'
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
  electionYear: {
    type: Number,
    required: true,
    default: new Date().getFullYear()
  },
  electionType: {
    type: String,
    enum: ['대통령선거', '국회의원선거', '지방선거', '당대표선거'],
    required: true
  }
}, {
  timestamps: true
});

electionMaterialSchema.index({ createdAt: -1 });
electionMaterialSchema.index({ electionYear: -1 });
electionMaterialSchema.index({ electionType: 1 });

module.exports = mongoose.model('ElectionMaterial', electionMaterialSchema); 