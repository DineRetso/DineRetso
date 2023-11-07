import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
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
  const [sortRatings, setSortRatings] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
          let sortedMenus = allMenus;
          if (sortRatings !== "All") {
            sortedMenus = allMenus.filter((menuItem) => {
              const avgRating = calculateTotalRatings(menuItem);
              return avgRating === parseFloat(sortRatings);
            });
          }
          if (sortRatings === "noreview") {
            sortedMenus = allMenus.filter(
              (menuItem) => menuItem.menuReview.length === 0
            );
          } else if (sortRatings === "5") {
            sortedMenus = allMenus.filter(
              (menuItem) => Math.round(calculateSorting(menuItem)) === 5
            );
          } else if (sortRatings === "4") {
            sortedMenus = allMenus.filter(
              (menuItem) => Math.round(calculateSorting(menuItem)) === 4
            );
          } else if (sortRatings === "3") {
            sortedMenus = allMenus.filter(
              (menuItem) => Math.round(calculateSorting(menuItem)) === 3
            );
          } else if (sortRatings === "2") {
            sortedMenus = allMenus.filter(
              (menuItem) => Math.round(calculateSorting(menuItem)) === 2
            );
          } else if (sortRatings === "2") {
            sortedMenus = filteredMenus.filter(
              (menuItem) => Math.round(calculateSorting(menuItem)) === 1
            );
          }
          const filteredMenus = sortedMenus.filter((menuItem) => {
            const searchLower = searchQuery.toLowerCase();
            return (
              searchQuery === "" ||
              menuItem.menuName.toLowerCase().includes(searchLower) ||
              menuItem.description.toLowerCase().includes(searchLower) ||
              menuItem.price.toString().includes(searchLower) ||
              menuItem.classification.toLowerCase().includes(searchLower)
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
  }, [category, searchQuery, sortRatings]);

  const calculateTotalRatings = (menu) => {
    let totalRatings = 0;
    let len = 0;
    if (menu.menuReview && menu.menuReview.length > 0) {
      const approvedReviews = menu.menuReview.filter(
        (review) => review.status === "approved"
      );
      approvedReviews.forEach((review) => {
        totalRatings += review.rating;
        len++;
      });
    }
    const averageRating = len > 0 ? totalRatings / len : 0;

    return averageRating;
  };
  const calculateSorting = (menu) => {
    let totalRatings = 0;
    let len = 0;
    menu.menuReview.forEach((review) => {
      if (review.status === "approved") {
        totalRatings += review.rating;
        len++;
      }
    });

    if (len === 0) {
      return 0;
    }

    const averageRating = totalRatings / len;
    return Math.round(averageRating);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenu = menu.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(menu.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className=' w-full font-inter'>
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
      <div className='flex justify-center flex-col items-center space-y-4 sm:mt-[280px]'>
        <div className='sm:block hidden'>
          <img
            src='../BGMenus.png'
            alt='DineRetso dashboard'
            className='absolute inset-0 h-[400px] w-full object-cover'
          />
        </div>
        <div className='sticky w-full sm:top-[87px] top-[70px] flex flex-row  justify-center items-center sm:h-20 h-14 border-b bg-TextColor z-10 sm:px-2 px-1'>
          <div className=' h-full flex justify-center items-center border-r sm:p-2 p-1 text-neutrals-500'>
            <select
              className='w-auto h-full outline-none'
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
          <div className='w-full h-full sm:p-2 p-1 flex justify-center items-center'>
            <div className='sm:w-16 w-auto bg-orange-200 h-full flex justify-center items-center rounded-l-lg'>
              <i className='material-icons text-TextColor text-3xl '>search</i>
            </div>
            <input
              className='sm:p-2 p-1 w-full h-full outline-none border-b border-orange-500'
              placeholder='Search here...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className=' h-full flex justify-center items-center border-r sm:p-2 p-1 text-neutrals-500'>
              <select
                className='w-auto h-full outline-none'
                id='category'
                value={sortRatings}
                onChange={(e) => setSortRatings(e.target.value)}
              >
                <option value='All'>Ratings</option>
                <option value='5'>5 Star</option>
                <option value='4'>4 Star</option>
                <option value='3'>3 Star</option>
                <option value='2'>2 Star</option>
                <option value='1'>1 Star</option>
                <option value='noreview'>No review</option>
              </select>
            </div>
          </div>
        </div>
        <div className=' w-full flex flex-col justify-start items-center sm:px-10 px-2 pt-5 mt-14'>
          <div className='flex w-full justify-center'>
            <h1 className='text-3xl font-bold text-orange-500 '>MENU</h1>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className='w-full grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2'>
              {currentMenu.map((menuItem) => (
                <div
                  key={menuItem._id}
                  className='p-2 border flex flex-col justify-start items-center shadow-xl drop-shadow-xl rounded-lg'
                >
                  <Link to={`/Menu/${menuItem._id}`}>
                    <div className='flex justify-center items-center w-full'>
                      {menuItem.menuImage ? (
                        <img
                          className='h-40 rounded-lg object-cover'
                          src={menuItem.menuImage}
                          alt='menu'
                        />
                      ) : (
                        <img
                          className='h-40 rounded-lg object-cover'
                          src='/Logo.png'
                          alt='menu'
                        />
                      )}
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
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='w-full flex justify-center items-center space-x-4 mt-3'>
          <button
            className='px-4 py-2 bg-orange-500 text-white rounded-lg'
            onClick={prevPage}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='px-4 py-2 bg-orange-500 text-white rounded-lg'
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
