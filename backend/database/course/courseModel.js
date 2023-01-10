import mongoose from "mongoose";
import {courseID} from "../course/courseIDModel.js";
import {userID} from "../users/userIDModel.js";
import {videoID} from "../videos/videoIDModel.js";


const courseSchema = mongoose.Schema({
    title:{
        type:String,
        trim: true,
        required:true,
        minLength: 2,
        maxLength: 300
    },
    summary:{
        type:String,
        trim: true,
    },
    creator:userID,
    course_id:courseID,
    enrollments:{
        type:Number
    },
    link:{
        type:String,
        trim: true
    },
    category:{
        type:String,
        trim: true
    },
    rating:{
        type:String,
        trim: true
    },
    duration:{
        type:String,
        trim: true,
    },
    categories:{
        type:[String],
    },
    level:{
        type:String,
        trim:true
    },
    videos:[videoID]
})

export default mongoose.model("course", courseSchema);