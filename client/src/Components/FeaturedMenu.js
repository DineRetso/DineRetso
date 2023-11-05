import React from "react";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FeaturedMenu(props) {
  const { fMenu } = props;
  const navigate = useNavigate();

  const calculateTotalRatings = (menu) => {
    let totalRatings = 0;
    const len = menu.menuReview.length || 0;
    menu.menuReview.forEach((review) => {
      totalRatings += review.rating;
    });
    const averageRating = totalRatings / len;
    return averageRating;
  };
  return (
    <div
      className='flex flex-col justify-center w-full shadow-xl h-auto sm:h-[400px] rounded-md hover:cursor-pointer'
      onClick={() => navigate(`/Menu/${fMenu._id}`)}
    >
      <div className='flex justify-center items-center w-full sm:h-80 h-72 bg-neutrals-600 bg-opacity-70 rounded-md'>
        {fMenu.menuImage ? (
          <img
            className='h-full w-full object-cover'
            src={fMenu.menuImage}
            alt={fMenu.menuName}
          />
        ) : (
          <img
            className='h-full w-full object-cover'
            src='/dinelogo.png'
            alt={fMenu.menuName}
          />
        )}
      </div>
      <div className='flex sm:flex-row flex-col justify-between flex-grow px-3 bg-neutrals-200 shadow-md p-2'>
        <div className='flex flex-col text-neutrals-700'>
          <h1 className='text-2xl font-semibold text-orange-500'>
            {fMenu.menuName}
          </h1>
          <h1 className='text-md'>{fMenu.owner}</h1>
        </div>
        <div className='flex justify-center items-center'>
          <Rating
            name='read-only'
            value={calculateTotalRatings(fMenu)}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
