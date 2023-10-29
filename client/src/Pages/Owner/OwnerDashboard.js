import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import axios from "axios";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { Rating } from "@mui/material";

export default function OwnerDashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fbVisit, setFbVisit] = useState("");
  const [profileVisit, setProfileVisit] = useState("");
  const [emailVisit, setEmailVisit] = useState("");
  const [totalReviewToday, setTotalReviewToday] = useState("");
  const [totalPending, setTotalPending] = useState("");

  ///restaurant/:owner/:restaurantID"
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `/api/owner/getMenu/${userInfo.myRestaurant}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.status === 200) {
          const filteredMenu = response.data.menu.filter(
            (men) => men.menuReview.length !== 0
          );
          const sortedMenu = filteredMenu.sort((a, b) => {
            const ratingA = calculateAverageRating(a.menuReview);
            const ratingB = calculateAverageRating(b.menuReview);
            return ratingB - ratingA;
          });
          setMenu(sortedMenu);
          setLoading(false);
        } else {
          setError("Failed to fetch menu.");
          setLoading(false);
        }
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
      }
    };
    const fetchVisitsAndReviews = async () => {
      try {
        const response = await axios.get(
          `/api/owner/restaurant/${userInfo.fName}/${userInfo.myRestaurant}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );

        if (response.status === 200) {
          const visits = response.data.visits || [];
          const restoReviews = response.data.restoReview || [];
          const men = response.data.menu || [];
          const menuReviews = men.flatMap((menuItem) => menuItem.menuReview);
          const currentDate = new Date();

          const fbVisitsToday = visits.filter(
            (visit) =>
              visit.source === "facebook" &&
              formatDate(visit.timestamp) === formatDate(currentDate)
          );

          const emailVisitsToday = visits.filter(
            (visit) =>
              visit.source === "email" &&
              formatDate(visit.timestamp) === formatDate(currentDate)
          );

          const webVisitsToday = visits.filter(
            (visit) =>
              visit.source === "web" &&
              formatDate(visit.timestamp) === formatDate(currentDate)
          );
          const restoReviewsToday = restoReviews.filter(
            (review) => formatDate(review.createdAt) === formatDate(currentDate)
          );
          const menuReviewsToday = menuReviews.filter(
            (review) => formatDate(review.createdAt) === formatDate(currentDate)
          );
          const restoPending = restoReviews.filter(
            (review) => review.status === "pending"
          );
          const menuPending = menuReviews.filter(
            (review) => review.status === "pending"
          );
          setFbVisit(fbVisitsToday.length);
          setEmailVisit(emailVisitsToday.length);
          setProfileVisit(webVisitsToday.length);
          setTotalReviewToday(
            restoReviewsToday.length + menuReviewsToday.length
          );
          setTotalPending(restoPending.length + menuPending.length);
          setLoading(false);
        } else {
          setError("Failed to fetch visits and reviews.");
          setLoading(false);
        }
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
      }
    };
    fetchMenu();
    fetchVisitsAndReviews();
  }, [userInfo.token, userInfo.myRestaurant, userInfo.fName]);

  const calculateAverageRating = (menuReview) => {
    if (menuReview.length === 0) {
      return 0;
    }
    const totalRating = menuReview.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / menuReview.length;
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 relative flex p-5'>
      {error ? (
        <div>
          <h1>{error}</h1>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <div className='flex-col space-y-5 w-full'>
          <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-5'>
            <div className='border h-28 rounded-md bg-TextColor p-2 flex flex-row justify-start items-center space-x-2 shadow-lg border-orange-500'>
              <div className='w-10 h-10 border flex justify-center items-center border-orange-500 rounded-md'>
                <i className='material-icons text-orange-500'>facebook</i>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-2xl text-orange-500 font-semibold'>
                  {fbVisit}
                </h2>
                <h1 className='text-neutrals-500'>
                  Total Facebook Page Visits Today
                </h1>
              </div>
            </div>
            <div className='border h-28 rounded-md bg-TextColor p-2 flex flex-row justify-start items-center space-x-2 shadow-lg border-orange-500'>
              <div className='w-10 h-10 border flex justify-center items-center border-orange-500 rounded-md'>
                <i className='material-icons text-orange-500'>account_circle</i>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-2xl text-orange-500 font-semibold'>
                  {profileVisit}
                </h2>
                <h1 className='text-neutrals-500'>
                  Total DineRetso Profile Visits Today
                </h1>
              </div>
            </div>
            <div className='border h-28 rounded-md bg-TextColor p-2 flex flex-row justify-start items-center space-x-2 shadow-lg border-orange-500'>
              <div className='w-10 h-10 border flex justify-center items-center border-orange-500 rounded-md'>
                <i className='material-icons text-orange-500'>email</i>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-2xl text-orange-500 font-semibold'>
                  {emailVisit}
                </h2>
                <h1 className='text-neutrals-500'>
                  Total of Email Click Today
                </h1>
              </div>
            </div>
            <div className='border h-28 rounded-md bg-TextColor p-2 flex flex-row justify-start items-center space-x-2 shadow-lg border-orange-500'>
              <div className='w-10 h-10 border flex justify-center items-center border-orange-500 rounded-md'>
                <i className='material-icons text-orange-500'>feedback</i>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-2xl text-orange-500 font-semibold'>
                  {totalReviewToday}
                </h2>
                <h1 className='text-neutrals-500'>Total Customers Feedback</h1>
              </div>
            </div>
            <div className='border h-28 rounded-md bg-TextColor p-2 flex flex-row justify-start items-center space-x-2 shadow-lg border-orange-500'>
              <div className='w-10 h-10 border flex justify-center items-center border-orange-500 rounded-md'>
                <i className='material-icons text-orange-500'>rate_review</i>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-2xl text-orange-500 font-semibold'>
                  {totalPending}
                </h2>
                <h1 className='text-neutrals-500'>Total Pending Reviews</h1>
              </div>
            </div>
          </div>
          <div className='w-full p-5 border shadow-md max-h-[500px] overflow-y-auto flex flex-col space-y-5'>
            <div>
              <h1 className='text-orange-500 font-bold text-xl'>
                Top Rating Menu
              </h1>
            </div>
            <div className='grid sm:grid-cols-2 grid-cols-1 w-full'>
              {menu.map((menuItem) => (
                <div
                  key={menuItem._id}
                  className='flex flex-row items-center p-4 rounded-lg w-full'
                >
                  {" "}
                  <div className='shadow-lg'>
                    {menuItem.menuImage ? (
                      <img
                        src={menuItem.menuImage}
                        alt={menuItem.menuName}
                        className='w-64 h-40 sm:h-52 sm:w-96 rounded-md object-cover'
                      />
                    ) : (
                      <div>
                        <img
                          className='w-64 h-40 sm:h-52 sm:w-96 rounded-md'
                          src='/dineLogo.jpg'
                          alt='menuImage'
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex justify-center items-start flex-col w-full shadow-lg h-48 space-y-2 pl-7'>
                    <div>
                      <p className='lg:text-2xl md:text-2xl sm:text-xl text-md text-neutrals-700 font-semibold'>
                        {menuItem.menuName}
                      </p>
                    </div>
                    <div className='lg:text-2xl md:text-md text-sm text-md text-neutrals-700 font-semibold'>
                      <p>P {menuItem.price}</p>
                    </div>
                    <div>
                      <Rating
                        name='read-only'
                        className={`lg:${"size='large'"}`}
                        value={
                          Array.isArray(menuItem.menuReview) &&
                          menuItem.menuReview.length > 0
                            ? (
                                menuItem.menuReview.reduce(
                                  (totalRating, review) =>
                                    totalRating + review.rating,
                                  0
                                ) / menuItem.menuReview.length
                              ).toFixed(1)
                            : 0
                        }
                        readOnly
                        precision={0.1}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
