import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from "../contexts/userContext";

// return (
{/* <h3><Link to="/">Home</Link></h3>
            <h3><Link to="/allusers">SEE all users</Link></h3>
            <h3><Link to="/user">ADD USER</Link></h3> */}
function Navbar() {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const register = () => navigate("/register");
    const login = () => navigate("/login");
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token", "");
        navigate("/")
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" >
            <div className="container-fluid">
                <Link to="/"><a className="navbar-brand text-dark">Procademy</a></Link>
                {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button> */}
                <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                    {/* <ul className="navbar-nav  mb-2 mb-lg-0"> */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <Link to="/courses"><a className="nav-link active" aria-current="page">Courses</a></Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Categories</a>
                        </li>
                    </ul>
                    <form className="d-flex me-auto" role="search">
                        <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    {/* <Link to="/register"><button className="btn btn-outline-success" type="submit">Signup</button></Link> */}
                    {
                        userData.user ? (
                            // <Link to="/login">/* </Link> */
                            <button className="btn btn-outline-success" onClick={logout}>Logout</button>
                        ) : (
                            <>
                                <button className="btn btn-outline-success" onClick={register}>Signup</button>
                                <button className="btn btn-outline-success" onClick={login}>Login</button>
                            </>
                        )
                    }
                </div>
            </div>
        </nav >
    )
}

export default Navbar;