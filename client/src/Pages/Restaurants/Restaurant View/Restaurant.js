import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
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
  const [cat, setCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const source = "web";

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/restaurant/getRestaurants");
        if (response.status === 200) {
          const allRestaurants = response.data;
          // Sort restaurants - subscribed first, then non-subscribed
          const sortedRestaurants = allRestaurants.sort((a, b) => {
            if (
              a.isSubscribed === "subscribed" &&
              b.isSubscribed !== "subscribed"
            ) {
              return -1;
            } else if (
              a.isSubscribed !== "subscribed" &&
              b.isSubscribed === "subscribed"
            ) {
              return 1;
            } else {
              return 0;
            }
          });
          dispatch({ type: "FETCH_SUCCESS", payload: sortedRestaurants });
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
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value); // Update search input value
  };

  return (
    <div className='w-full font-inter '>
      <Helmet>
        <title>Restaurants Available in Nueva Vizcaya</title>
        <meta
          name='description'
          content='Discover the best restaurants in Nueva
          Vizcaya.'
        />
        <meta
          name='keywords'
          content='restaurants, Nueva Vizcaya, dining, DineRetso'
        />
        <meta name='author' content='DineRetso' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Helmet>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='flex justify-center flex-col items-center space-y-4 mt-[280px]'>
          <div>
            <img
              src='../RestaurantImg.png'
              alt='DineRetso dashboard'
              className='absolute inset-0 h-[400px] w-full object-cover'
            />
          </div>
          <div className='sticky w-full top-[103px] flex shadow-md h-20 p-3 z-40 bg-orange-500 bg-opacity-75'>
            <div className='w-3/4 flex justify-start items-center px-5'>
              <i className='material-icons text-4xl '>search</i>
              <input
                className='w-full h-full px-2 rounded-md'
                placeholder='Search here...'
                value={searchTerm}
                onChange={handleSearchInputChange}
              ></input>
            </div>
            <div className='w-1/4 flex justify-center items-center rounded-r-lg'>
              <select
                className='p-3 w-full h-full rounded-md text-sm border outline-primary-500 shadow-md'
                id='category'
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                <option value='All'>All</option>
                <option value='Famous'>Famous</option>
                <option value='Local'>Local</option>
                <option value='Unique'>Unique</option>
              </select>
            </div>
          </div>

          <div className='Restaurant-Content flex justify-center items-center flex-col p-5 w-full'>
            <h1 className='text-3xl font-semibold mb-10'>{cat} Restaurants</h1>
            <div className='grid w-full lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-10'>
              {restaurant
                .filter((resto) => {
                  return (
                    (cat === "All" || resto.category === cat) &&
                    (searchTerm === "" ||
                      resto.resName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      resto.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      resto.phoneNo
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      resto.menu.some((menuItem) =>
                        menuItem.menuName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) ||
                      resto.menu.some((menuItem) =>
                        menuItem.classification
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ))
                  );
                })
                .map((subscribedResto) => (
                  <div
                    key={subscribedResto._id}
                    className='rounded flex justify-start items-center shadow-lg w-auto'
                  >
                    <div className='flex justify-start items-start bg-cover max-h-80 w-5/12'>
                      <Link
                        to={`/Restaurant/${subscribedResto.resName}/${subscribedResto._id}/${source}`}
                      >
                        <img
                          src={subscribedResto.profileImage}
                          alt={subscribedResto.resName}
                          className='w-auto h-60 rounded-lg'
                        />
                      </Link>
                    </div>
                    <div className='pl-5 w-full'>
                      <div className='w-full border-b border-b-red-700 mb-2'>
                        <h1 className='text-xl font-semibold'>
                          {subscribedResto.resName}
                        </h1>
                      </div>
                      <div className='pl-5'>
                        <h1>{subscribedResto.phoneNo}</h1>
                        <h1>{subscribedResto.category}</h1>
                        <h1>{subscribedResto.address}</h1>
                        <div className='flex flex-col'>
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
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
