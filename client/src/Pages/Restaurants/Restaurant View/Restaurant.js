import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, restaurant: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function Restaurant() {
  const [{ loading, error, restaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    restaurant: [],
    error: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/restaurant/getRestaurants");
        if (response.status === 200) {
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        } else {
          const errorMessage =
            response.data.message || "An unexpected error occurred.";
          dispatch({ type: "FETCH_FAIL", payload: errorMessage });
          toast.error(errorMessage);
        }
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "An unexpected error occurred.",
        });
        toast.error("An unexpected error occurred.");
      }
    };

    fetchRestaurant();
  }, []);
  return (
    <div className='w-full p-10 font-inter bg-neutrals-200'>
      <Helmet>
        <title>Restaurants Available in Nueva Vizcaya</title>
        <meta
          name='description'
          content='Discover the best restaurants in Nueva
          Vizcaya.'
        />
        <meta
          name='keywords'
          content='restaurants, Nueva Vizcaya, dining, restaurant category'
        />
        <meta name='author' content='DineRetso' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Helmet>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='flex justify-center flex-col items-center space-y-4'>
          <div className='border-b border-neutrals-400 lg:p-5 md:p-4 p-2'>
            <h1 className='lg:font-bold md:font-bold font-semibold lg:text-5xl md:text-5xl sm:text-4xl text-3xl'>
              Restaurant Categories
            </h1>
          </div>
          <div
            className='flex lg:flex-row md:flex-row flex-col w-3/4 lg:space-x-5 md:space-x-3 space-x-0 
              lg:space-y-0 md:space-y-0 space-y-2 justify-center items-center'
          >
            <Link to={"/Restaurant/famous"}>
              <div className='lg:h-80 lg:w-80 h-60 w-60 border bg-red-200 rounded-md flex justify-center items-center'>
                <h2>Famous Restaurant</h2>
              </div>
            </Link>
            <Link to={"/Restaurant/local"}>
              <div className='lg:h-80 lg:w-80 h-60 w-60 border bg-red-200 rounded-md flex justify-center items-center'>
                <h2>Local Restaurant</h2>
              </div>
            </Link>
            <Link to={"/Restaurant/unique"}>
              <div className='lg:h-80 lg:w-80 h-60 w-60 border bg-red-200 rounded-md flex justify-center items-center'>
                <h2>Unique Restaurant</h2>
              </div>
            </Link>
          </div>
          <div className='w-3/4 pt-5'>
            <h1 className='text-3xl font-semibold mb-10'>
              Featured Restaurants
            </h1>
            {restaurant
              .filter((resto) => resto.isSubscribed === "subscribed")
              .map((subscribedResto) => (
                <div
                  key={subscribedResto._id}
                  className='rounded flex lg:flex-row md:flex-row flex-col justify-center items-center shadow-lg w-full'
                >
                  <div className='flex justify-center items-center bg-cover lg:w-1/2 w-full max-h-80'>
                    <Link
                      to={`/Restaurant/${subscribedResto.resName}/${subscribedResto._id}`}
                    >
                      <img
                        src={subscribedResto.profileImage}
                        alt={subscribedResto.resName}
                        className='w-auto h-60'
                      />
                    </Link>
                  </div>
                  <div className='lg:w-3/4 md:w-3/4 sm:w-10/12 w-full'>
                    <h1 className='text-xl font-semibold'>
                      {subscribedResto.resName}
                    </h1>
                    <h1>{subscribedResto.phoneNo}</h1>
                    <h1>{subscribedResto.category}</h1>
                    <h1>{subscribedResto.address}</h1>
                    <div className='flex flex-col'>
                      <p>Social Media:</p>
                      <div className='flex flex-row space-x-2 text-2xl'>
                        <a
                          href={subscribedResto.fbLink}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <img
                            src='../facebook.png'
                            alt='Facebook'
                            width='32'
                            height='32'
                          />
                        </a>
                        <img
                          src='../instagram.png'
                          alt='Facebook'
                          width='32'
                          height='32'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
