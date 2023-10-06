import React from "react";
import { Rating } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

export default function Review(props) {
  const { rev } = props;
  return (
    <div className='flex w-full justify-start items-center py-10 border-b'>
      <div className='flex w-80 flex-row space-x-3 justify-start items-center'>
        <div>
          {rev.image ? (
            <img
              src={rev.image}
              alt='owner-profile'
              className='h-16 w-16 rounded-full'
            />
          ) : (
            <img
              src='/userIcon.png'
              alt='owner-profile'
              className='h-16 w-16 rounded-full border'
            />
          )}
        </div>
        <div>
          <h1 className='text-sm'>
            {formatDistanceToNow(new Date(rev.createdAt))} ago
          </h1>
          <h1 className='text-xl text-orange-500'>{rev.reviewerName}</h1>
        </div>
      </div>
      <div className='w-full flex flex-col'>
        <Rating
          name='read-only'
          size='large'
          value={rev.rating}
          readOnly
          precision={0.5}
        />
        <p>{rev.comment}</p>
      </div>
    </div>
  );
}
