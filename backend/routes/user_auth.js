import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { check, validationResult } from "express-validator";
import userModel from "../database/users/userModel.js"
// import userIDModel from "../database/users/userIDModel.js"
import authenticate from "../middlewares/authenticate.js";
import courseModel from "../database/course/courseModel.js";
// import { check } from "express-validator";


dotenv.config();
const router = express.Router();



router.post("/register", async (req, res) => {
    // let { _firstName, _lastName, _userName, _email, _password, _profilePicture } = req.body;
    try {
        let _firstName = req.body.firstName;
        let _lastName = req.body.lastName;
        let _userName = req.body.userName;
        let _password = req.body.password;
        let _email = req.body.email;
        let _profilePicture = req.body.profilePicture;
        // _profilePicture = "";
        // console.log();
        // console.log(req.body);
        // console.log(req.body);
        console.log(req.body);
        let checkuser = await userModel.findOne({ email: _email });
        console.log(checkuser);
        if (checkuser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        let salt = await bcrypt.genSalt(10);
        console.log("req.body.password", req.body.password);
        let n_password = await bcrypt.hash(_password, salt);
        console.log();
        let str_id = Date.now().toString();
        let new_id = str_id.substring(-8);
        // uid = new userIDModel(new_id);
        let user = new userModel({
            user_id: new_id,
            firstName: _firstName,
            lastName: _lastName,
            userName: _userName,
            password: n_password,
            isInstructor: false,
            email: _email,
            profilePicture: _profilePicture
        });
        console.log("added user");
        await user.save();
        res.json({ user });
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});

router.get("/check", authenticate, async (req, res) => {
    const user = await userModel.findOne({ user_id: req.user });
    res.json({
        displayName: user.userName,
        id: user.user_id
    });
});


router.post('/tokenCheck', async (req, res) => {
    // const { email, password } = req.body;
    // let _email = req.body.email;
    // let _password = req.body.password;
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }
        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenVerify) {
            return res.json(false);
        }
        return res.json(true);
        // let user = await userModel.findOne({ email: _email });
        // console.log(user);
        // if (!user) {
        //     return res
        //         .status(400)
        //         .json({ errors: [ { msg: 'Invalid jhjh Credentials' } ] });
        // }
        // const isMatch = await bcrypt.compare(_password, user.password);
        // if (!isMatch) {
        //     return res
        //         .status(400)
        //         .json({ errors: [ { msg: 'Invalid Csvdfvdvredentials' } ] });
        // }
        // const payload = {
        //     user: {
        //         id: user.user_id,
        //     },
        // };
        // console.log("inlogin");
        // jwt.sign(
        //     payload,
        //     process.env.JWT_SECRET,
        //     // config.get('jwtSecret'),
        //     { expiresIn: 360000 },
        //     (err, token) => {
        //         if (err) {
        //             throw err;
        //         }
        //         console.log("token", token);
        //         console.log("token added");
        //     }
        // );
        // res.json({token , user:{U_id:user_id}});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    // const { email, password } = req.body;
    let _email = req.body.email;
    let _password = req.body.password;
    try {
        let user = await userModel.findOne({ email: _email });
        console.log(user);
        if (!user) {
            return res
                .status(400)
                .json({ errors: [ { msg: 'Invalid jhjh Credentials' } ] });
        }
        const isMatch = await bcrypt.compare(_password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [ { msg: 'Invalid Csvdfvdvredentials' } ] });
        }
        const payload = {
            id: user.user_id,
        };
        console.log("inlogin");
        const _token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            // config.get('jwtSecret'),
            // { expiresIn: 360000 },
            // (err, token) => {
            //     if (err) {
            //         throw err;
            //     }
            //     else {
            //         console.log("token", token);
            //         console.log("token added");
            //     }
            // }
        );
        // let resp = {
        //     token: _token
        // }
        // res.json({
        //     resp
        // });

        res.json({
            user: {
                id: user.user_id, displayName: user.userName
            }, token: _token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// router.post('/logout', authenticate, (req, res) => {
//     try {
//         res.clearCookie('token').sendStatus(200);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });


router.put('/edit', authenticate, async (req, res) => {
    let { _firstName, _lastName, _userName, _password, _isInstructor, _email, _profilePicture } = req.body;
    try {
        let user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if email is already in use
        if (_email !== user.email) {
            let emailExists = await userModel.findOne({ _email });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
        }

        // Update user details
        user = await userModel.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    firstName: _firstName,
                    lastName: _lastName,
                    userName: _userName,
                    isInstructor: _isInstructor,
                    email: _email,
                    profilePicture: _profilePicture
                },
            },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



router.post("/created", async (req, res) => {
    try {
        let _userid = req.body.userId;
        console.log("req._userid= ", _userid);
        const user = await userModel.findOne({ user_id: _userid });
        let course_ids = user.courses_created;
        console.log("user created course_ids", course_ids);
        const courses_data = await courseModel.find({ course_id: { $in: course_ids } });
        console.log("created courses_data",courses_data);
        res.status(200).send(courses_data)
    }
    catch (err) {
        console.log("error found", err);
        res.status(500).send(err);
    }
})
router.post("/enrolled", async (req, res) => {
    try {
        let _userid = req.body.userId;
        console.log("req._userid= ", _userid);
        const user = await userModel.findOne({ user_id: _userid });
        let course_ids = user.courses_enrolled;
        console.log("user created course_ids", course_ids);
        const courses_data = await courseModel.find({ course_id: { $in: course_ids } });
        console.log("enrolled courses_data",courses_data);
        res.status(200).send(courses_data)
    }
    catch (err) {
        console.log("error found", err);
        res.status(500).send(err);
    }
})

export default router;