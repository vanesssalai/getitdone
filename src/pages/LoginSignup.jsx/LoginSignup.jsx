import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginIdentifier, setLoginIdentifier] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            const { identifier, password } = JSON.parse(rememberedUser);
            setLoginIdentifier(identifier);
            setPassword(password);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isLogin && (username.trim() === "" || email.trim() === "" || password.trim() === "")) {
            alert("All fields are required.");
            return;
        }
    
        if (isLogin && (loginIdentifier.trim() === "" || password.trim() === "")) {
            alert("All fields are required.");
            return;
        }
    
        try {
            const endpoint = isLogin ? 'http://localhost:3000/login' : 'http://localhost:3000/signup';
            let data;
            if (isLogin) {
                data = { identifier: loginIdentifier, password };
            } else {
                data = { email, username, password };
            }
            const response = await axios.post(endpoint, data);
            console.log(response.data);
    
            if (isLogin && rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    identifier: loginIdentifier,
                    password
                }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
    
            const userID = response.data.user.id;
            navigate(`/tasks/${userID}`);

        } catch (e) {
            console.error('Error: ', e.message);
        }
    };

    return (
        <>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                )}
                {isLogin ? (
                    <input 
                        type="text"
                        placeholder="Email or Username"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        required
                    />
                ) : (
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input type="submit" value={isLogin ? 'Login' : 'Sign Up'} />  
                {isLogin && (
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                )}
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
        </>
    )
}