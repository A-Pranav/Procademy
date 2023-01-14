import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";

// import axios from 'axios'
// import { Link } from 'react-router-dom';
// import Navbar from './navbar';
export default function UserLogin() {
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const [ login, setLogin ] = useState({
        email: "",
        password: "",
        // isInstructor,
    });
    async function loginReq(loginDetails) {
        let res=await fetch("http://localhost:9669/user/login", {
            // const loginreq = await fetch("http://localhost:9669/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        });
        return res.json();
    }
    async function loginData(e) {
        e.preventDefault();
        const loginDetails = { ...login };
        console.log(loginDetails);
        // const loginResponse = await fetch("http://localhost:9669/user/login", {
        //     // const loginreq = await fetch("http://localhost:9669/user/login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify(loginDetails)
        // }).then(resp => resp.json()).then(data => { console.log(data); });
        // const loginResponse=loginreq.json();
        let loginResponse=await loginReq(loginDetails);
        console.log(loginResponse);
        // console.log(loginResponse.data);
        setUserData({
            token: loginResponse.token,
            user: loginResponse.user
        });
        localStorage.setItem("auth-token", loginResponse.token);
        navigate("/");

    };
    const fillData = (e) => {
        return setLogin((prev) => {
            setLogin({ ...prev, [ e.target.name ]: e.target.value });
        })
    };

    return (
        <>
            <div className="container">
                {/* <Navbar/> */}
                {/* <h3><Link to="/">Home</Link></h3>
                <h3><Link to="/allusers">SEE all users</Link></h3>
                <h3><Link to="/login">ADD USER</Link></h3> */}
                <h1>Login</h1>
                <form>
                    <div className="form-group">
                        <h3>Email</h3>
                        <input required className="" type="text" name="email" id="u_email" placeholder="Enter Email Here"
                            onChange={fillData}
                        />
                        <h3>Password</h3>
                        <input required className="" type="text" name="password" id="password" placeholder="Enter Password Here"
                            onChange={fillData}
                        />
                        <br />
                        <br />
                        <button className="btn btn-primary" onClick={loginData} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}