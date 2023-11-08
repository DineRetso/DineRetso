import React, { useContext, useState } from "react";
import { Rating } from "@mui/material";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import RateMenu from "./RateMenu";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { getError } from "../../utils";
export default function Menu(props) {
  const { menu } = props;
  const [showRateMenu, setshowRateMenu] = useState(false);
  const [rateMenu, setRateMenu] = useState(null);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { pid } = props;
  const [menuId, setMenuId] = useState("");

  const handleAddMenuRate = async (
    menu,
    reviewerId,
    rating,
    comment,
    reviewerName,
    location
  ) => {
    try {
      const response = await axios.post(
        `/api/restaurant/add-menu-review/${pid}`,
        { reviewerId, reviewerName, comment, rating, location, menuId },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.info(response.data.message);
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };
  const handleRateClick = () => {
    setRateMenu(menu);
    setshowRateMenu(true);
    setMenuId(menu._id);
  };
  const calculateTotalRatings = (menu) => {
    let totalRatings = 0;
    let len = 0;
    if (menu.menuReview && menu.menuReview.length > 0) {
      const approvedReviews = menu.menuReview.filter(
        (review) => review.status === "approved"
      );
      approvedReviews.forEach((review) => {
        totalRatings += review.rating;
        len++;
      });
    }
    const averageRating = len > 0 ? totalRatings / len : 0;

    return averageRating;
  };
  return (
    <div>
      <div>
        {menu.menuImage ? (
          <img
            src={menu.menuImage}
            alt={menu.menuName}
            className='w-64 h-40 sm:h-48 sm:w-80 rounded-t-md object-cover'
          />
        ) : (
          <div>
            <img
              className='w-64 h-40 sm:h-48 sm:w-80 rounded-t-md'
              src='/dineLogo.jpg'
              alt='menuImage'
            />
          </div>
        )}
      </div>
      <div className='space-y-2 p-2'>
        <h1 className='text-xl text-orange-500 font-semibold'>
          {menu.menuName}
        </h1>
        <h2 className='text-xl text-neutrals-700'>₱{menu.price}</h2>
        <div className='flex flex-col justify-center items-start'>
          <Rating
            name='read-only'
            size='medium'
            value={calculateTotalRatings(menu)}
            precision={0.1}
            readOnly
          />
          <div className='p-2 flex justify-center items-center w-full'>
            {userInfo ? (
              <div className='text-center bg-orange w-full h-full rounded-md bg-orange-300'>
                <button onClick={handleRateClick}>Rate Now</button>
              </div>
            ) : (
              <div className='text-center bg-orange w-full h-full rounded-md bg-orange-300'>
                <button
                  onClick={() => toast.info("Please login to rate this menu!")}
                >
                  Rate Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRateMenu && rateMenu && (
        <RateMenu
          onClose={() => setshowRateMenu(false)}
          onRateMenu={handleAddMenuRate}
          rateMenu={rateMenu}
        />
      )}
    </div>
  );
}
