import React from "react";
import { formatDistanceToNow } from "date-fns";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

function ShowManageReview({
  review,
  manageReview,
  setReviewStatus,
  setReviewId,
  setMenuId,
  status,
}) {
  return (
    <div className='border rounded-xl w-auto flex lg:flex-row md:flex-row sm:flex-row flex-col'>
      <div className='lg:w-3/4 md:w-3/4 sm:w-3/4 w-full flex lg:flex-row md:flex-row flex-col border-b'>
        <div className='w-auto flex flex-row space-x-2 justify-start items-center sm:border-r '>
          <div className='flex justify-center items-center w-14'>
            {review.image ? (
              <div>
                <img
                  src={review.image}
                  className='w-10 h-10 rounded-full'
                  alt='user-profile'
                />
              </div>
            ) : (
              <div>
                <img
                  src='/userIcon.png'
                  className='w-10 h-10 rounded-full'
                  alt='user-profile'
                />
              </div>
            )}
          </div>
          <div className='w-40'>
            <h1>{review.reviewerName}</h1>
            <h1 className='text-sm text-neutrals-500'>
              {formatDistanceToNow(new Date(review.createdAt))} ago
            </h1>
            <Rating value={review.rating} readOnly precision={0.1} />
          </div>
        </div>
        <div className='w-full h-full flex flex-col justify-start items-start p-2'>
          <div className='mb-2'>
            <h1 className=' font-bold'>
              Source: <span className='text-orange-500'>{review.source}</span>
            </h1>
          </div>
          <div>
            <h1 className='text-neutrals-500 text-justify'>{review.comment}</h1>
          </div>
        </div>
      </div>

      <div className='flex lg:w-1/4 md:w-1/4 sm:w-1/4 w-full justify-end items-center'>
        {review.status === "approved" ? (
          <div>
            <h1>Approved</h1>
          </div>
        ) : (
          <div className='flex justify-center lg:space-x-0 md:space-x-0 sm:space-x-0 space-x-0 space-y-2 lg:flex-col md:flex-col sm:flex-col flex-row'>
            <form
              onSubmit={(e) => manageReview(e, review._id, review.menuId)}
              className='w-full flex lg:flex-col md:flex-col sm:flex-col flex-row justify-evenly'
            >
              <select
                className='p-2 rounded-md text-sm border outline-primary-500 shadow-md'
                onChange={(e) => setReviewStatus(e.target.value)}
              >
                <option value=''>Manage</option>
                <option value='approved'>Approve</option>
                <option value='hidden'>Hide</option>
              </select>

              <input
                value={review._id}
                onChange={(e) => setReviewId(e.target.value)}
                type='hidden'
              />
              {review.source === "Menu" ? (
                <div>
                  <input
                    value={review.menuId}
                    onChange={(e) => setMenuId(e.target.value)}
                    type='hidden'
                  />
                </div>
              ) : (
                <div>
                  <input
                    type='hidden'
                    value=''
                    onChange={(e) => setMenuId(e.target.value)}
                  />
                </div>
              )}
              <div className='p-2 rounded-md text-sm border outline-primary-500 shadow-md'>
                {status === "subscribed" ? (
                  <button type='submit'>Respond</button>
                ) : (
                  <div
                    onClick={() => toast.info("Subscribe for full access.")}
                    className='hover:cursor-pointer'
                  >
                    Respond
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowManageReview;
