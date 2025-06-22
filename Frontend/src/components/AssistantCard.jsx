import React from "react";

const AssistantCard = ({ image, selected, onClick, isCustom }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl cursor-pointer transition-all duration-200 border-4
      ${selected ? "border-blue-400 scale-105 shadow-2xl" : "border-transparent hover:scale-105 hover:border-blue-300 shadow-lg"}
      bg-[#232526]/80 backdrop-blur-md p-1
    `}
    style={{ minHeight: "170px", minWidth: "120px" }}
  >
    <img
      src={image}
      alt={isCustom ? "Custom Assistant" : "Assistant"}
      className="rounded-xl w-full h-40 object-cover select-none"
      draggable={false}
    />
  </div>
);

export default AssistantCard;
