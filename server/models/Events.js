const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
        enum: ['당 행사', '정책토론회', '간담회', '세미나', '봉사활동', '기타']
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: '기획조정실'
    },
    eventDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    eventLocation: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        default: '자유와혁신당'
    },
    contact: {
        type: String
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
eventSchema.index({ title: 'text', content: 'text' });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema); 