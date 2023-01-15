import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
// import Navbar from './navbar';
import UserContext from "../contexts/userContext";
import ViewVideo from './viewVideo';
export default function LearnCourse() {
    const { userData } = useContext(UserContext);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ loadingVideo, setLoadingVideo ] = useState(true);
    const [ videoLink, setVideoLink ] = useState("");
    const [ alreadyEnrolled, setalreadyEnrolled ] = useState(true);
    const navigate = useNavigate();
    const [ videos, setVideos ] = useState([]);
    const [ course, setCourse ] = useState({
        title: "",
        course_id: "",
        summary: "",
        creator: "",
        level: "",
        category: "",
        enrollments: "",
        duration: "",
        rating: ""
    });
    const { link } = useParams();
    console.log("customId", link);
    useEffect(() => {
        setIsLoading(true);

        const fetcher = async () => {
            let response = await fetch(`http://localhost:9669/course/getCourse/${link}`, {
                method: "GET"
            });
            if (response.status == 200) {
                let data = await response.json();
                setCourse(data);
                course.title = data.title;
                course.summary = data.summary;
                course.course_id = data.course_id;
                course.creator = data.creatorName;
                course.level = data.level;
                course.category = data.category;
                course.enrollments = data.enrollments;
                course.duration = data.duration;
                course.rating = data.rating;
                console.log("data", data);
                console.log("course", course);
                setIsLoading(false);
                checkEnrolled();
            }
            // if (response.status == 404) {
            // setFound(0);
            // }
        };
        const checkEnrolled = async () => {

            if (!userData.user) {
                navigate("/login");
            }
            let enroller = {
                courseId: course.course_id,
                userId: userData.user.id
            }
            let response = await fetch(`http://localhost:9669/course/checkEnrolled`, {
                method: "POST",
                // mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(enroller)
            })
            let data = await response.json();
            console.log("checkcheckcheckcheck", data);
            if (response.status == 200) {
                if (data.already_enrolled == true) {
                    console.log("truuuuuueeeeeeeee");
                    setalreadyEnrolled(true);
                    // setLoadingVideo(false);
                    GetAllVideos();
                }
                else if (data.already_enrolled == false) {
                    setalreadyEnrolled(false);
                }
            }
        };
        fetcher();
    }, []);
    const changeVideo=(e)=>{
        setVideoLink(e.target.id);
        console.log(videoLink);
        console.log(e.target.id);
    }
    const GetAllVideos = async () => {
        setLoadingVideo(true);
        let details = {
            courseId: course.course_id
        };
        let response = await fetch(`http://localhost:9669/video/listCourseVideos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(details)
        });

        if (response.status == 200) {
            let data = await response.json();
            setVideos(data);
            setVideoLink(data[0].video_link);
            console.log("\n\n\n\n\n\n\n\ndata[0].video_link ",data[0].video_link);
            console.log("\n\n\n\n\n\n\n\nvideoLink",videoLink);
            console.log("videos", videos);
            setLoadingVideo(false);
        }
    }
    if (isLoading) { return <div>Loading...</div>; }

    return (
        <>
            <div>LearnCourse</div>
            <h1 className="bg-light text-dark">{course.title}</h1>
            {(loadingVideo == false) ?
                <>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <ViewVideo vid={videoLink} videoLink={`http://localhost:9669/video/${videoLink}`}></ViewVideo>
                </>
                :

                <>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <h2>no video</h2>
                </>
            }
            <br />
            <br />
            <div>all videos</div>
            <table className="table table-light">
                <thead>
                    <tr align="center">
                        <th>Title</th>
                        <th>discription</th>
                        <th>Creator Name</th>
                        <th>Likes</th>
                        <th>video link</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        videos.map((video) => {
                            //console.log("<td>{course.custom_id}</td>", course.custom_id);
                            return <tr>
                                <td>{video.title}</td>
                                <td>{video.discription}</td>
                                <td>{video.creator_name}</td>
                                <td>{video.likes}</td>
                                <td><button className=' text-dark btn btn-primary' id={video.video_link} onClick={changeVideo}>PLAY</button></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
    )
}