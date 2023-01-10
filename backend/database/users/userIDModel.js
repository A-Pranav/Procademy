import mongoose from "mongoose";
// import courseID from "../course/courseIDModel.js";

export const userID = mongoose.Schema({
    user_id:{
        type:String,
        // required:true,
        // minLength: 4,
        // maxLength: 300
    }
});

export default mongoose.model("userID", userID);