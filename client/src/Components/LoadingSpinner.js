import React from "react";

const LoadingSpinner = ({ type }) => {
  const renderSpinner = () => {
    if (type === "resetPass") {
      return (
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-ButtonColor border-opacity-75 mb-2'></div>
      );
    } else if (type === "OTP") {
      return (
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-ButtonColor border-opacity-75 mb-2'></div>
      );
    } else if (type === "uploading") {
      return (
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-ButtonColor border-opacity-75 mb-2'></div>
      );
    }
    // Add more cases for different spinner types if needed
  };

  const renderText = () => {
    if (type === "resetPass") {
      return "Sending reset password link to your email...";
    } else if (type === "OTP") {
      return "Sending OTP number in your email...";
    } else if (type === "uploading") {
      return "Processing Image...";
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      {renderSpinner()}
      <p className='text-main'>{renderText()}</p>
    </div>
  );
};

export default LoadingSpinner;
