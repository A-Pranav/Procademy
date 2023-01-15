import mongoose from "mongoose";
import { courseID } from "../course/courseIDModel.js";
import { userID } from "../users/userIDModel.js";
import { videoID } from "../videos/videoIDModel.js";


const courseSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minLength: 2,
        maxLength: 300
    },
    summary: {
        type: String,
        trim: true,
    },
    creator: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    creatorName: {
        type: String,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 300
    },
    course_id: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 300
    },
    enrollments: {
        type: Number
    },
    link: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    rating: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true,
    },
    lecture_count: {
        type: String,
        trim: true,
    },
    level: {
        type: String,
        trim: true
    },
    videos: [ videoID ]
})

export default mongoose.model("course", courseSchema);