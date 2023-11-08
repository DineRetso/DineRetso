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
      <div className='bg-TextColor flex flex-col justify-center items-center p-2 sm:p-5 rounded-md w-full sm:w-1/2 border border-orange-500'>
        <h2 className='text-2xl font-semibold mb-4'>
          Rate {rateMenu.menuName}
        </h2>
        <div className='mb-4 w-full'>
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
        <div className='w-full mb-4'>
          <p>Additional Feedback:</p>
          <textarea
            rows='4'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Write your feedback here...'
            required
            className='w-full p-2 border border-gray-400 rounded-md'
          />
        </div>
        <button
          onClick={handleSubmit}
          className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600'
        >
          Submit Rating
        </button>
        <div className='mt-4'>
          <button
            className='border border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:text-TextColor transition-all duration-300 px-4 py-2 rounded-md'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
