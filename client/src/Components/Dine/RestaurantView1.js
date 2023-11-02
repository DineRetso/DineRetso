import React from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantView1(props) {
  const { resto } = props;
  const navigate = useNavigate();

  return (
    <div className='flex flex-col border-2 border-main rounded-md p-1 space-x-2 w-full font-inter'>
      <div className='flex justify-center h-auto'>
        <img
          className='rounded-xl shadow-md'
          src={resto.profileImage}
          alt='resto profile'
        />
      </div>
      <div className='flex flex-col  h-auto justify-evenly w-full text-sm text-neutrals-500'>
        <div>
          <p className='font-bold text-xl text-orange-500'>{resto.resName}</p>
        </div>
        <div>
          <p>
            Location: <span>{resto.address}</span>
          </p>
        </div>
        <div>
          <p>
            Category: <span>{resto.category}</span>
          </p>
        </div>
        <div className='w-full flex flex-row justify-evenly items-center p-1'>
          <div className='border p-1 w-16 flex justify-center items-center rounded-xl border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
            <button
              className='w-full'
              onClick={() =>
                navigate(`/dine/admin/secret/restaurant/${resto._id}`)
              }
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
