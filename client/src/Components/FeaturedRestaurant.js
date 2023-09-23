import React from "react";

export default function FeaturedRestaurant(props) {
  const { fResto } = props;
  return (
    <div className='flex justify-center w-full'>
      <div className='w-1/2'>
        <h1 className='text-4xl font-bold text-primary-700'>
          {fResto.resName}
        </h1>
        <p>{fResto.description}</p>
      </div>
      <div className='w-1/2 bg-cover flex justify-center items-center'>
        <img
          src={fResto.profileImage}
          alt='Restaurant Image'
          className='w-auto h-80 object-contain'
        />
      </div>
    </div>
  );
}
