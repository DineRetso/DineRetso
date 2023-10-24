import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { Store } from "../../../Store";

import Menu from "../../../Components/Restaurant/Menu";
import Review from "../../../Components/Restaurant/Review";
import Posts from "../../../Components/Restaurant/Posts";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, Restaurant: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function RestaurantMainView() {
  const [{ loading, error, Restaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    Restaurant: [],
    error: "",
  });
  const params = useParams();
  const [classi, setClassi] = useState([]);
  const [menuItem, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rates, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerId, setReviewerId] = useState("");
  const [location, setLocation] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/restaurant/${params.resName}/${params.source}`
        );
        // Extract menu classifications from the response
        const classifications = response.data.menu.map(
          (menu) => menu.classification
        );
        // Filter out duplicates
        const uniqueClassifications = Array.from(new Set(classifications));
        const items = response.data.menu;
        const post = response.data.blogPosts;
        const rev = response.data.restoReview.filter(
          (review) => review.status === true
        );
        setReviews(rev);
        setMenuItems(items);
        setClassi(uniqueClassifications);
        setPosts(post);

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
  }, [params.resName, params._id, params.source]);

  useEffect(() => {
    // Set reviewerName to userInfo.fName when userInfo is available
    if (userInfo && userInfo.fName) {
      setReviewerName(userInfo.fName + " " + userInfo.lName);
      setLocation(userInfo.address);
      setReviewerId(userInfo._id);
    }
  }, [userInfo]);
  //submit rating
  const rateHandler = async (e) => {
    e.preventDefault();
    if (!userInfo || !userInfo.token) {
      // Redirect to the login page if userInfo is missing
      navigate("/login");
      return;
    }
    if (rates === null || rates === undefined) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    const rating = Math.round(rates * 2) / 2;
    try {
      const response = await axios.post(
        `/api/restaurant/add-review/${params._id}`,
        { reviewerId, reviewerName, comment, rating, location },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.info(response.data.message);
        setRating("");
        setComment("");
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
  const calculateAverage = () => {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRatings = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    const averageRating = totalRatings / reviews.length;
    return averageRating;
  };
  const averageRating = calculateAverage();
  return (
    <div className='flex flex-col justify-center items-center w-full font-inter'>
      <div className='head-container w-full mt-[-110px]'>
        <div className='w-full h-80'>
          <img
            className='h-full w-full object-cover'
            src={Restaurant.bgPhoto}
            alt='Restaurant Background'
          />
        </div>
      </div>
      <div className='w-3/4 flex justify-evenly items-center space-x-5'>
        <div className='flex justify-center items-center w-80 h-80 border-b border-orange-700 '>
          <img
            src={Restaurant.profileImage}
            alt={Restaurant.resName}
            className='w-80 h-80 object-cover'
          />
        </div>
        <div className='flex flex-col space-y-2'>
          <span className='text-2xl font-semibold'>Welcome to </span>
          <h1 className='text-5xl font-bold text-orange-500 capitalize'>
            {Restaurant.resName}
          </h1>
          <div className='flex flex-col space-y-1 pl-10 text-lg'>
            <h3>{Restaurant.description}</h3>
            <h3>{Restaurant.address}</h3>
            <h3>{Restaurant.phoneNo}</h3>
            <span>Links:</span>
            <a href={Restaurant.webLink}>{Restaurant.webLink}</a>
            <a href={Restaurant.webLink}>{Restaurant.webLink}</a>
            <a href={Restaurant.webLink}>{Restaurant.webLink}</a>
          </div>
        </div>
      </div>
      <div className='flex w-11/12 space-x-10 justify-center text-3xl my-5 border-b-2 p-5'>
        <a href='#menu'>MENUS</a>
        <a href='#posts'>BLOG POSTS</a>
        <a href='#reviews'>REVIEWS</a>
      </div>
      <div
        id='menu'
        className='flex flex-col h-screen w-11/12 overflow-y-hidden overflow-hidden space-y-5 shadow-xl'
      >
        <div className='h-16 w-full flex justify-start items-center'>
          <i className='material-icons text-4xl '>search</i>
          <input
            className='w-full h-full px-2 rounded-md text-xl'
            placeholder='Search here...'
          ></input>
        </div>
        <div className='flex space-x-2'>
          <div className='p-2 border '>All</div>
          {classi.map((classification, index) => (
            <div key={index} className='p-2 border '>
              {classification}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-5 gap-5'>
          {menuItem.map((menu, index) => (
            <div key={index} className='flex flex-col shadow-lg'>
              <Menu menu={menu} pid={params._id} />
            </div>
          ))}
        </div>
      </div>
      <div id='posts' className='max-h-screen overflow-y-auto'>
        {posts ? (
          <div>
            {posts.map((post) => (
              <div key={post._id}>
                <Posts post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>No post available</h1>
          </div>
        )}
      </div>
      <div
        id='reviews'
        className='w-11/12 flex justify-center items-center flex-col space-y-5 pt-5  border-y '
      >
        <div className='w-full justify-start items-center'>
          <h1 className='text-5xl text-neutrals-500 font-bold'> Reviews</h1>
        </div>
        <div className='w-full flex flex-col overflow-y-auto '>
          <div className='w-full flex justify-start items-center space-x-5 border-b p-3'>
            <div className='w-60 border-r flex flex-col'>
              <h1>Total Reviews</h1>
              <h1>{reviews.length}</h1>
            </div>
            <div>
              <h1>Average Ratings</h1>
              <Rating
                name='read-only'
                size='large'
                value={averageRating}
                readOnly
                precision={0.1}
                title={`Average Rating: ${averageRating}`}
              />
            </div>
          </div>
          <div className='w-full h-[500px] '>
            <div className='w-full h-[500px] overflow-y-auto overflow-hidden'>
              {reviews.map((rev, index) => (
                <div key={index}>
                  <Review rev={rev} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {userInfo ? (
          <form className='w-full' onSubmit={rateHandler}>
            <div>
              <label>Your rating</label>
              <Rating
                name='half-rating'
                size='large'
                value={parseFloat(rates)}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                precision={0.5}
              />
            </div>
            <div className='w-full flex flex-col justify-center items-center'>
              <label>Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className='mt-2 h-32 p-3 w-full rounded-md text-sm border outline-primary-500 shadow-md'
              ></textarea>
            </div>
            <div className='w-full'>
              <div className='border border-primary-500 flex justify-center items-center w-1/2 hover:bg-primary-500 text-primary-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
                <button className='w-full' type='submit'>
                  Submit
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <h1>Please login to submit Rating!</h1>
            <div className='border border-primary-500 flex justify-center items-center w-1/2 hover:bg-primary-500 text-primary-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
              <a href='/login' className='w-full'>
                Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
