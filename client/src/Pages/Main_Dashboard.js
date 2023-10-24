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
              subscribedResto.menu.map((menu) => ({
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
            className='w-full lg:-mt-32 h-auto object-cover'
          />
        </div>
        <div className='w-full flex flex-col justify-center items-center space-y-3 z-50'>
          <div className='flex p-2 border-b border-neutrals-500 w-9/12 justify-center items-center'>
            <h1 className='text-4xl font-semibold text-orange-500'>
              FEATURED MENU
            </h1>
          </div>
          <div className='flex justify-center items-center w-full'>
            <div className='shadow-md p-2 w-3/4 object-cover'>
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
        </div>
        <div className='w-full flex flex-col justify-center items-center space-y-3'>
          <div className='flex p-2 border-b border-neutrals-500 w-9/12 justify-center items-center'>
            <h1 className='text-4xl font-semibold text-neutrals-700'>
              FEATURED RESTAURANTS
            </h1>
          </div>
          <div className='h-96 p-3 w-full flex justify-center items-center'>
            <div className='shadow-md h-96 p-2 w-3/4 object-cover'>
              <Carousel
                autoPlay={false}
                showArrows={true}
                showStatus={true}
                showIndicators={true}
                infiniteLoop={false}
              >
                {randomFeaturedRestaurants.map((randomResto, index) => (
                  <div
                    key={index}
                    className='flex justify-center h-auto p-2 w-full'
                  >
                    <FeaturedRestaurant fResto={randomResto} />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className='w-full p-5 overflow-hidden flex justify-center items-center flex-col'>
          <div className='flex p-2 border-b border-neutrals-500 w-9/12 justify-center items-center'>
            <h1 className='text-4xl font-semibold text-neutrals-700'>
              DINING DISCOVERIES
            </h1>
          </div>
          <div className='w-full  max-h-[500px] overflow-y-auto'>
            {postLoading ? (
              <div className='flex items-center justify-center h-full'>
                <LoadingSpinner />
              </div>
            ) : postError ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-red-600 text-lg'>{postError}</div>
              </div>
            ) : (
              <div className='flex w-full flex-col space-y-5 px-20'>
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className='flex flex-col w-full border shadow-lg p-4  justify-center items-center'
                  >
                    <div className='w-full flex justify-center'>
                      <h1 className='text-2xl text-orange-500 font-bold text-justify'>
                        {post.title}
                      </h1>
                    </div>
                    <div className='w-full flex justify-center'>
                      <div className='grid grid-cols-3 w-full p-2 overflow-y-auto'>
                        {post.video && (
                          <video
                            src={post.video.secure_url}
                            alt='Uploaded Video'
                            controls
                          ></video>
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
                      <h2 className='text-2xl text-orange-500 font-bold'>
                        {post.resName}
                      </h2>
                      <div className='text-orange-500 border-r'>
                        {formatDate(post.createdAt)}
                      </div>

                      <div
                        dangerouslySetInnerHTML={{ __html: post.description }}
                        className='text-justify text-neutrals-500 mt-2'
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
