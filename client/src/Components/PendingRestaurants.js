import React from "react";
import { useNavigate } from "react-router-dom";

export default function PendingRestaurants(props) {
  const { pending } = props;
  const navigate = useNavigate();
  return (
    <div className='border rounded p-4 my-2 border-main space-y-2'>
      <div className='bg-BackgroundGray text-warning rounded-md p-1'>
        <p>Pending...</p>
      </div>
      <div>
        <div className='w-full'>
          <div className='w-1/2'>
            <h2 className='text-sm font-semibold'>Restaurant Name:</h2>
          </div>
          <div className='w-1/2'>{pending.resName}</div>
        </div>
        <div>
          <p className='text-gray-600 mb-2'>
            Date: {new Date(pending.createdAt).toLocaleString()}
          </p>
        </div>
        <div className='flex justify-center'>
          <button
            className='bg-ButtonColor text-white px-3 py-1 text-center rounded hover:bg-main'
            onClick={() =>
              navigate(`/admin/manage-restaurant/pendingResto/${pending._id}`)
            }
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
