import mongoose from "mongoose";

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const imgPath = "../images/";

// const addressSchema = mongoose.Schema({
//     streetAddress: {
//         type: String,
//         minLength: 3,
//         maxLength: 300
//     },
//     pincode: {
//         type: String,
//         minLength: 6,
//         maxLength: 10
//     },
//     state: {
//         type: String,
//         minLength: 3,
//         maxLength: 20
//     },
//     city: {
//         type: String,
//         minLength: 3,
//         maxLength: 20
//     },
//     country: {
//         type: String,
//         minLength: 2,
//         maxLength: 30
//     }
// });



const userSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:true,
        minLength: 4,
        maxLength: 300
    },
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 300
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 300
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 300
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [ true, 'Email address is required' ],
        validate: [ validateEmail, 'Please fill a valid email address' ],
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address' ]
    },
    profilePicture: {
        type: String,
        get: (imgName) => `${imgPath}/${imgName}`
    },
    // user_id: userID,
    courses_enrolled: {
        type: [String],
        required: true,
        minLength: 4,
        maxLength: 300,
        default:[]
        // type:[ courseID ],
    },
    courses_created:{
        type: [String],
        required: true,
        minLength: 4,
        maxLength: 300,
        default:[]
    }
});

export default mongoose.model("user", userSchema);