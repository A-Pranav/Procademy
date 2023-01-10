import mongoose from "mongoose";


export const courseID = mongoose.Schema({
    course_id:{
        type:String,
        required:true,
    }
});
// export default mongoose.model("courseID", courseID);
