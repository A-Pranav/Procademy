import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AllCourse() {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ courses, setCourses ] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        console.log(" courses");
        async function fetcher() {
            await fetch("http://localhost:9669/course/allCourses", {
                method: "GET"
            }).then(res => res.json())
                .then(data => {
                    setCourses(data);
                    console.log("data", data)
                    console.log("typeof (data)", typeof (data));
                    console.log(" courses", courses);
                    setIsLoading(false);
                    return data;
                });
        };
        const request_response = fetcher();
        console.log("request_response", request_response);
    }, []);
    if (isLoading) { return <div>Loading...</div>; }

    return (
        <>
            <div>AllCourse</div>
            <table className="table table-light">
                <thead>
                    <tr align="center">
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Creator</th>
                        <th>Level</th>
                        <th>Category</th>
                        <th>enrollments</th>
                        <th>duration</th>
                        <th>rating</th>
                    </tr>
                </thead>
                <tbody>
                    {
                            courses.map((course) => {
                                console.log("<td>{course.custom_id}</td>", course.custom_id);
                                return <tr>
                                    <th style={{ cursor: "pointer" }} ><Link to={"/course/" +course.link}><a>{course.title}</a></Link></th>
                                    <td>{course.summary}</td>
                                    <td>{course.creatorName}</td>
                                    <td>{course.level}</td>
                                    <td>{course.categories}</td>
                                    <td>{course.enrollments}</td>
                                    <td>{course.duration}</td>
                                    <td>{course.rating}</td>
                                </tr>
                            })
                    }
                </tbody>
            </table>
        </>


    )
}