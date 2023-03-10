import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";

// import axios from 'axios'
// import { Link } from 'react-router-dom';
// import Navbar from './navbar';
export default function AddUser() {
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();


    const [ user, setUser ] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        profilePicture: ""
        // isInstructor,
    });
    async function userAdd(e) {
        e.preventDefault();
        const newUser = { ...user };
        const loginDetails = { ...user.email,...user.password  };
        console.log(newUser);
        await fetch("http://localhost:9669/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(resp => { console.log("resp=", resp); }).then(alert("user added"));

        const loginreq =await fetch("http://localhost:9669/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        })
        const loginResponse=await loginreq.json();
        // .then(resp => { console.log("resp=", resp); }).then(resp=> {return resp});
        setUserData({
            token: loginResponse.data.token,
            user: loginResponse.data.user
        });
        localStorage.setItem("auth-token", loginResponse.data.token);
        navigate("/");
    };
    const fillData = (e) => {
        return setUser((prev) => {
            setUser({ ...prev, [ e.target.name ]: e.target.value });
        })
    };

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
                        <h3>First Name</h3>
                        <input required className="" type="text" name="firstName" id="f_name" placeholder="Enter First Name Here"
                            onChange={fillData}
                        />
                        <h3>Last Name</h3>
                        <input required className="" type="text" name="lastName" id="l_name" placeholder="Enter Last Name Here"
                            onChange={fillData}
                        />
                        <h3>User Name</h3>
                        <input required className="" type="text" name="userName" id="user_name" placeholder="Enter User Name Here"
                            onChange={fillData}
                        />
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
                        <button className="btn btn-primary" onClick={userAdd} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}