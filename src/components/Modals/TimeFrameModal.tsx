import React from "react";

const TimeFrameModal = ({ error, data, handleChange, handleKeyDown }) => {
  return (
    <div
      className={`flex
        
       flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4 bg-[#1e222d] h-48 w-64 z-20
        rounded space-y-3
        `}
    >
      <p className="text-lg font-semibold">Change Interval</p>
      <input
        className={`bg-black ring-2 ${
          error ? "ring-red-500" : "ring-blue-500"
        }  text-center h-10 w-44 outline-none`}
        id="message"
        name="message"
        value={data}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoFocus
        maxLength={2}
      />
      {error && <p className="text-xs">Available numbers are 1,5,15</p>}
    </div>
  );
};

export default TimeFrameModal;
