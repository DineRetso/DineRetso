import { Rating } from "@mui/material";
import React, { useContext, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";

export default function RateMenu({ onClose, onRateMenu, rateMenu }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [rating, setRating] = useState(0); // Initialize with a default rating
  const [comment, setComment] = useState("");
  const reviewerName = userInfo.fName + " " + userInfo.lName;
  const location = userInfo.address;
  const reviewerId = userInfo._id;

  const handleSubmit = () => {
    if (!rating || !comment) {
      toast.info("Please fill up all to submit.");
    } else {
      onRateMenu(rateMenu, reviewerId, rating, comment, reviewerName, location);
      onClose();
    }
  };

  return (
    <div className='fixed flex inset-0 items-center justify-center z-50 top-0 left-0 sm:left-auto w-full sm:w-3/4 h-screen'>
      <div className='bg-TextColor flex flex-col justify-center items-center p-5 sm:p-10 rounded-md w-full sm:w-1/2 border border-orange-500'>
        <h2 className='text-2xl font-semibold mb-4'>Rate the Menu</h2>
        <div className='mb-4'>
          <p>How would you rate this menu?</p>
          <Rating
            name='half-rating'
            size='large'
            value={parseFloat(rating)}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={0.5}
          />
        </div>
        <div className='mb-4'>
          <p>Additional Feedback (optional):</p>
          <textarea
            rows='4'
            cols='50'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Write your feedback here...'
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600'
        >
          Submit Rating
        </button>
        <div
          className='border border-orange-500 flex justify-center items-center w-3/4 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'
          onClick={onClose}
        >
          Close
        </div>
      </div>
    </div>
  );
}
