import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AssistantCard from "../components/AssistantCard";
import assistant1 from "../assets/image1.png";
import assistant2 from "../assets/image2.jpg";
import assistant3 from "../assets/image4.png";
import assistant4 from "../assets/image5.png";
import assistant5 from "../assets/image6.jpeg";
import assistant6 from "../assets/image7.jpeg";
import assistant7 from "../assets/authBg.png";

const assistantImages = [
  assistant1,
  assistant2,
  assistant3,
  assistant4,
  assistant5,
  assistant6,
  assistant7,
];

const AssistantSelect = () => {
  const [selected, setSelected] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        setIsCustom(true);
        setSelected(assistantImages.length); // Mark as custom
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    navigate("/update_name", {
      state: {
        assistantImage: isCustom ? customImage : assistantImages[selected],
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] px-4 py-8">
      <div className="backdrop-blur-lg bg-[#232526]/80 border border-[#2c5364]/50 shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-5xl transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg tracking-wide">
          Choose Your <span className="text-blue-400">Assistant</span>
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12 w-full">
          {assistantImages.map((img, idx) => (
            <AssistantCard
              key={idx}
              image={img}
              selected={selected === idx}
              onClick={() => {
                setSelected(idx);
                setIsCustom(false);
              }}
              className={`transition-all duration-200 ${
                selected === idx
                  ? "ring-4 ring-blue-400 scale-105 shadow-xl"
                  : "hover:ring-2 hover:ring-blue-300"
              }`}
            />
          ))}
          {/* Custom Upload Card */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-500 bg-[#1a1a2e]/80 cursor-pointer hover:border-blue-400 transition-all min-h-[96px] min-w-[96px]"
          >
            <span className="text-4xl text-gray-400 mb-2">+</span>
            <span className="text-xs text-gray-400">Upload</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Show selected image */}
        {(selected !== null || customImage) && (
          <div className="flex flex-col items-center mb-8">
            <span className="text-gray-200 mb-2 text-lg">Selected:</span>
            <img
              src={isCustom ? customImage : assistantImages[selected]}
              alt="Selected Assistant"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg object-cover"
            />
          </div>
        )}

        <button
          className={`w-full md:w-auto px-10 py-3 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-200 ${
            selected !== null || customImage
              ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 text-white shadow-lg"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={selected === null && !customImage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssistantSelect;
