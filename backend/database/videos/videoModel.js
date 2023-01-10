import mongoose from "mongoose";
import userID from "../users/userIDModel.js";


const videoSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength: 2,
        maxLength: 300
    },
    summary:{
        type:String,
        trim: true,
    },
    creator_id:userID,
    course_id:{
        type:String,
        required:true,
    },
    likes:{
        type:Number
    },
    video_link:{
        type:String,
    },
    video_thumbnail:{
        type:String,
    },
});

export default mongoose.model("videoSchema", videoSchema);