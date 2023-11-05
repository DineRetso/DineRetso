import React from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturedRestaurant(props) {
  const { fResto } = props;
  const navigate = useNavigate();
  return (
    <div
      className='flex flex-col justify-start items-center sm:w-64 w-48 p-1 hover:cursor-pointer'
      onClick={() => navigate(`/Restaurant/${fResto.resName}/web`)}
    >
      <div className='sm:w-60 sm:h-60 w-32 h-32 bg-cover flex justify-center items-center '>
        {fResto.profileImage ? (
          <img
            src={fResto.profileImage}
            alt='Restaurant profile'
            className='sm:w-60 sm:h-60 h-32 w-32 object-cover rounded-xl'
          />
        ) : (
          <img
            src='/Logo.png'
            alt='Restaurant profile'
            className='w-autow-60 h-60  object-cover  rounded-xl'
          />
        )}
      </div>
      <div className='w-full sm:p-2 p-1 sm:text-xl text-xs text-orange-500 flex justify-center items-center'>
        <h1 className='font-bold text-center'>{fResto.resName}</h1>
      </div>
    </div>
  );
}
