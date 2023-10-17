import React from "react";

export default function RegisterSteps(props) {
  return (
    <div className='flex font-sans rounded-lg'>
      <div
        className={`step flex-1 transition-all duration-500 ${
          props.step1
            ? " text-main font-normal animate-step"
            : "bg-orange-500 text-BlackColor"
        } ${
          props.step1Completed ? "text-main bg-ButtonColor" : ""
        } rounded-l-lg py-1 px-1 text-center`}
      >
        Input Restaurant Information
      </div>
      <div
        className={`step flex-1 transition-all duration-500 ${
          props.step2
            ? "bg-main text-main animate-step"
            : "bg-orange-400 text-BlackColor"
        } py-1 px-1 text-center`}
      >
        Confirm My Registration
      </div>
    </div>
  );
}
