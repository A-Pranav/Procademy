// import { mongo } from 'mongoose';
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
// import Navbar from './navbar';
import UserContext from "../contexts/userContext";


export default function GetCourse() {
    const { userData } = useContext(UserContext);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ alreadyEnrolled, setalreadyEnrolled ] = useState(true);
    const navigate = useNavigate();
    // const [ found, setFound ] = useState(0);
    // let [ request_data, setRequestData ] = useState([]);
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
            setIsLoading(true);
            if(!userData.user){
                navigate("/login");
            }
            let enroller = {
                courseId: course.course_id,
                userId: userData.user.id
            }
            // let response = await fetch(`http://localhost:9669/course/checkEnrolled/${link}`, {
            //     method: "GET"
            // });
            let response = await fetch(`http://localhost:9669/course/checkEnrolled`, {
                method: "POST",
                // mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(enroller)
            })
            // .then(resp => { console.log("this is resp=", resp) }).then(resp=>{return resp})
            let data = await response.json();
            console.log("checkcheckcheckcheck",data);
            if(response.status==200){
                if (data.already_enrolled == true) {
                    console.log("truuuuuueeeeeeeee");
                    setalreadyEnrolled(true);
                    setIsLoading(false);
                }
                else if (data.already_enrolled == false) {
                    setalreadyEnrolled(false);
                    setIsLoading(false);
                }
            }
            // setCourse(data);
            // if (response.status == 404) {
            // setFound(0);
            // }
            // setIsLoading(false);
        };
        fetcher();
        // console.log("editedcourse insideeee effect", editedcourse);
        // console.log("request_data inside effect", request_data);
    }, []);
    const enrollCourse = async (e) => {
        e.preventDefault();
        let enroller = {
            courseId: course.course_id,
            userId: userData.user.id
        }
        await fetch(`http://localhost:9669/course/enrollCourse`, {
            method: "POST",
            // mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(enroller)
        }).then(resp => { console.log("resp=", resp) })
    };
    // const deletecourse = async (e) => {
    //     e.preventDefault();
    //     await fetch(`http://localhost:9669/course/${link}`, {
    //         method: "DELETE",
    //         // mode: 'no-cors',
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Accept': 'application/json'
    //         }
    //     }).then(resp => {
    //         console.log("resp=", resp)
    //         if (resp.status == 200) {
    //         }
    //     })
    // };
    if (isLoading) { return <div>Loading...</div>; }
    return (
        <div className="container">
            {/* getCourse{console.log("course.name", course.name)} */}
            <div className="card" style={{ "width": "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    {/* <p className="card-text">ID: {course.}</p> */}
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Summary: {course.summary}</li>
                    <li className="list-group-item">Creator: {course.creator}</li>
                    <li className="list-group-item">level: {course.level}</li>
                    <li className="list-group-item">category: {course.category}</li>
                    <li className="list-group-item">enrollments: {course.enrollments}</li>
                    <li className="list-group-item">duration: {course.duration}</li>
                    <li className="list-group-item">rating: {course.rating}</li>
                </ul>
                <div className="card-body">
                    {
                        alreadyEnrolled ?
                        <Link to={"/course/learn/" +course.link}><a className="btn btn-success" style={{ cursor: "pointer", marginRight: "5px" }}>go to videos</a></Link>
                        :
                        <button onClick={enrollCourse} className="btn btn-success" style={{ cursor: "pointer", marginRight: "5px" }}>enrollCourse</button>
                    }
                </div>
                <hr />
            </div>
        </div>
    )
}