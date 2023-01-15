import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { check, validationResult } from "express-validator";
import courseModel from "../database/course/courseModel.js"
import userModel from "../database/users/userModel.js"
// import userIDModel from "../database/users/userIDModel.js"
// import authenticate from "../middlewares/authenticate.js";
// import { check } from "express-validator";


dotenv.config();
const router = express.Router();



router.post("/create", async (req, res) => {
    try {
        console.log("req.body= ", req.body);
        let _courseTitle = req.body.title;
        let _courseSummary = req.body.summary;
        let _creator_id = req.body.creator;
        let _categories = req.body.categories;
        let _level = req.body.level;
        let _link = _courseTitle.split(" ").join("-").toLowerCase();
        let courseId = Date.now().toString();
        let _courseid = courseId.substr(-9);
        _link += _courseid
        let course = new courseModel({
            course_id: _courseid,
            creator: _creator_id,
            title: _courseTitle,
            summary: _courseSummary,
            categories: _categories,
            link: _link,
            level: _level,
            lecture_count: 0,
            duration: "0",
            rating: "0",
            enrollments: 0
        });
        console.log("course user");
        await course.save();
        await userModel.findOneAndUpdate(
            { user_id: _userid },
            {
                $push: {
                    courses_created: {
                        _courseid
                    }
                }
            });
        res.json({ course });
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});


router.post("/registerCourse", async (req, res) => {
    try {
        console.log("req.body= ", req.body);
        let _courseId = req.body.courseId;
        let _userid = req.body.userId;
        await userModel.findOneAndUpdate(
            { user_id: _userid },
            {
                $push: {
                    courses_enrolled: {
                        _courseId
                    }
                }
            });
        await courseModel.findByIdAndUpdate(
            { course_id: _courseId },
            { $inc: { enrollments: 1 } }, { new: true }
        )
        // let _creator_id = req.body.creator;
        // let _categories = req.body.categories;
        // let _level = req.body.level;
        // let _link=_courseTitle.split(" ").join("-").toLowerCase();
        // let courseId = Date.now().toString();
        // let _courseid = courseId.substr(-9);
        // _link+=_courseid
        // let course = new courseModel({
        //     course_id: _courseid,
        //     creator: _creator_id,
        //     title: _courseTitle,
        //     summary: _courseSummary,
        //     categories: _categories,
        //     link: _link,
        //     level: _level,
        //     lecture_count:0,
        //     duration:"0",
        //     rating:"0",
        //     enrollments:0
        // });


        // console.log("course user");
        // await course.save();
        res.json({ success: true });
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});

// router.get("/check", authenticate, async (req, res) => {
//     const user = await userModel.findOne({ user_id: req.user });
//     res.json({
//         displayName: user.userName,
//         id: user.user_id
//     });
// });


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