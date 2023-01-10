import mongoose from "mongoose";
import courseModel from "../course/courseModel";
import courseID from "../course/courseIDmodel";

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const imgPath="../images/";


const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        minLength: 2,
        maxLength: 300
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    address:addressSchema,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true,'Email address is required'],
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    profilePictuer:{
        type: String,
        get:(imgName)=>`${imgPath}/${imgName}`
    },
    custom_id:{
        type:String,
        required:true,
        trim: true,
        minLength: 4,
        maxLength: 300
    },
    courses_enrolled:[courseID],
    courses_created:[courseModel],
});

export default mongoose.model("userSchema", userSchema);