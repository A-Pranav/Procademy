import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from "../contexts/userContext";

export default function AddVideo(props) {
    // const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const [ video, setVideo ] = useState({
        title: "",
        discription: ""
        // isInstructor,
    });
    const [ file, setFile ] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[ 0 ]);
    }
    // const handleUpload = async (e) => {
    //     e.preventDefault();
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('video', file);
    // formData.append('name', 'videoName');
    // formData.append('description', 'videoDescription');
    // // console.log(formData);
    // fetch('http://localhost:9669/video/upload', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     body: formData
    // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(error => {
        //     console.log(error);
        // });

    async function createVideo(e) {
        // e.preventDefault();
        // const newVideo = { ...video, creatorid: userData.user.id, creatorName: userData.user.displayName, courseId: props.courseId};
        // const loginDetails = { ...user.email, ...user.password };
        const formData = new FormData();
        video.title=video.title.split(" ").join("-").toLowerCase()
        formData.append('file', file);
        formData.append('creatorid', userData.user.id);
        formData.append('title', video.title);
        formData.append('discription', video.discription);
        formData.append('creatorName', userData.user.displayName);
        formData.append('courseId', props.courseId);
        console.log("newVideo\n", formData, "\n\n\n\n\n");
        await fetch("http://localhost:9669/video/upload", {
            method: "POST",
            // headers: {
            //     Accept: 'application/json',
            //     'Content-Type': 'multipart/form-data',
            //     "boundary":"MyBoundary"

            //     // 'Accept': 'application/json'
            // },
            body: formData
        }).then(response => response.json())
        .then((data,response) => {
            console.log(response);
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });

        // const loginreq = await fetch("http://localhost:9669/user/login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify(loginDetails)
        // })
        // const loginResponse = await loginreq.json();
        // .then(resp => { console.log("resp=", resp); }).then(resp=> {return resp});
        // setUserData({
        //     token: loginResponse.data.token,
        //     user: loginResponse.data.user
        // });
        // localStorage.setItem("auth-token", loginResponse.data.token);
    };
    const fillData = (e) => {
        return setVideo((prev) => {
            setVideo({ ...prev, [ e.target.name ]: e.target.value });
        })
    };
    useEffect(() => {
        /*
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            // const tokenresp = fetch("http://localhost:9669/user/tokenCheck", {
            //   method: "POST",
            //   headers: {
            //     "x-auth-token": token
            //   },
            // }).then(resp => { console.log("resp=", resp); }).then(resp => { return resp.json() });
            const tokenreq = await fetch("http://localhost:9669/user/tokenCheck", {
                method: "POST",
                headers: {
                    "x-auth-token": token
                },
            })
            const tokenresp = await tokenreq.json();
            // const tokenResponse = await axios.post('http://localhost:5000/users/tokenIsValid', null, { headers: { "x-auth-token": token } });
            if (tokenresp.data) {
                // const userRes = await axios.get("http://localhost:9669/users/check", {
                //   headers: { "x-auth-token": token },
                // });
                const userReq = fetch("http://localhost:9669/user/check", {
                    method: "GET",
                    headers: {
                        "x-auth-token": token
                    },
                })
                const userRes = await userReq.json();
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        }
        checkLoggedIn();
        */

    }, []);
    return (
        <>
            <div className="container">
                {/* <Navbar/> */}
                {/* <h3><Link to="/">Home</Link></h3>
                    <h3><Link to="/allusers">SEE all users</Link></h3>
                    <h3><Link to="/user">ADD USER</Link></h3> */}
                <h1>Enter New User Data</h1>
                <form>
                    <div className="form-group">
                        <h3>Video title</h3>
                        <input required className="" type="text" name="title" id="CoursTitle" placeholder="Enter First Name Here"
                            onChange={fillData}
                        />
                        <h3>Video Summary</h3>
                        <input required className="" type="text" name="discription" id="CoursSummary" placeholder="Enter Last Name Here"
                            onChange={fillData}
                        />
                        <input type="file" accept="video/*" onChange={handleFileChange} />
                        {/* <button className='btn btn-success' onClick={handleUpload}>Upload</button> */}
                        <br />
                        <br />
                        <button className="btn btn-primary" onClick={createVideo} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}
/*
function FileUpload(props) {
    const [ file, setFile ] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[ 0 ]);
    }

    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        axios.post(props.uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <form>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </form>
    )
}
*/