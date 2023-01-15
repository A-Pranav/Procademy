import mongoose from "mongoose";
import userID from "../users/userIDModel.js";


const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 300
    },
    discription: {
        type: String,
        trim: true,
    },
    video_id: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    video_name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    creator_id: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    creator_name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    course_id: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    likes: {
        type: Number
    },
    video_link: {
        type: String,
    },
    video_thumbnail: {
        type: String,
    },
});

export default mongoose.model("videoSchema", videoSchema);