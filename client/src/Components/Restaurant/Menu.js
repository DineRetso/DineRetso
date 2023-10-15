import React, { useContext, useState } from "react";
import { Rating } from "@mui/material";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import RateMenu from "./RateMenu";
import axios from "axios";
import { useParams } from "react-router-dom";
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
      console.log(menuId);
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Internal Server Error. Please Contact the DineRetso!");
      }
    }
  };
  const handleRateClick = () => {
    setRateMenu(menu);
    setshowRateMenu(true);
    setMenuId(menu._id);
  };
  const calculateTotalRatings = (menu) => {
    let totalRatings = 0;
    const len = menu.menuReview.length;
    menu.menuReview.forEach((review) => {
      totalRatings += review.rating;
    });
    const averageRating = totalRatings / len;
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
        <div className='flex justify-between items-center'>
          <Rating
            name='read-only'
            size='medium'
            value={calculateTotalRatings(menu)}
            precision={0.1}
            readOnly
          />
          <div className='p-2'>
            {userInfo ? (
              <div>
                <button onClick={handleRateClick}>Rate Now</button>
              </div>
            ) : (
              <div>
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
