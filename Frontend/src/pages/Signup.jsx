import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Navigate } from 'react-router';
import { ClipLoader } from 'react-spinners';

const Signup = () => {
    const [redirect, setRedirect] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { signup, isSigningUp } = useAuthStore();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await signup(formData);
            if (res) {
                setRedirect(true);
            }
        } catch (error) {
            setRedirect(false);
        }
    };
    if (redirect) {
        return <Navigate to="/signin" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
            <form
                onSubmit={handleSubmit}
                className="backdrop-blur-lg bg-[#232526]/80 shadow-2xl border border-[#2c5364]/50 rounded-2xl p-10 w-full max-w-md
                           transition-all duration-300"
            >
                <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
                    Create Account
                </h1>
                {/* Name Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-[#1a1a2e]/80 text-gray-200 placeholder-gray-400 border border-[#393e46] rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                        required
                    />
                </div>
                {/* Email Input */}
                <div className="mb-6">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-[#1a1a2e]/80 text-gray-200 placeholder-gray-400 border border-[#393e46] rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                        required
                    />
                </div>
                {/* Password Input */}
                <div className="mb-8">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-[#1a1a2e]/80 text-gray-200 placeholder-gray-400 border border-[#393e46] rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                        required
                    />
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800
                               text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                    {isSigningUp ? (<ClipLoader color="white" size={24} />) : ("Sign Up")}
                </button>
                <div className="mt-6 text-center">
                    <span className="text-gray-400">Already have an account?</span>
                    <a href="/signin" className="ml-2 text-blue-400 hover:text-purple-400 font-semibold transition-colors duration-200">
                        Sign In
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Signup;
