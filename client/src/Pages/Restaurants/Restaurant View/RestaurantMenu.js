import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Rating } from "@mui/material";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, menu: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function RestaurantMenu() {
  const [{ loading, error, menu }, dispatch] = useReducer(reducer, {
    loading: true,
    menu: [],
    error: "",
  });
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  function shuffleArray(array) {
    // Create a copy of the original array
    const shuffledArray = [...array];

    // Shuffle the copied array using Fisher-Yates algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/restaurant/getMenus");
        if (response.status === 200) {
          let restaurants = [];
          if (category === "Famous") {
            restaurants = response.data.filter(
              (restaurant) => restaurant.category === "Famous"
            );
          } else if (category === "Unique") {
            restaurants = response.data.filter(
              (restaurant) => restaurant.category === "Unique"
            );
          } else if (category === "Local") {
            restaurants = response.data.filter(
              (restaurant) => restaurant.category === "Local"
            );
          } else {
            restaurants = response.data;
          }
          const subscribedMenus = [];
          const nonSubscribedMenus = [];
          restaurants.forEach((restaurant) => {
            restaurant.menu.forEach((menu) => {
              if (restaurant.isSubscribed === "subscribed") {
                subscribedMenus.push(menu);
              } else {
                nonSubscribedMenus.push(menu);
              }
            });
          });
          const shuffledSubscribedMenus = shuffleArray(subscribedMenus);
          const shuffledNonSubscribedMenus = shuffleArray(nonSubscribedMenus);
          // Sort the menus to show subscribed menus first
          const allMenus = [
            ...shuffledSubscribedMenus,
            ...shuffledNonSubscribedMenus,
          ];
          const filteredMenus = allMenus.filter((menuItem) => {
            return (
              searchQuery === "" ||
              menuItem.menuName.toLowerCase().includes(searchQuery) ||
              menuItem.price.toString().includes(searchQuery) ||
              menuItem.classification.toLowerCase().includes(searchQuery)
            );
          });
          dispatch({ type: "FETCH_SUCCESS", payload: filteredMenus });
        } else {
          const errorMessage =
            response.data.message || "An unexpected error occurred.";
          dispatch({ type: "FETCH_FAIL", payload: errorMessage });
        }
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "An unexpected error occurred.",
        });
      }
    };
    fetchMenu();
  }, [category, searchQuery]);
  const calculateTotalRatings = (menu) => {
    let totalRatings = 0;
    const len = menu.menuReview.length;
    menu.menuReview.forEach((review) => {
      totalRatings += review.rating;
    });
    const averageRating = totalRatings / len;
    return averageRating;
  };

  return (
    <div className='absolute top-0 w-full font-inter'>
      <Helmet>
        <title>Different Menus of DineRetso</title>
        <meta
          name='description'
          content='Discover the best Menus in Nueva
      Vizcaya.'
        />
        <meta
          name='keywords'
          content='restaurants, Nueva Vizcaya, Menus, DineRetso'
        />
        <meta name='author' content='DineRetso' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Helmet>

      <div className='w-full bg-cover'>
        <img
          src='../BGMenus.png'
          alt='DineRetso dashboard'
          className='h-[400px] w-full object-cover'
        />
      </div>
      <div className='w-full flex flex-row justify-center items-center h-20 border'>
        <div className='w-60 h-full flex justify-center items-center'>
          <select
            className='w-60'
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value='All'>All</option>
            <option value='Unique'>Unique</option>
            <option value='Famous'>Famous</option>
            <option value='Local'>Local</option>
          </select>
        </div>
        <div className='w-full h-full p-2 flex justify-center items-center'>
          <input
            className='p-2 w-full h-full'
            placeholder='Search here...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className='w-16 bg-orange-200 h-full flex justify-center items-center rounded-r-lg'>
            <i className='material-icons text-TextColor text-3xl '>search</i>
          </div>
        </div>
      </div>
      <div className=' w-full flex flex-col justify-center px-20 pt-5'>
        <div className='flex w-full justify-center'>
          <h1 className='text-3xl font-bold text-orange-500 '>MENU</h1>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className='w-full grid grid-cols-3 gap-16'>
            {menu.map((menuItem) => (
              <div
                key={menuItem._id}
                className='p-5 border flex flex-col justify-start items-center shadow-xl drop-shadow-xl rounded-lg'
              >
                <div className=''>
                  <img
                    className='w-80 h-60 rounded-lg'
                    src={menuItem.menuImage}
                    alt='menu'
                  />
                </div>
                <div className='w-full justify-start items-center pl-5 pt-2 '>
                  <div className='w-full justify-start items-center border-l border-orange-500 p-2'>
                    <Rating
                      name='read-only'
                      size='medium'
                      value={calculateTotalRatings(menuItem)}
                      precision={0.1}
                      readOnly
                    />
                    <h2 className='text-orange-500 text-xl font-semibold'>
                      {menuItem.menuName}
                    </h2>
                    <p className='text-neutrals-500'>{menuItem.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
