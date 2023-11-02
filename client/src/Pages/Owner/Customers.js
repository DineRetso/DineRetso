import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import axios from "axios";
import { toast } from "react-toastify";
import { Rating } from "@mui/material";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ShowManageReview from "../../Components/Owner/CustomerChildren/ShowManageReview";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, myRestaurant: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Customers() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [status, setStatus] = useState("");
  const [resRev, setResRev] = useState([]);
  const [menuRev, setMenuRev] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [statusOption, setStatusOption] = useState("pending");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [menus, setMenus] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [reviewId, setReviewId] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [menuId, setMenuId] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [sortedMenuReviews, setSortedMenuReviews] = useState([]);

  const [{ loading, error, myRestaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    myRestaurant: [],
    error: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `/api/users/get-user/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setStatus(data.subscriptionStatus);
        setUserData(data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error");
        }
      }
    };
    fetchUser();
  }, [userInfo._id, userInfo.token, setStatus, setUserData]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/owner/restaurant/${userInfo.fName}/${userInfo.myRestaurant}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        const menus = response.data.menu || [];
        setMenus(menus);
        setMenuRev(menus.flatMap((menuItem) => menuItem.menuReview));
        setResRev(response.data.restoReview || []);
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error });
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          dispatch({
            type: "FETCH_FAIL",
            payload: error.response.data.message,
          });
        } else {
          dispatch({
            type: "FETCH_FAIL",
            payload: "An unexpected error occurred.",
          });
        }
      }
    };
    fetchRestaurant();
  }, [userInfo.fName, userInfo.token, userInfo.myRestaurant]);

  const manageReview = async (e, reviewId, menuId) => {
    e.preventDefault();
    try {
      if (reviewStatus === "") {
        return toast.error("Please select status to submit!");
      }

      const response = await axios.post(
        `/api/owner/restaurant/manage-review/${userData.myRestaurant}`,
        {
          menuId: menuId, // Provide the menu ID if applicable
          id: reviewId, // Review ID
          status: reviewStatus, // New status
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success(response.data.message);
      const fetchRestaurant = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const response = await axios.get(
            `/api/owner/restaurant/${userData.fName}/${userData.myRestaurant}`,
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          const menus = response.data.menu || [];
          setMenus(menus);
          setMenuRev(menus.flatMap((menuItem) => menuItem.menuReview));
          setResRev(response.data.restoReview || []);
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        } catch (error) {
          dispatch({ type: "FETCH_FAIL", payload: error });
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            dispatch({
              type: "FETCH_FAIL",
              payload: error.response.data.message,
            });
          } else {
            dispatch({
              type: "FETCH_FAIL",
              payload: "An unexpected error occurred.",
            });
          }
        }
      };
      fetchRestaurant();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 500) {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const filteredAndSortedReviews = () => {
    let filteredReviews = [];

    if (filterOption === "menu") {
      // Filter and set menuRev with the filtered menu reviews
      filteredReviews = myRestaurant.menu.reduce((acc, menuItem) => {
        return acc.concat(menuItem.menuReview);
      }, []);
    } else if (filterOption === "resto") {
      filteredReviews = resRev || [];
    } else {
      filteredReviews = [...menuRev, ...resRev];
    }

    if (statusOption === "approved") {
      filteredReviews = filteredReviews.filter(
        (review) => review.status === "approved"
      );
    } else if (statusOption === "hidden") {
      filteredReviews = filteredReviews.filter(
        (review) => review.status === "hidden"
      );
    } else if (statusOption === "pending") {
      filteredReviews = filteredReviews.filter(
        (review) => review.status === "pending"
      );
    } else {
      filteredReviews = filteredReviews;
    }

    if (sortOption === "rating") {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "date") {
      filteredReviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (searchQuery) {
      filteredReviews = filteredReviews.filter((review) =>
        review.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredReviews;
  };
  const displayedReviews = filteredAndSortedReviews();

  const calculateTotalReview = () => {
    const filteredRev = filteredAndSortedReviews();
    const totalReview = filteredRev.length;

    const sumRatings =
      totalReview > 0
        ? filteredRev.reduce((acc, review) => acc + review.rating, 0)
        : 0;

    const averageRati = totalReview > 0 ? sumRatings / totalReview : 0;
    const averageRatings = Math.round(averageRati * 2) / 2;
    return {
      totalReview,
      averageRatings,
    };
  };
  const { totalReview, averageRatings } = calculateTotalReview();

  //sorting and filtering through menu
  const filterMenuReview = () => {
    let filteredMenu = [...menus];

    if (statusOption === "approved") {
      filteredMenu = filteredMenu.filter((menuItem) =>
        menuItem.menuReview.some((review) => review.status === "approved")
      );
    } else if (statusOption === "hidden") {
      filteredMenu = filteredMenu.filter((menuItem) =>
        menuItem.menuReview.some((review) => review.status === "hidden")
      );
    } else if (statusOption === "pending") {
      filteredMenu = filteredMenu.filter((menuItem) =>
        menuItem.menuReview.some((review) => review.status === "pending")
      );
    } else {
      filteredMenu = [...menus];
    }

    if (sortOption === "rating") {
      // Sort by average rating in descending order
      filteredMenu.sort((a, b) => {
        const averageRatingA =
          a.menuReview.reduce((sum, review) => sum + review.rating, 0) /
          a.menuReview.length;
        const averageRatingB =
          b.menuReview.reduce((sum, review) => sum + review.rating, 0) /
          b.menuReview.length;
        return averageRatingB - averageRatingA;
      });
    } else if (sortOption === "date") {
      filteredMenu.sort((a, b) => {
        const latestCommentDateA = new Date(
          Math.max(...a.menuReview.map((review) => new Date(review.createdAt)))
        );
        const latestCommentDateB = new Date(
          Math.max(...b.menuReview.map((review) => new Date(review.createdAt)))
        );
        return latestCommentDateB - latestCommentDateA;
      });
    }

    if (searchQuery) {
      filteredMenu = filteredMenu.filter((menuItem) =>
        menuItem.menuReview.some((review) =>
          review.comment.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filteredMenu;
  };
  useEffect(() => {
    const filteredMenu = filterMenuReview();
    setFilteredMenuItems(filteredMenu);
  }, [searchQuery, menus, statusOption, sortOption]);
  //Sorting and searching for menu Reviews
  const sortMenuReviews = () => {
    let sortedReviews = [...selectedMenuItem.menuReview];
    if (statusOption === "approved") {
      sortedReviews = sortedReviews.filter(
        (review) => review.status === "approved"
      );
    } else if (statusOption === "hidden") {
      sortedReviews = sortedReviews.filter(
        (review) => review.status === "hidden"
      );
    } else if (statusOption === "pending") {
      sortedReviews = sortedReviews.filter(
        (review) => review.status === "pending"
      );
    } else {
      sortedReviews = sortedReviews;
    }

    if (sortOption === "rating") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "date") {
      sortedReviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    setSortedMenuReviews(sortedReviews);
  };
  const filterAndSearchMenuReviews = () => {
    let filteredReviews = [...sortedMenuReviews];
    if (searchQuery) {
      filteredReviews = filteredReviews.filter((review) =>
        review.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filteredReviews;
  };
  useEffect(() => {
    if (selectedMenuItem) {
      sortMenuReviews();
    }
  }, [selectedMenuItem, sortOption]);

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72  p-4 font-inter'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className=''>
          <div className='flex justify-start'>
            <h1 className='font-semibold lg:text-3xl md:text-2xl text-xl text-orange-500'>
              Reviews
            </h1>
          </div>
          <div className='flex flex-row w-full  border-neutrals-700 space-x-2 justify-evenly sm:p-3 p-1 mb-3  '>
            <div className='flex w-1/2 justify-center items-center flex-col border p-2 '>
              <h1 className='lg:text-5xl text-3xl text-orange-500'>
                {totalReview}
              </h1>
              <h1 className='font-bold lg:text-xl text-md text-neutrals-500'>
                Total Reviews
              </h1>
            </div>
            <div className='flex w-1/2 justify-center items-center border p-2'>
              <div className='flex flex-col justify-center items-center'>
                <h1 className='lg:text-5xl text-3xl text-orange-500'>
                  {averageRatings}/5
                </h1>
                <Rating
                  name='read-only'
                  size='large'
                  value={averageRatings}
                  readOnly
                  precision={0.1}
                  title={`Average Rating: ${averageRatings}`}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col lg:px-3 md:px-2 mb-2'>
            <div className='flex w-full'>
              <h1 className='text-orange-500 font-semibold'>Recent Activity</h1>
            </div>
            <div className='flex flex-row lg:space-x-5'>
              <select
                className='p-2 w-full rounded-md text-sm border outline-orange-500 text-neutrals-500 shadow-md'
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value='all'>All</option>
                <option value='menu'>Menu</option>
                <option value='resto'>Restaurant</option>
              </select>
              <select
                className='p-2 w-full rounded-md text-sm border outline-orange-500 text-neutrals-500 shadow-md'
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value=''>Sort</option>
                <option value='rating'>Rating</option>
                <option value='date'>Date</option>
              </select>
              <select
                className='p-2 w-full rounded-md text-sm border outline-orange-500 text-neutrals-500 s shadow-md'
                value={statusOption}
                onChange={(e) => setStatusOption(e.target.value)}
              >
                <option value=''>All</option>
                <option value='approved'>Approved</option>
                <option value='hidden'>Hidden</option>
                <option value='pending'>Pending</option>
              </select>
            </div>
          </div>
          <div className='w-full flex justify-start h-20 items-center border-b lg:px-3 md:px-2'>
            <i className='material-icons text-3xl text-orange-500'>search</i>
            <input
              className='w-full outline-none border-b focus:border-orange-500 text-xl'
              type='text'
              placeholder='Search here...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='w-full lg:p-4 md:p-3 sm:p-2 p-1 h-screen'>
            <div className='container h-full overflow-hidden overflow-y-auto '>
              <div className='h-full w-full'>
                <div className='Customer-reviews space-y-4 lg:p-5 md:p-3 p-1'>
                  {/* Display Menu and its reviews */}
                  {filterOption === "menu" && (
                    <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-2 gap-4 overflow-x-auto'>
                      {filteredMenuItems.map(
                        (menuItem) =>
                          menuItem.menuReview.length > 0 && (
                            <div key={menuItem._id} className=''>
                              <div
                                onClick={() => setSelectedMenuItem(menuItem)}
                              >
                                <div className='flex justify-center items-center'>
                                  {menuItem.menuImage ? (
                                    <img
                                      src={menuItem.menuImage}
                                      alt={menuItem.menuName}
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
                                <div className='w-auto '>
                                  <h1 className='w-full py-2 bg-orange-200 text-center text-TextColor text-xl font-semibold'>
                                    {menuItem.menuName}
                                  </h1>
                                  <div className='bg-neutrals-200 flex justify-center items-center flex-col'>
                                    <h1>
                                      {menuItem.menuReview.length} Reviews
                                    </h1>
                                    <div className='flex justify-center items-center'>
                                      <Rating
                                        name='read-only'
                                        size='medium'
                                        value={
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
                              </div>
                              {/* Display Menu Reviews */}
                              {selectedMenuItem === menuItem && (
                                <div className='fixed top-0 sm:left-72 left-0 right-0 h-screen max-h-screen bg-white z-50 sm:p-10 p-2 pt-5 shadow-md overflow-y-auto bg-TextColor'>
                                  <h1 className='text-center text-2xl font-semibold text-orange-500'>
                                    {menuItem.menuName}
                                  </h1>
                                  <div className='w-full space-y-3'>
                                    {filterAndSearchMenuReviews().map(
                                      (review) => (
                                        <ShowManageReview
                                          key={review._id}
                                          review={review}
                                          manageReview={manageReview}
                                          setReviewStatus={setReviewStatus}
                                          setReviewId={setReviewId}
                                          setMenuId={setMenuId}
                                          status={status}
                                        />
                                      )
                                    )}
                                  </div>
                                  <div className='fixed top-2 right-2 border border-orange-500 p-2 rounded-md text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                                    <button
                                      className='w-full'
                                      onClick={(e) => setSelectedMenuItem(null)}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  )}

                  {/* Display Restaurant Reviews */}
                  {filterOption === "resto" &&
                    (displayedReviews.length > 0 ? (
                      displayedReviews.map((review) => (
                        <ShowManageReview
                          key={review._id}
                          review={review}
                          manageReview={manageReview}
                          setReviewStatus={setReviewStatus}
                          setReviewId={setReviewId}
                          setMenuId={setMenuId}
                          status={status}
                        />
                      ))
                    ) : (
                      <div>
                        <h1>No Reviews Available</h1>
                      </div>
                    ))}

                  {/* Display All Reviews */}
                  {filterOption === "all" &&
                    (displayedReviews.length > 0 ? (
                      displayedReviews.map((review) => (
                        <ShowManageReview
                          key={review._id}
                          review={review}
                          manageReview={manageReview}
                          setReviewStatus={setReviewStatus}
                          setReviewId={setReviewId}
                          setMenuId={setMenuId}
                          status={status}
                        />
                      ))
                    ) : (
                      <div className='text-red-200 font-semibold'>
                        <h1>No Reviews Available</h1>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
