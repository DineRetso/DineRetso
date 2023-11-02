import React from "react";
import { useNavigate } from "react-router-dom";

export default function PendingRestaurants(props) {
  const { pending } = props;
  const navigate = useNavigate();
  return (
    <div className='border border-orange-500 rounded-xl p-4 my-2 border-main space-y-2 flex justify-center items-center flex-col'>
      <div className='w-full p-2 flex justify-center items-center'>
        <img src={pending.image} alt='resto registration' className='h-32' />
      </div>
      <div className='text-2xl text-orange-500 font-semibold'>
        {pending.resName}
      </div>
      <div>
        <p className='text-neutrals-500 mb-2'>
          Date: {new Date(pending.createdAt).toLocaleString()}
        </p>
      </div>
      <div className='w-full flex justify-center items-center'>
        <div className='flex justify-center border rounded-xl p-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all w-32'>
          <button
            className='text-center'
            onClick={() =>
              navigate(
                `/dine/admin/secret/registration/pendingResto/${pending._id}`
              )
            }
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
