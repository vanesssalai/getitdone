import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

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
            const endpoint = isLogin ? 'http://localhost:3000/api/loginsignup/login' : 'http://localhost:3000/api/loginsignup/signup';
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
    
            if (isLogin) {
                const userID = response.data.user.id;
                toast.success('Logged In Successfully.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate(`/Projects/${userID}`);
            } else {
                toast.success('User Created Successfully. Please login.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setEmail('');
                setUsername('');
                setPassword('');
                setIsLogin(true);
            }
        } catch (e) {
            console.error('Error: ', e.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="flex flex-col items-center p-6 bg-white rounded w-full max-w-sm">
                <h1 className="mb-4 text-2xl font-semibold">{isLogin ? 'Login' : 'Sign Up'}</h1>
                <form 
                    className="flex flex-col space-y-4 w-full"
                    onSubmit={handleSubmit}
                >
                    {!isLogin && (
                        <input 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="p-2 border rounded"
                        />
                    )}
                    {isLogin ? (
                        <input 
                            type="text"
                            placeholder="Email or Username"
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            required
                            className="p-2 border rounded"
                        />
                    ) : (
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="p-2 border rounded"
                        />
                    )}
                    <div className="relative">
                        <input 
                            type={passwordVisible ? "text" : "password"} 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="p-2 border rounded w-full"
                        />
                        <button 
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <input 
                        type="submit" 
                        value={isLogin ? 'Login' : 'Sign Up'}
                        className="p-2 border rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                    />
                    {isLogin && (
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="form-checkbox"
                            />
                            <span>Remember me</span>
                        </label>
                    )}
                </form>
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 "
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    )
}