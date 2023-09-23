import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

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

  //FETCH RESTAURANT
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/restaurant/${params.resName}/${params._id}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        console.log("Response data:", response.data);
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
  }, [params.resName, params._id]);
  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <div className='head-container w-full h-96'>
        <div className='h-96 w-full'>
          <img
            className='h-full w-full object-cover'
            src={Restaurant.bgPhoto}
            alt='Restaurant Background'
          />
        </div>
        <div className='mt-[-200px]'>
          <h1 className='text-5xl font-bold text-primary-700'>
            {Restaurant.resName}
          </h1>
        </div>
        <div>{Restaurant.description}</div>
      </div>
      <div>{Restaurant.resName}</div>
      <div className='flex w-full space-x-5 justify-center'>
        <a href='#Menu'>Menu</a>
        <a href='#Blog Posts'>Blog Posts</a>
        <a href='#Reviews'>Reviews</a>
      </div>
    </div>
  );
}
