import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Navigate } from 'react-router';
import { ClipLoader } from "react-spinners";

const UpdateName = () => {
    const [assistantName, setAssistantName] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { updateAssistant, isUpdatingProfile } = useAuthStore();
    const { state } = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (state?.assistantImage?.startsWith("data:image")) {
                const blob = await fetch(state.assistantImage).then((r) => r.blob());
                formData.append("file", blob, "assistant.png");
            } else {
                formData.append("imageUrl", state?.assistantImage);
            }
            formData.append("assistantName", assistantName);

            const res = await updateAssistant(formData);
            if (res) {
                setRedirect(true)
            }
        } catch (error) {
            setRedirect(false);
            console.error(error);
        }
    };

    if (redirect) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] px-4 py-8">
            <div className="backdrop-blur-lg bg-[#232526]/80 border border-[#2c5364]/50 shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-md transition-all duration-300 flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
                    Name your <span className="text-blue-400">Assistant</span>
                </h1>
                <div className="mb-8 flex justify-center">
                    <img
                        src={state?.assistantImage}
                        alt="Assistant"
                        className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg object-cover"
                    />
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center w-full"
                >
                    <input
                        type="text"
                        value={assistantName}
                        onChange={(e) => setAssistantName(e.target.value)}
                        placeholder="Enter your assistant's name"
                        className="w-full px-5 py-3 bg-[#1a1a2e]/80 text-gray-200 placeholder-gray-400 border border-[#393e46] rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 mb-6"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800
                                   text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                        {isUpdatingProfile ? (<ClipLoader color="white" size={24} />) : ('Save')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateName;
