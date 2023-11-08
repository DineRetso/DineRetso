import React, { useEffect, useReducer, useState } from "react";

import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";
import FeaturedRestaurant from "../Components/FeaturedRestaurant";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FeaturedMenu from "../Components/FeaturedMenu";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

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
function shuffleArray(array) {
  array = array.slice(0, 20); // Keep only the first 20 items
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getRandomFeaturedRestaurants(featuredRestaurants, count) {
  const shuffledRestaurants = featuredRestaurants
    .filter((resto) => resto.isSubscribed === "subscribed")
    .sort(() => 0.5 - Math.random());

  return shuffledRestaurants.slice(0, count);
}
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
  const [randomFeaturedRestaurants, setRandomFeaturedRestaurants] = useState(
    []
  );
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState("");
  const navigate = useNavigate();
  const source = "web";

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/restaurant/getFeaturedResto");
        const posting = await axios.get("/api/restaurant/getPosting");
        if (response.status === 200) {
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
          const subscribedRestaurants = response.data.filter(
            (resto) => resto.isSubscribed === "subscribed"
          );
          const featuredMenus = subscribedRestaurants.flatMap(
            (subscribedResto) =>
              subscribedResto.menu
                .filter((menu) => menu.isAvailable === true)
                .map((menu) => ({
                  ...menu,
                  owner: subscribedResto.resName,
                }))
          );
          setSubscribedMenus(shuffleArray(featuredMenus));
          setRandomFeaturedRestaurants(
            getRandomFeaturedRestaurants(subscribedRestaurants, 10)
          );
        } else {
          const errorMessage =
            response.data.message || "An unexpected error occurred.";
          dispatch({ type: "FETCH_FAIL", payload: errorMessage });
          toast.error(errorMessage);
        }

        if (posting) {
          const sortedPosts = posting.data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          setPosts(sortedPosts);
          setPostLoading(false);
        } else {
          setPostError("No post available.");
          setPostLoading(false);
        }
      } catch (error) {
        setPostLoading(false);
        dispatch({
          type: "FETCH_FAIL",
          payload: "An unexpected error occurred.",
        });
        toast.error("An unexpected error occurred.");
      }
    };

    fetchRestaurant();
  }, [setPosts]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  return (
    <div className='font-inter'>
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
        <div>
          <img
            src='../Dashboardimg.png'
            alt='DineRetso dashboard'
            className='w-full lg:-mt-32 sm:h-screen h-auto object-cover'
          />
        </div>
        <div className='w-full flex flex-col justify-center items-center z-50'>
          <div className='flex p-2 border-b border-neutrals-500 sm:w-5/6 w-[97%] justify-center items-center mb-2'>
            <h1 className='lg:text-4xl md:text-2xl text-xl font-semibold text-neutrals-700'>
              FEATURED MENU
            </h1>
          </div>

          <div className=' h-full p-2 sm:w-3/4 w-[97%] object-cover'>
            <Carousel
              autoPlay={true}
              interval={3000}
              showArrows={false}
              showStatus={true}
              showIndicators={true}
              infiniteLoop={true}
            >
              {subscribedMenus.map((menu, index) => (
                <div key={index} className='rounded-md'>
                  <FeaturedMenu fMenu={menu} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        <div className='w-full flex flex-col justify-center items-center space-y-3'>
          <div className='flex p-2 border-b border-neutrals-500 sm:w-5/6 w-[97%] justify-center items-center'>
            <h1 className='lg:text-4xl md:text-2xl text-xl font-semibold text-neutrals-700'>
              FEATURED RESTAURANTS
            </h1>
          </div>
          <div className='sm:w-5/6 w-[97%] sm:h-96 overflow-x-auto overflow-y-hidden bg-orange-100'>
            <div className='w-full p-3 justify-start items-center grid grid-flow-col'>
              {randomFeaturedRestaurants.map((randomResto, index) => (
                <div key={index} className='flex justify-center p-2 '>
                  <FeaturedRestaurant fResto={randomResto} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full p-5 overflow-hidden flex justify-center items-center flex-col'>
          <div className='flex p-2 border-b border-neutrals-500 sm:w-5/6 w-[97%] justify-center items-center'>
            <h1 className='lg:text-4xl md:text-2xl text-xl font-semibold text-neutrals-700'>
              DINING DISCOVERIES
            </h1>
          </div>
          <div className='w-full max-h-[600px] overflow-y-auto flex justify-center'>
            {postLoading ? (
              <div className='flex items-center justify-center h-full'>
                <LoadingSpinner />
              </div>
            ) : postError ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-red-600 text-lg'>{postError}</div>
              </div>
            ) : (
              <div className='flex lg:w-9/12 w-full flex-col space-y-5 lg:px-20 md:px-16 sm:px-12 px-2'>
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className='flex flex-col w-full border shadow-lg p-4 justify-center items-center'
                  >
                    <div className='w-full flex justify-center'>
                      <h1 className='text-2xl text-orange-500 font-bold text-center mb-3'>
                        {post.title}
                      </h1>
                    </div>
                    <div className='w-full flex justify-center'>
                      <div className='grid sm:grid-cols-3 grid-cols-2 w-full p-2 sm:gap-5 gap-2 overflow-y-auto'>
                        {post.video && (
                          <div className='sm:col-span-2'>
                            <video
                              src={post.video.secure_url}
                              alt='Uploaded Video'
                              controls
                              className='w-full rounded-lg shadow-md'
                            ></video>
                          </div>
                        )}
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.secure_url}
                            alt={`post`}
                            className='w-full h-auto rounded-lg'
                          />
                        ))}
                      </div>
                    </div>
                    <div className='w-full p-2'>
                      <h2 className='sm:text-2xl text-lg text-orange-500 font-bold'>
                        {post.resName}
                      </h2>
                      <div className='text-orange-500 border-r sm:text-xl text-sm'>
                        {formatDate(post.createdAt)}
                      </div>

                      <div
                        dangerouslySetInnerHTML={{ __html: post.description }}
                        className='text-justify text-neutrals-500 mt-2 sm:text-xl text-sm'
                      />
                      <div className='w-full flex justify-center items-center'>
                        <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all w-32'>
                          <button
                            className='w-full'
                            onClick={() =>
                              navigate(`/ViewRestoPost/${post._id}/${source}`)
                            }
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
