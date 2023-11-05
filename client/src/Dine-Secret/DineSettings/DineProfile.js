import React from "react";

export default function DineProfile({ dineData }) {
  return (
    <div className='flex flex-col w-full'>
      <div className='w-full text-neutrals-500 sm:p-2'>
        <label>Email:</label>
        <input
          type='email'
          value={dineData.email}
          className='w-full p-1 outline-none border-b border-orange-500'
        />
      </div>
      <div className='w-full text-neutrals-500 sm:p-2 flex lg:flex-row md:flex-row flex-col'>
        <div className='w-full'>
          <label>Username:</label>
          <input
            type='email'
            value={dineData.username}
            className='w-full p-1 outline-none border-b border-orange-500'
          />
        </div>
        <div className='w-full'>
          <label>Username:</label>
          <input
            type='email'
            value={dineData.username}
            className='w-full p-1 outline-none border-b border-orange-500'
          />
        </div>
      </div>
    </div>
  );
}
