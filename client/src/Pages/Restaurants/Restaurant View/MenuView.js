import React, { useContext, useEffect, useState } from "react";
import { getError } from "../../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Rating } from "@mui/material";
import { Store } from "../../../Store";
import { toast } from "react-toastify";

export default function MenuView() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [menuData, setMenuData] = useState({});
  const { menuId } = useParams();
  const [loc, setLoc] = useState("reviews");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `/api/restaurant/Menu/getMenuItem/${menuId}`
        );
        if (response) {
          setMenuData(response.data);
        } else {
          setError("Menu Unavailable");
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchMenu();
  }, [menuId]);

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      if (!rating || !comment) {
        return toast.info("Please fill up all to submit.");
      } else {
        const response = await axios.post(
          `/api/restaurant/add-menu-review/${menuData.resName}`,
          {
            reviewerId: userInfo._id,
            reviewerName: userInfo.fName + " " + userInfo.lName,
            comment,
            rating,
            location: userInfo.address,
            menuId,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.status === 200) {
          toast.info(response.data.message);
          setRating(0);
          setComment("");
        } else {
          toast.error("Failed to submit review.");
        }
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  const calculateTotalRatings = (menu) => {
    if (!menu.menuReview) {
      return 0;
    }

    let totalRatings = 0;
    const len = menu.menuReview.length || 0;
    menu.menuReview.forEach((review) => {
      totalRatings += review.rating;
    });
    const averageRating = totalRatings / len;
    return averageRating;
  };

  return (
    <div className='w-full flex justify-center items-center flex-col font-inter'>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full max-h-screen flex sm:flex-row sm:space-x-10 flex-col justify-center items-start sm:p-5 p-1'>
          <div className='w-[40%]'>
            {menuData.menuImage ? (
              <img
                src={menuData.menuImage}
                alt={menuData.menuName}
                className='w-full h-[35rem] rounded-md object-cover'
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
          <div className='w-full flex flex-col sm:space-y-5 h-screen'>
            <div className='flex flex-col space-y-3'>
              <div>
                <h1 className='text-5xl font-bold text-orange-200'>
                  {menuData.menuName}
                </h1>
              </div>
              <div>
                <Rating
                  name='read-only'
                  size='medium'
                  value={calculateTotalRatings(menuData)}
                  precision={0.1}
                  readOnly
                />
              </div>
            </div>
            <div>
              <p className='text-xl text-neutrals-500'>
                {menuData.description}
              </p>
            </div>
            <div className='w-full grid grid-cols-2'>
              <div className='border p-2 flex justify-center items-center text-3xl text-neutrals-500 font-bold'>
                <h1>{menuData.price}.00</h1>
              </div>
              <div className='border p-2 flex justify-center items-center text-3xl text-neutrals-500 font-bold'>
                {menuData.resName}
              </div>
            </div>
            <div className='flex flex-row space-x-3 p-2 text-neutrals-500'>
              <div
                onClick={() => setLoc("reviews")}
                className={`${
                  loc === "reviews" &&
                  "p-2 border-b rounded-lg border-orange-500 text-orange-500 font-semibold"
                } hover:cursor-pointer `}
              >
                Reviews
              </div>
              <div
                onClick={() => setLoc("add")}
                className={`${
                  loc === "add" &&
                  "p-2 border-b rounded-lg border-orange-500 text-orange-500 font-semibold"
                } hover:cursor-pointer `}
              >
                Add Review
              </div>
            </div>
            {loc === "reviews" ? (
              <div>
                <h1 className='text-2xl text-orange-500 max-h-fit font-semibold'>
                  Reviews
                </h1>
                {menuData.menuReview && menuData.menuReview.length > 0 ? (
                  <div>
                    {menuData.menuReview.map((menu) => (
                      <div
                        key={menu._id}
                        className='flex sm:flex-row flex-col p-2 border-b border-orange-500'
                      >
                        <div className='flex flex-row justify-start items-center w-60'>
                          {menu.image ? (
                            <div>
                              <img
                                src={menu.image}
                                alt='reviewer pic'
                                className='h-14 w-14 rounded-full'
                              />
                            </div>
                          ) : (
                            <div>
                              <img
                                src='/userIcon.png'
                                alt='reviewer pic'
                                className='h-14 w-14 rounded-full'
                              />
                            </div>
                          )}
                          <div className='pl-2 text-neutrals-500'>
                            <h1 className='font-semibold'>
                              {menu.reviewerName}
                            </h1>
                            <h1>{formatDate(menu.createdAt)}</h1>
                          </div>
                        </div>
                        <div className='flex flex-col justify-start items-start'>
                          <Rating
                            name='read-only'
                            size='medium'
                            value={menu.rating}
                            readOnly
                            precision={0.1}
                          />
                          <div className='pl-2 text-neutrals-500 text-sm'>
                            {menu.comment}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='flex justify-center items-center '>
                    No Review
                  </div>
                )}
              </div>
            ) : (
              <form
                className='w-full  mx-auto px-4 bg-white rounded-lg shadow-lg'
                onSubmit={submitRating}
              >
                <div className='mb-4 flex flex-row justify-start items-center space-x-2'>
                  <label className='block text-neutrals-500 font-semibold'>
                    Your Rating:
                  </label>
                  <div className='flex items-center justify-center'>
                    <Rating
                      name='star-rating'
                      size='large'
                      value={parseFloat(rating)}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      precision={0.1}
                    />
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-600 font-semibold'>
                    Your Comment:
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows='4'
                    placeholder='Enter your comment here...'
                    className='w-full border rounded-lg p-2 text-gray-800'
                    required
                  />
                </div>
                <div className='w-full flex justify-center items-center p-2'>
                  {userInfo ? (
                    <div className='w-32 text-center border p-1 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                      <button type='submit' className='w-full'>
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div className='text-center text-orange-500 '>
                      <h1>Login to submit review.</h1>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
