import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Components/LoadingSpinner";
import AddMenuItem from "../../Components/Owner/AddMenuItem";
import { Rating } from "@mui/material";
import EditMenuItem from "../../Components/Owner/EditMenuItem";
import { getError } from "../../utils";

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

export default function OwnerMenu() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showSorting, setShowSorting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [userData, setUserData] = useState(null);
  const [available, setAvailable] = useState("All");
  const falseStatus = false;
  const trueStatus = true;

  const showSort = () => {
    setShowSorting(!showSorting);
  };

  const [{ loading, error, myRestaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    myRestaurant: [],
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(
          `/api/users/get-user/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setStatus(userResponse.data.subscriptionStatus);
        setUserData(userResponse.data);
        // Fetch restaurant data
        dispatch({ type: "FETCH_REQUEST" });
        const restaurantResponse = await axios.get(
          `/api/owner/restaurant/${userResponse.data.fName}/${userResponse.data.myRestaurant}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: restaurantResponse.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };

    fetchData();
  }, [
    userInfo._id,
    userInfo.fName,
    userInfo.myRestaurant,
    userInfo.token,
    dispatch,
    setStatus,
  ]);

  const handleAddMenuItem = async (menuItemData) => {
    try {
      const response = await axios.post(
        `/api/owner/restaurant/add-menu-item/${userData.myRestaurant}`,
        menuItemData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        const updatedMenu = [...myRestaurant.menu, response.data];
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { ...myRestaurant, menu: updatedMenu },
        });
        toast.success("New menu added to your restaurant!");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };
  const handleEditMenuItem = async (editItemData) => {
    try {
      const response = await axios.post(
        `/api/owner/restaurant/edit-menu-item/${userData.myRestaurant}`,
        editItemData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        const updatedMenu = myRestaurant.menu.map((menuItem) =>
          menuItem._id === editItemData._id
            ? { ...menuItem, ...editItemData }
            : menuItem
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { ...myRestaurant, menu: updatedMenu },
        });
        toast.success("Menu item updated successfully");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };
  const hideMenu = async (menuData, status) => {
    try {
      const response = await axios.put(
        `/api/owner/${myRestaurant._id}/${menuData._id}/${status}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        const updatedMenu = myRestaurant.menu.map((menuItem) =>
          menuItem._id === menuData._id
            ? { ...menuItem, isAvailable: status }
            : menuItem
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { ...myRestaurant, menu: updatedMenu },
        });
      } else {
        toast.error("Hiding failed.");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };
  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    // Filter the menu items based on the search query
    if (myRestaurant && myRestaurant.menu) {
      const filteredItems = myRestaurant.menu.filter(
        (menuItem) =>
          menuItem.menuName.toLowerCase().includes(value.toLowerCase()) ||
          menuItem.description.toLowerCase().includes(value.toLowerCase()) ||
          menuItem.price.toString().includes(value.toLowerCase())
      );
      setFilteredMenu(filteredItems);
    }
  };

  //sorting
  const handleCategorySelection = (classification) => {
    setSelectedCategory(classification);
    applyFilters(classification, selectedRating, available);
  };

  const handleRatingSelection = (rating) => {
    setSelectedRating(rating);
    applyFilters(selectedCategory, rating, available);
  };
  const handleAvailability = (avail) => {
    setAvailable(avail);
    applyFilters(selectedCategory, selectedRating, avail);
  };

  useEffect(() => {
    if (myRestaurant && myRestaurant.menu) {
      setFilteredMenu(myRestaurant.menu);
    }
  }, [myRestaurant, myRestaurant.menu]);
  const handleEditMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setShowEditMenu(true);
  };
  const applyFilters = (classification, rating, available) => {
    if (myRestaurant && myRestaurant.menu) {
      let filteredItems = myRestaurant.menu;
      //availability
      if (available !== "All") {
        if (available === "true") {
          filteredItems = filteredItems.filter(
            (menuItem) => menuItem.isAvailable
          );
        } else if (available === "false") {
          filteredItems = filteredItems.filter(
            (menuItem) => !menuItem.isAvailable
          );
        }
      }
      //category
      if (classification !== "All") {
        filteredItems = filteredItems.filter(
          (menuItem) => menuItem.classification === classification
        );
      }
      //rating
      if (rating !== "All") {
        filteredItems = filteredItems.filter((menuItem) => {
          const averageRating =
            menuItem.menuReview && menuItem.menuReview.length > 0
              ? menuItem.menuReview.reduce(
                  (totalRating, review) => totalRating + review.rating,
                  0
                ) / menuItem.menuReview.length
              : 0;
          const floorRating = Math.floor(averageRating);
          return floorRating >= rating && floorRating < rating + 1;
        });
      }
      setFilteredMenu(filteredItems);
    }
  };

  return (
    <div className='ml-0 lg:ml-72 md:ml-72 sm:ml-72 lg:p-10 md:p-8 sm:p-5 p-2 font-inter '>
      <div className='flex flex-col justify-center items-center space-y-5'>
        <div className='flex justify-center items-center'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl font-semibold text-orange-500'>
            MENU
          </h1>
        </div>
        <div className='sticky top-0 flex shadow-md w-full lg:h-20 md:h-16 h-14 lg:p-3 md:p-2 p-1 bg-TextColor flex-row justify-between items-center transition-all '>
          <div className='flex flex-row justify-start items-end w-full h-full'>
            <div className='flex justify-start items-center w-auto border-r border-neutrals-700'>
              <i className='material-icons text-orange-500 lg:text-4xl md:text-3xl sm:text-2xl'>
                add
              </i>

              <div className='w-full flex justify-center items-end lg:text-2xl md:text-xl sm:text-xl text-lg'>
                {showAddMenu ? (
                  status === "subscribed" ? (
                    <AddMenuItem
                      onAddMenuItem={handleAddMenuItem}
                      onClose={() => setShowAddMenu(false)}
                    />
                  ) : (
                    <div className='w-auto text-neutrals-500 bg-OrangeDefault rounded-md p-1 flex justify-center items-center'>
                      <button
                        onClick={() =>
                          toast.info("Please subscribe for full access.")
                        }
                      >
                        Add
                      </button>
                    </div>
                  )
                ) : (
                  <div className='w-auto bg-OrangeDefault rounded-md p-1 flex justify-center items-center text-neutrals-500 '>
                    <button onClick={() => setShowAddMenu(true)}>Add</button>
                  </div>
                )}
              </div>
            </div>
            <div className='w-auto flex justify-start items-center lg:px-2 md:px-2 px-1'>
              <i className='material-icons lg:text-4xl md:text-3xl sm:text-2xl text-orange-500'>
                search
              </i>
              <input
                className='w-full h-full px-2 lg:text-2xl md:text-xl sm:text-xl text-lg border-b outline-none border-orange-500'
                placeholder='Search here...'
                value={searchQuery}
                onChange={handleSearchInputChange}
              ></input>
            </div>
          </div>
          <div className='flex flex-row'>
            <div
              className='w-auto flex justify-center items-center bg-orange-500 lg:p-2 md:p-2 p-1 rounded-r-lg'
              onClick={showSort}
            >
              <i className='material-icons text-4xl text-TextColor'>sort</i>
            </div>
          </div>
          {showSorting && (
            <div className='fixed flex flex-col right-10 lg:top-40 md:top-40 sm:top-40 top-52 max-w-[400px] h-[400px] bg-neutrals-200 rounded-lg p-5'>
              <div className='border p-3'>
                <h1 className='p-2 mb-2'>By Category</h1>
                <div className='grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto'>
                  <div
                    className={`flex justify-center items-center bg-neutrals-400 rounded-md p-2 ${
                      selectedCategory === "All"
                        ? "bg-orange-500 text-TextColor"
                        : ""
                    }`}
                    onClick={() => handleCategorySelection("All")}
                  >
                    All
                  </div>
                  {myRestaurant &&
                    myRestaurant.menu &&
                    [
                      ...new Set(
                        myRestaurant.menu.map(
                          (menuItem) => menuItem.classification
                        )
                      ),
                    ].map((classification, index) => (
                      <div
                        key={index}
                        className={`flex justify-center items-center bg-neutrals-400 rounded-md p-2 ${
                          selectedCategory === classification
                            ? "bg-orange-500 text-TextColor"
                            : ""
                        }`}
                        onClick={() => handleCategorySelection(classification)}
                      >
                        {classification}
                      </div>
                    ))}
                </div>
              </div>
              <div className='border p-3'>
                <h1 className='p-2 mb-2'>By Ratings</h1>

                <div className='grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto'>
                  <div
                    className={`flex justify-center items-center bg-neutrals-400 rounded-md p-2 ${
                      selectedRating === "All"
                        ? "bg-orange-500 text-TextColor"
                        : ""
                    }`}
                    onClick={() => handleRatingSelection("All")}
                  >
                    All
                  </div>
                  {[5, 4, 3, 2, 1].map((rating, index) => (
                    <div
                      key={index}
                      className={`flex justify-center items-center bg-neutrals-400 rounded-md p-2 ${
                        selectedRating === rating
                          ? "bg-orange-500 text-TextColor"
                          : ""
                      }`}
                      onClick={() => handleRatingSelection(rating)}
                    >
                      {rating} Stars
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='w-full flex justify-center items-center space-x-4 p-2 bg-TextColor'>
          <div
            className={`${
              available === "All"
                ? "bg-orange-500 text-TextColor border flex justify-center items-center w-24 p-2 rounded-md "
                : "border border-orange-500 flex justify-center items-center w-24 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md "
            }
          `}
          >
            <button
              className='rounded-xl w-full'
              value='All'
              onClick={(e) => handleAvailability(e.target.value)}
            >
              All
            </button>
          </div>
          <div
            className={`${
              available === "true"
                ? "bg-orange-500 text-TextColor border flex justify-center items-center w-24 p-2 rounded-md"
                : "border border-orange-500 flex justify-center items-center w-24 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md"
            }
        `}
          >
            <button
              className='rounded-xl w-full'
              value='true'
              onClick={(e) => handleAvailability(e.target.value)}
            >
              Shown
            </button>
          </div>
          <div
            className={`${
              available === "false"
                ? "bg-orange-500 text-TextColor border flex justify-center items-center w-24 p-2 rounded-md"
                : "border border-orange-500 flex justify-center items-center w-24 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md"
            }
        `}
          >
            {" "}
            <button
              className='rounded-xl w-full'
              value='false'
              onClick={(e) => handleAvailability(e.target.value)}
            >
              Hidden
            </button>
          </div>
        </div>
        <div className='menu-container'>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
              {filteredMenu.length > 0 ? (
                filteredMenu.map((menuItem, index) => (
                  <div
                    key={index}
                    className='flex flex-row items-center p-4 rounded-lg w-full'
                  >
                    <div className='shadow-lg'>
                      {menuItem.menuImage ? (
                        <img
                          src={menuItem.menuImage}
                          alt={menuItem.menuName}
                          className='w-64 h-40 sm:h-52 sm:w-96 rounded-md object-cover'
                        />
                      ) : (
                        <div>
                          <img
                            className='w-64 h-40 sm:h-52 sm:w-96 rounded-md'
                            src='/dineLogo.jpg'
                            alt='menuImage'
                          />
                        </div>
                      )}
                    </div>
                    <div className='flex justify-center items-start flex-col w-full shadow-lg h-48 space-y-2 pl-7'>
                      <div>
                        <p className='lg:text-2xl md:text-2xl sm:text-xl text-md text-neutrals-700 font-semibold'>
                          {menuItem.menuName}
                        </p>
                      </div>
                      <div className='lg:text-2xl md:text-md text-sm text-md text-neutrals-700 font-semibold'>
                        <p>P {menuItem.price}</p>
                      </div>
                      <div className='-z-10'>
                        <Rating
                          name='read-only'
                          className={`lg:${"size='large'"}`}
                          value={
                            Array.isArray(menuItem.menuReview) &&
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
                      <div className='flex items-end justify-end w-full space-x-2 px-2'>
                        {status === "subscribed" ? (
                          <div className='border border-orange-500 flex justify-center items-center w-auto hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-1 rounded-md'>
                            <button
                              onClick={() => handleEditMenuItemClick(menuItem)}
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <div className='border border-orange-500 flex justify-center items-center w-auto hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-1 rounded-md'>
                            <button
                              onClick={() =>
                                toast.info("Subscribe for full access!")
                              }
                            >
                              Edit
                            </button>
                          </div>
                        )}
                        {menuItem.isAvailable ? (
                          <div className='border border-orange-700 flex justify-center items-center w-auto hover:bg-orange-700 text-orange-700 hover:text-TextColor transition-all duration-300 p-1 rounded-md'>
                            <button
                              onClick={() => hideMenu(menuItem, falseStatus)}
                            >
                              Hide
                            </button>
                          </div>
                        ) : (
                          <div className='border border-orange-700 flex justify-center items-center w-auto hover:bg-orange-700 text-orange-700 hover:text-TextColor transition-all duration-300 p-1 rounded-md'>
                            <button
                              onClick={() => hideMenu(menuItem, trueStatus)}
                            >
                              Unhide
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-red-200 font-semibold'>
                  No Menu Available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showEditMenu && selectedMenuItem && (
        <EditMenuItem
          onEditMenuItem={handleEditMenuItem}
          onClose={() => setShowEditMenu(false)}
          menu={selectedMenuItem}
        />
      )}
    </div>
  );
}
