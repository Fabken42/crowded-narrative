import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        minlength: 4,
        maxlength: 14,
        unique: true,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    timeRemainingToWriteChapter:{
        type: Number,
        default: 0
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;