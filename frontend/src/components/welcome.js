import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../contexts/userContext';
export default function Welcome() {
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!userData.user)
            navigate("/login");
    }, []);
    return (
        <div>
            {userData.user ? (
                <h1>Welcome {userData.user.displayName}</h1>
            ) : (
                <>
                    <h1>Not Logged in</h1>
                </>
            )}
        </div>
    );
}
