import React from "react";

export default function OwnerDashboard() {
  return (
    <div className='flex justify-start ml-72 w-auto p-16'>
      <div className='w-1/2 flex items-center border-b border-neutrals-500 p-3 shadow-md hover:border-green-700 transition-all duration-200'>
        <i className='material-icons'>search</i>
        <input
          className='p-3 w-full outline-none'
          placeholder='Search Here'
        ></input>
      </div>
      <div>
      <div></div>
      </div>
    </div>
  );
}
