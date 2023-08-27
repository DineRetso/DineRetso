import React from "react";

export default function RegisterSteps(props) {
  return (
    <div className='flex'>
      <div
        className={`flex-1 ${
          props.step1
            ? "bg-DropDownColor text-white"
            : "bg-BackgroundGray text-gray-800"
        } rounded-l-lg py-1 px-1 text-center`}
      >
        Input Restaurant Information
      </div>
      <div
        className={`flex-1 ${
          props.step2
            ? "bg-DropDownColor text-white"
            : "bg-BackgroundGray text-gray-800"
        } py-1 px-1 text-center`}
      >
        Confirm My Registration
      </div>
    </div>
  );
}
