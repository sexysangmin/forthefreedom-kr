const mongoose = require('mongoose');

const partyConstitutionSchema = new mongoose.Schema({
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
    enum: ['당헌', '당규', '규정', '지침']
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '당무위원회'
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
  version: {
    type: String,
    required: true,
    default: '1.0'
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

partyConstitutionSchema.index({ createdAt: -1 });
partyConstitutionSchema.index({ version: -1 });
partyConstitutionSchema.index({ effectiveDate: -1 });

module.exports = mongoose.model('PartyConstitution', partyConstitutionSchema); 