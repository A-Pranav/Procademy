import mongoose from "mongoose";
import {courseID} from "../course/courseIDModel.js";

export const videoID = mongoose.Schema({
    video_id:{
        type:String,
        required:true,
    },
});

// export default mongoose.model("videoID", videoID);