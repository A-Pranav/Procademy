import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { check, validationResult } from "express-validator";
import userModel from "../database/users/userModel.js"
// import userIDModel from "../database/users/userIDModel.js"
import authenticate from "../middlewares/authenticate.js";
// import { check } from "express-validator";


dotenv.config();
const router = express.Router();



router.post("/register", async (req, res) => {
    // let { _firstName, _lastName, _userName, _email, _password, _profilePicture } = req.body;
    try {
        let _firstName=req.body.firstName;
        let _lastName=req.body.lastName;
        let _userName=req.body.userName;
        let _password=req.body.password;
        let _email=req.body.email;
        let _profilePicture=req.body.profilePicture;
        // _profilePicture = "";
        // console.log();
        // console.log(req.body);
        // console.log(req.body);
        console.log(req.body);
        let checkuser = await userModel.findOne({ email:_email });
        console.log(checkuser);
        if (checkuser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        let salt = await bcrypt.genSalt(10);
        console.log("req.body.password", req.body.password);
        let n_password = await bcrypt.hash(_password, salt);
        let str_id = Date.now().toString();
        let new_id = str_id.substr(-8);
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [ { msg: 'Invalid Credentials' } ] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [ { msg: 'Invalid Credentials' } ] });
        }
        const payload = {
            user: {
                id: user.user_id,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            // config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { httpOnly: true }).sendStatus(200);
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/logout', authenticate, (req, res) => {
    try {
        res.clearCookie('token').sendStatus(200);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


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

export default router;