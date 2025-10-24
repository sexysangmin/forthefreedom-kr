const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
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
        enum: ['당 행사', '지역활동', '회의', '세미나', '기타']
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: '홍보팀'
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
    sortOrder: {
        type: Number,
        default: 0,
        index: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 인덱스 설정
gallerySchema.index({ title: 'text', content: 'text' });
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ status: 1 });
gallerySchema.index({ sortOrder: 1, createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema); 