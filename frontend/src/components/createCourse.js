import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from "../contexts/userContext";

export default function CreateCourse() {
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const [ course, setCourse ] = useState({
        title: "",
        summary: "",
        categories: "",
        level: ""
        // isInstructor,
    });
    async function createCourse(e) {
        e.preventDefault();

        const newCourse = { ...course, creatorid: userData.user.id,creatorName:userData.user.displayName };
        // const loginDetails = { ...user.email, ...user.password };
        console.log("userData", userData);
        console.log("newCourse", newCourse);
        await fetch("http://localhost:9669/course/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(newCourse)
        }).then(resp => { console.log("resp=", resp); }).then(alert("user added"));

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
        return setCourse((prev) => {
            setCourse({ ...prev, [ e.target.name ]: e.target.value });
        })
    };
    useEffect(() => {
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
                        <h3>Course title</h3>
                        <input required className="" type="text" name="title" id="CoursTitle" placeholder="Enter First Name Here"
                            onChange={fillData}
                        />
                        <h3>Course Summary</h3>
                        <input required className="" type="text" name="summary" id="CoursSummary" placeholder="Enter Last Name Here"
                            onChange={fillData}
                        />
                        <h3>Categories</h3>
                        <input required className="" type="text" name="categories" id="categories" placeholder="Enter User Name Here"
                            onChange={fillData}
                        />
                        <h3>Level</h3>
                        <input required className="" type="text" name="level" id="level" placeholder="Enter Email Here"
                            onChange={fillData}
                        />
                        <br />
                        <br />
                        <button className="btn btn-primary" onClick={createCourse} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}