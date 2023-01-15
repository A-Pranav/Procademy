import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { check, validationResult } from "express-validator";
import courseModel from "../database/course/courseModel.js"
import userModel from "../database/users/userModel.js"
import videoModel from "../database/videos/videoModel.js";
import multer from "multer";
// import userIDModel from "../database/users/userIDModel.js"
// import authenticate from "../middlewares/authenticate.js";
// import { check } from "express-validator";


dotenv.config();
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// router.use((req, res, next) => {
//     console.log("testing ggggggg",req.body,"\n\n\n\n\n");
//     next();
//   });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // let _videoTitle = req.body.title;
        // let _link = _videoTitle.split(" ").join("-").toLowerCase();
        // _link +="-"+req.body.courseId+"-" + _videoid
        let videoName = Date.now().toString();
        let _video = videoName.substring(-10);
        cb(null, `${_video}.mp4`);
        req.body.videoName = _video;
        console.log("multerrrrr", "\n\n\n\n\n\n\n");
        // cb(null, `${title}-${course_id}`);
    }
});

const upload = multer({ storage });


router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        console.log("req.file", req.file);
        const name = req.body.title;
        const description = req.body.discription;
        if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }
        // console.log(name, description);
        // Do something with the file and the additional data
        // res.json({ file });
        console.log("req.body=               ", req.body);
        let _videoTitle = req.body.title;
        let _videoSummary = req.body.discription;
        let _creator_id = req.body.creatorid;
        let _creator_name = req.body.creatorName;
        let _course_id = req.body.courseId;
        let _link = _videoTitle.split(" ").join("-").toLowerCase();
        let _video_name = req.body.videoName;
        const course_data = await courseModel.findOne({ course_id: _course_id });
        _link += "-" + course_data.title + "-" + _video_name
        let video = new videoModel({
            video_id: _video_name,
            title: _videoTitle,
            creator_id: _creator_id,
            creator_name: _creator_name,
            video_name: _video_name,
            course_id: _course_id,
            discription: _videoSummary,
            video_link: _link,
            likes: 0,
            video_thumbnail: ""
        });
        console.log("new videoooooooooooooo", video);
        console.log("video user");
        await video.save();
        await courseModel.findOneAndUpdate(
            { course_id: _course_id },
            {
                $push: {
                    videos: _video_name
                }
            });
        // await userModel.findOneAndUpdate(
        //     { user_id: _userid },
        //     {
        //         $push: {
        //             videos_created: {
        //                 _videoid
        //             }
        //         }
        //     });
        res.status(200).json({ success: true, msg: "Added video" })
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});


router.post("/listCourseVideos", async (req, res) => {
    try {
        console.log("req.body= ", req.body);
        let _course_id = req.body.courseId;
        let course_videos = await videoModel.find({ course_id: _course_id }).sort({ video_id: 1 })
        console.log(typeof (course_videos));
        console.log("req_course", course_videos.length);
        res.json(course_videos);
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});

// router.post('/tokenCheck', async (req, res) => {
//     // const { email, password } = req.body;
//     // let _email = req.body.email;
//     // let _password = req.body.password;
//     try {
//         const token = req.header("x-auth-token");
//         if (!token) {
//             return res.json(false);
//         }
//         const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
//         if (!tokenVerify) {
//             return res.json(false);
//         }
//         return res.json(true);
//         // let user = await userModel.findOne({ email: _email });
//         // console.log(user);
//         // if (!user) {
//         //     return res
//         //         .status(400)
//         //         .json({ errors: [ { msg: 'Invalid jhjh Credentials' } ] });
//         // }
//         // const isMatch = await bcrypt.compare(_password, user.password);
//         // if (!isMatch) {
//         //     return res
//         //         .status(400)
//         //         .json({ errors: [ { msg: 'Invalid Csvdfvdvredentials' } ] });
//         // }
//         // const payload = {
//         //     user: {
//         //         id: user.user_id,
//         //     },
//         // };
//         // console.log("inlogin");
//         // jwt.sign(
//         //     payload,
//         //     process.env.JWT_SECRET,
//         //     // config.get('jwtSecret'),
//         //     { expiresIn: 360000 },
//         //     (err, token) => {
//         //         if (err) {
//         //             throw err;
//         //         }
//         //         console.log("token", token);
//         //         console.log("token added");
//         //     }
//         // );
//         // res.json({token , user:{U_id:user_id}});
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// router.post('/login', async (req, res) => {
//     // const { email, password } = req.body;
//     let _email = req.body.email;
//     let _password = req.body.password;
//     try {
//         let user = await userModel.findOne({ email: _email });
//         console.log(user);
//         if (!user) {
//             return res
//                 .status(400)
//                 .json({ errors: [ { msg: 'Invalid jhjh Credentials' } ] });
//         }
//         const isMatch = await bcrypt.compare(_password, user.password);
//         if (!isMatch) {
//             return res
//                 .status(400)
//                 .json({ errors: [ { msg: 'Invalid Csvdfvdvredentials' } ] });
//         }
//         const payload = {
//             id: user.user_id,
//         };
//         console.log("inlogin");
//         const _token = jwt.sign(
//             payload,
//             process.env.JWT_SECRET,
//             // config.get('jwtSecret'),
//             // { expiresIn: 360000 },
//             // (err, token) => {
//             //     if (err) {
//             //         throw err;
//             //     }
//             //     else {
//             //         console.log("token", token);
//             //         console.log("token added");
//             //     }
//             // }
//         );
//         // let resp = {
//         //     token: _token
//         // }
//         // res.json({
//         //     resp
//         // });

//         res.json({
//             user: {
//                 id: user.user_id, displayName: user.userName
//             }, token: _token
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });


// // router.post('/logout', authenticate, (req, res) => {
// //     try {
// //         res.clearCookie('token').sendStatus(200);
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });


// router.put('/edit', authenticate, async (req, res) => {
//     let { _firstName, _lastName, _userName, _password, _isInstructor, _email, _profilePicture } = req.body;
//     try {
//         let user = await userModel.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         // Check if email is already in use
//         if (_email !== user.email) {
//             let emailExists = await userModel.findOne({ _email });
//             if (emailExists) {
//                 return res.status(400).json({ msg: 'Email already in use' });
//             }
//         }

//         // Update user details
//         user = await userModel.findByIdAndUpdate(
//             req.user.id,
//             {
//                 $set: {
//                     firstName: _firstName,
//                     lastName: _lastName,
//                     userName: _userName,
//                     isInstructor: _isInstructor,
//                     email: _email,
//                     profilePicture: _profilePicture
//                 },
//             },
//             { new: true }
//         );
//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

export default router;