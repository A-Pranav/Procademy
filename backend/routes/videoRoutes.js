import express from "express";
import dotenv from "dotenv";
import courseModel from "../database/course/courseModel.js"
import userModel from "../database/users/userModel.js"
import videoModel from "../database/videos/videoModel.js";
import multer from "multer";

dotenv.config();
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


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

export default router;