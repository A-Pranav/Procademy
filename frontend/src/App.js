import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"


import UserContext from "./contexts/userContext";


import AddUser from "./components/adduser";
import UserLogin from "./components/userLogin";
import Navbar from "./components/navbar";
import Welcome from './components/welcome';
import Home from './components/home';
import CreateCourse from './components/createCourse';
import AllCourse from './components/allCourse';
import GetCourse from './components/getCourse';


// import GetAllUsers from "./component/getAllUsers";
// import EditUser from "./component/editUser";
import './App.css';


function App() {
	const [ userData, setUserData ] = useState({
		token: undefined,
		user: undefined
	});

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
			// const tokenreq = await fetch("http://localhost:9669/user/tokenCheck", {
			// 	method: "POST",
			// 	headers: {
			// 		"x-auth-token": token
			// 	},
			// })
			// const tokenresp = await tokenreq.json();
			// const tokenResponse = await axios.post('http://localhost:5000/users/tokenIsValid', null, { headers: { "x-auth-token": token } });
			// if (tokenresp.data) {
				// const userRes = await axios.get("http://localhost:9669/users/check", {
				//   headers: { "x-auth-token": token },
				// });
				// const userReq = fetch("http://localhost:9669/user/check", {
				// 	method: "GET",
				// 	headers: {
				// 		"x-auth-token": token
				// 	},
				// })
				// const userRes = await userReq.json();
				// setUserData({
				// 	token,
				// 	user: userRes.data,
				};
		checkLoggedIn();
	}, []);

	return (
		<BrowserRouter>
			<UserContext.Provider value={{ userData, setUserData }}>
				<Navbar />
				<Welcome />
				{/* {userData.user ? (<Welcome />) : (<></>) */}
				< Routes >
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<AddUser />} />
					<Route path="/login" element={<UserLogin />} />
					<Route path="/courses" element={<AllCourse />} />
					<Route path="/course/create" element={<CreateCourse />} />
					<Route path="/course/:link/" element={<GetCourse/>} />
					{/* <Route path="/allusers" element={<GetAllUsers />} /> */}
					{/* <Route path="/edituser/:customId" element={<EditUser />} /> */}
				</Routes>
			</UserContext.Provider>
		</BrowserRouter >
	);
}

export default App;
