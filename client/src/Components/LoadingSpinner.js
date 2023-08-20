import React from "react";

const LoadingSpinner = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-ButtonColor border-opacity-75 mb-2'></div>
      <p className='text-main'>Please wait...</p>
    </div>
  );
};

export default LoadingSpinner;
