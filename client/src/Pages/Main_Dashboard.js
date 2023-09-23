import React, { useEffect, useReducer, useState } from "react";
import Popup from "reactjs-popup";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";
import FeaturedRestaurant from "../Components/FeaturedRestaurant";
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import FeaturedMenu from "../Components/FeaturedMenu";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, featuredRestaurant: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const MainDashboard = () => {
  const [{ loading, error, featuredRestaurant }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      featuredRestaurant: [],
      error: "",
    }
  );
  const [subscribedMenus, setSubscribedMenus] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/restaurant/getRestaurants");
        if (response.status === 200) {
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
          const subscribedRestaurants = response.data.filter(
            (resto) => resto.isSubscribed === "subscribed"
          );

          const featuredMenus = subscribedRestaurants.flatMap(
            (subscribedResto) =>
              subscribedResto.menu
                .filter((menu) => menu.isFeatured)
                .map((menu) => ({
                  ...menu,
                  owner: subscribedResto.resName,
                }))
          );

          setSubscribedMenus(featuredMenus);
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
    <div className='lg:p-5 md:p-4 sm:p-3 p-2 font-inter'>
      <Helmet>
        <title>DineRetso Digital Marketing Solution</title>
        <meta
          name='description'
          content='Postings of the best restaurants in Nueva
        Vizcaya.'
        />
        <meta
          name='keywords'
          content='restaurants, Nueva Vizcaya, dining, restaurant category, posting'
        />
        <meta name='author' content='DineRetso' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Helmet>
      <div className='w-full space-y-5'>
        <div className='text-neutrals-500 pl-24 py-5'>
          <h2 className='text-2xl font-semibold'>Welcome to</h2>
          <h1 className='text-5xl font-bold text-primary-200'>DineRetso</h1>
          <h3 className='lg:w-4/12'>
            Your Ultimate Destination to Explore, Discover, and Savor the
            Perfect Dining Experience.
          </h3>
        </div>
        <div className='w-full flex flex-col justify-center items-center space-y-3'>
          <div className='flex p-2 border-b border-neutrals-500 w-9/12 justify-center items-center'>
            <h1 className='text-4xl font-semibold text-neutrals-700'>
              FEATURED MENU
            </h1>
          </div>
          <div className='flex flex-row h-96 w-full overflow-x-auto overflow-hidden space-x-10'>
            {subscribedMenus.map((menu, index) => (
              <div
                key={index}
                className='flex justify-center items-center flex-shrink-0 w-1/2 rounded-md'
              >
                <FeaturedMenu fMenu={menu} />
              </div>
            ))}
          </div>
        </div>
        <div className='w-full flex flex-col justify-center items-center space-y-3'>
          <div className='flex p-2 border-b border-neutrals-500 w-9/12 justify-center items-center'>
            <h1 className='text-4xl font-semibold text-neutrals-700'>
              FEATURED RESTAURANTS
            </h1>
          </div>
          <div className='h-96 p-3 w-full flex justify-center items-center'>
            <div className='shadow-md h-96 p-2 w-3/4 object-cover'>
              <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                totalSlides={featuredRestaurant.length}
                isPlaying={true} // Enable automatic sliding
                interval={3000} // Set the interval in milliseconds (e.g., 3 seconds)
              >
                <div className='flex justify-center w-full'>
                  <Slider style={{ width: "100%" }}>
                    {featuredRestaurant
                      .filter((resto) => resto.isSubscribed === "subscribed")
                      .map((subscribedResto, index) => (
                        <Slide key={subscribedResto._id} index={index}>
                          <div className='flex justify-center h-auto p-2 w-full'>
                            <FeaturedRestaurant fResto={subscribedResto} />
                          </div>
                        </Slide>
                      ))}
                  </Slider>
                </div>
              </CarouselProvider>
            </div>
          </div>
        </div>
        <div>
          <h1>Here is Posting</h1>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
