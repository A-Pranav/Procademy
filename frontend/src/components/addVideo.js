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
    });
    const [ file, setFile ] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[ 0 ]);
    }
    async function createVideo(e) {
        e.preventDefault();
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
            body: formData
        }).then(response => response.json())
        .then((data,response) => {
            console.log(response);
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
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
                        <br />
                        <br />
                        <button className="btn btn-primary" onClick={createVideo} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}