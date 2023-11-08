import React from "react";
import { Rating } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

export default function Review(props) {
  const { rev } = props;
  return (
    <div className='flex sm:flex-row flex-col w-full justify-start items-center py-5 sm:py-10 border-b'>
      <div className='flex w-1/2 sm:w-80 flex-row space-x-3 justify-start items-center'>
        <div>
          {rev.image ? (
            <img
              src={rev.image}
              alt='owner-profile'
              className='h-12 sm:h-16 w-12 sm:w-16 rounded-full'
            />
          ) : (
            <img
              src='/userIcon.png'
              alt='owner-profile'
              className='h-12 sm:h-16 w-12 sm:w-16 rounded-full border'
            />
          )}
        </div>
        <div>
          <h1 className='text-md sm:text-lg text-orange-500'>
            {rev.reviewerName}
          </h1>
          <h1 className='text-xs sm:text-sm'>
            {formatDistanceToNow(new Date(rev.createdAt))} ago
          </h1>
        </div>
      </div>
      <div className='w-full flex flex-col'>
        <Rating
          name='read-only'
          size='medium'
          value={rev.rating}
          readOnly
          precision={0.1}
        />
        <p className='text-sm sm:text-base'>{rev.comment}</p>
      </div>
    </div>
  );
}
