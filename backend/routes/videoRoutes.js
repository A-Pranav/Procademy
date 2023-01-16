import express from "express";
import dotenv from "dotenv";
import courseModel from "../database/course/courseModel.js"
import videoModel from "../database/videos/videoModel.js";
import multer from "multer";
import AWS from "aws-sdk";
import path from "path";

dotenv.config();
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// AWS.config.update({
//     accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
//     secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY
// });
// const s3 = new AWS.S3();

// const uploadToS3 = (file) => {
//     const params = {
//         Bucket: 'YOUR_BUCKET_NAME',
//         Key: file.originalname,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read'
//     };

//     return s3.upload(params).promise();
// };


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        let videoName = Date.now().toString();
        let _video = videoName.substring(-10);
        cb(null, `${_video}.mp4`);
        req.body.videoName = _video;
        console.log("multerrrrr", "\n\n\n\n\n\n\n");
    }
});

const upload = multer({ storage });


router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        console.log("req.file", req.file);
        // const name = req.body.title;
        // const description = req.body.discription;
        if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }
        uploadToS3(file)
            .then(response => {
                response.json({ file });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ msg: 'Error uploading file to S3' });
            });

        console.log("req.body=               ", req.body);
        let _videoTitle = req.body.title;
        let _videoSummary = req.body.discription;
        let _creator_id = req.body.creatorid;
        let _creator_name = req.body.creatorName;
        let _course_id = req.body.courseId;
        let _link = req.file.path;
        let _video_name = req.body.videoName;
        // const course_data = await courseModel.findOne({ course_id: _course_id });
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

router.get('/uploads/:id', async (req, res) => {
    try {

        const videoId = req.params.id;
        console.log("videoId", videoId);
        // let video = await videoModel.find({ video_link: "uploads\\" + videoId }).then(result => {
        //     return result.video_name;
        // });
        // let video2 = await videoModel.find({ video_link: "uploads\\" + videoId })
        // console.log("video to send", video);
        // let _video_name = await video2.video_name
        res.sendFile(path.join(process.cwd(), 'uploads', videoId));
    } catch (error) {
        console.log(error);
    }
});



router.post("/listCourseVideos", async (req, res) => {
    try {
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\nreq.body= ", req.body);
        let _course_id = req.body.courseId;
        let course_videos = await videoModel.find({ course_id: _course_id }).sort({ video_id: 1 })
        console.log("req_course videos", course_videos.length);
        res.json(course_videos);
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send('error while saving');
    }
});

export default router;