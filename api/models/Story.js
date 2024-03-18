import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 40,
        required: true
    },
    genres: [{
        type: String,
        required: true
    }],
    maxAuthors: {
        type: Number,
        required: true
    },
    maxTimeLimit: {
        type: Number,
        required: true
    },
    entranceType: {
        type: String,
        enum: ['public', 'accessKeyOnly'],
        required: true
    },
    accessKey: {
        type: String,
        unique: true,
    },
    chapterCounter: {
        type: Number,
        default: 0,
    },
    completed: {
        type: Boolean,
        default: false
    },
    currentAuthorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorsIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    chapters: [
        {
            title: {
                type: String,
                minlength: 5,
                maxlength: 40,
                required: true
            },
            chapterNumber: {
                type: Number,
                required: true
            },
            content: {
                type: String,
                minlength: 1,
                maxlength: 2000,
                required: true
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
        }
    ],
}, { timestamps: true })

const Story = mongoose.model('Story', storySchema);
export default Story;
