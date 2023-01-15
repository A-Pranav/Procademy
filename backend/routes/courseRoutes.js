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

router.get("/allCourses", async (req, res) => {
    try {
        const data = await courseModel.find({});
        // total_get_requests++;
        console.log("get all data ", data);
        res.json(data);
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: error.message });
    }
})


router.get("/getCourse/:customId", async (req, res) => {
    let request_Id = req.params.customId;
    // total_specific_get_requests++;
    // console.log("get specific data called", total_specific_get_requests, "times");
    try {
        console.log("in try", request_Id);
        const course_data = await courseModel.findOne({ link: request_Id });
        console.log("course_data", course_data);
        // console.log("after getting", user_data);
        if (course_data == null) {
            return res.status(404).json({ message: "cant find course" });
        }
        else {
            res.status(200).json(course_data);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});




router.post("/create", async (req, res) => {
    try {
        console.log("req.body= ", req.body);
        let _courseTitle = req.body.title;
        let _courseSummary = req.body.summary;
        let _creator_id = req.body.creatorid;
        let _creator_name = req.body.creatorName;
        let _categories = req.body.categories;
        let _level = req.body.level;
        let _link = _courseTitle.split(" ").join("-").toLowerCase();
        let courseId = Date.now().toString();
        let _courseid = courseId.substring(-9);
        _link += _courseid
        let course = new courseModel({
            course_id: _courseid,
            creatorName: _creator_name,
            creator: _creator_id,
            title: _courseTitle,
            summary: _courseSummary,
            category: _categories,
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
            { user_id: _creator_id },
            {
                $addToSet: {
                    courses_created: {
                        $each: [ _courseid ], $ne: _courseid
                    }
                    // _courseId}
                }
            });
        res.json({ course });
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});



router.put("/updateCourse/:customId", async (req, res) => {
    let request_Id = req.params.customId;
    console.log("\n\n\n\n\n\n\n\n\n\n\n\nreq.body",req.body);
    // total_specific_get_requests++;
    // console.log("get specific data called", total_specific_get_requests, "times");
    try {
        console.log("in try", request_Id);
        const course_data = await courseModel.findOne({ link: request_Id });
        if (course_data == null) {
            return res.status(404).json({ message: "cant find course" });
        }
        else {
            course_data.summary = req.body.summary;
            course_data.level = req.body.level;
            course_data.category = req.body.category;
            await course_data.save();
            console.log("updated");
            console.log("new course_data",course_data);

            res.status(200).json({ msg: "update successful", _course_data: course_data });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

router.post("/checkEnrolled", async (req, res) => {
    try {
        // console.log("req.body= ", req.body);
        let _courseId = req.body.courseId;
        let _userid = req.body.userId;
        console.log("req._courseId= ", _courseId);
        console.log("req._userid= ", _userid);
        const user = await userModel.findOne({ user_id: _userid });
        if (user) {
            console.log(typeof ("typeofuser.courses_enrolled", user.courses_enrolled));
            console.log("user.courses_enrolled", user.courses_enrolled);
            if (user.courses_enrolled.indexOf(_courseId) != -1) {
                console.log("alreagy exists");
                return res.json({ already_enrolled: true })
            } else {
                console.log("new one");
                return res.json({ already_enrolled: false })
            }
        }

    } catch (err) {
        console.log("err", err);
        res.status(500).send(err);
    }
})


router.post("/checkCreator", async (req, res) => {
    try {
        // console.log("req.body= ", req.body);
        let _courseLink = req.body.courseLink;
        let _userid = req.body.userId;
        // console.log("req._courseId= ", _courseLink);
        // console.log("req._userid= ", _userid);
        console.log("req.body           ", req.body);
        const course = await courseModel.findOne({ link: _courseLink });
        console.log("course           ", course);
        if (course) {
            // console.log(typeof ("typeofuser.courses_enrolled", user.courses_enrolled));
            console.log("course.creator", course.creator);
            if (course.creator == _userid) {
                console.log("is the creator");
                return res.json({ isCreator: true })
            } else {
                console.log("not he creator");
                return res.json({ isCreator: false })
            }
        }

    } catch (err) {
        console.log("err", err);
        res.status(500).send(err);
    }
})


router.post("/enrollCourse", async (req, res) => {
    try {
        // console.log("req.body= ", req.body);
        let _courseId = req.body.courseId;
        let _userid = req.body.userId;
        console.log("req._courseId= ", _courseId);
        console.log("req._userid= ", _userid);
        // await userModel.findOneAndUpdate(
        //     { user_id: _userid },
        //     {
        //         $addToSet: {
        //             courses_enrolled: {
        //                 $each: [ _courseId ], $ne: _courseId
        //             }
        //         }
        //     }, function (err, result) {
        //         if (err) {
        //             console.log("error in saving user",err);
        //         }
        //         console.log("added course to list", result);
        //     }
        // );
        const user = await userModel.findOne({ user_id: _userid });
        let checkcount = false;
        if (user) {
            console.log(typeof ("typeofuser.courses_enrolled", user.courses_enrolled));
            console.log("user.courses_enrolled", user.courses_enrolled);
            if (user.courses_enrolled.indexOf(_courseId) != -1) {
                console.log("alreagy exists");
            } else {
                console.log("new one");
                try {
                    userModel.updateOne(
                        { user_id: _userid },
                        {
                            $push: {
                                courses_enrolled: _courseId
                            }
                            // $addToSet: {
                            //     courses_enrolled: {
                            //         $each: [ _courseId ], $ne: _courseId
                            //     }
                            // }
                        }).exec(function (err, result) {
                            if (err) {
                                console.log("error in saving user", err);
                            }
                            console.log("added course to list", result);
                        });
                } catch (err) {
                    console.log("err nested try", err);
                }
            }
        }
        else {
            console.log("not fount");
        }
        if (!checkcount) {
            checkcount = true;
            try {
                await courseModel.findOne(
                    { course_id: _courseId },
                    (error, doc) => {
                        if (error) {
                            console.log(error);
                        } else {
                            doc.enrollments++;
                            doc.save(function (error, result) {
                                if (error) {
                                    console.log("error in saving coruse\n", error);
                                } else {
                                    console.log("result success\n", result);
                                    return res.json({ success: true, isEnrolled: true });
                                }
                            });
                        }
                        // function (err, result) {
                        // if (err) {
                        // console.log("error in saving coruse", err);
                        // }
                        // console.log("added 1 to enrollments", result);
                    }
                )
            } catch (err) {
                console.log("savi=ng course err", err);
            }
        }
    }
    catch (err) {
        console.log("err occured", err);
        res.status(500).send(err);
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