const mongoose = require('mongoose');

const cardNewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        maxlength: 200
    },
    category: {
        type: String,
        required: true,
        enum: ['정책', '활동', '소식', '정보']
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: '뉴미디어팀'
    },
    imageCount: {
        type: Number,
        min: 1,
        default: 1
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'published'
    },
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String
    }],
    views: {
        type: Number,
        default: 0
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 인덱스 설정
cardNewsSchema.index({ title: 'text', content: 'text' });
cardNewsSchema.index({ createdAt: -1 });
cardNewsSchema.index({ status: 1 });

module.exports = mongoose.model('CardNews', cardNewsSchema); 