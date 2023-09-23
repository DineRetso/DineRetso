import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Components/LoadingSpinner";
import AddMenuItem from "../../Components/Owner/AddMenuItem";
import { Rating } from "@mui/material";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [status, setStatus] = useState("");

  const [{ loading, error, myRestaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    myRestaurant: [],
    error: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `/api/users/get-user/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setStatus(data.subscriptionStatus);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error");
        }
      }
    };
    fetchUser();
  }, [userInfo._id, userInfo.token]);
  console.log(status);
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/owner/restaurant/${userInfo.fName}/${userInfo.myRestaurant}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
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
  }, [userInfo.fName, userInfo.token, userInfo.myRestaurant]);
  const handleAddMenuItem = async (menuItemData) => {
    try {
      const response = await axios.post(
        `/api/owner/restaurant/add-menu-item/${userInfo.myRestaurant}`,
        menuItemData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        const updatedMenu = [...myRestaurant.menu, response.data];

        // Update the state with the new menu item
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { ...myRestaurant, menu: updatedMenu },
        });

        // Close the AddMenuItem component
        toast.success("New menu added to your restaurant!");
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
  const deleteMenu = async (menuId, imagePublicId) => {
    if (window.confirm("Menu will be deleted?")) {
      try {
        const response = await axios.delete(
          `/api/owner/${myRestaurant._id}/${menuId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.status === 200) {
          const updatedMenu = myRestaurant.menu.filter(
            (menuItem) => menuItem._id !== menuId
          );
          dispatch({
            type: "FETCH_SUCCESS",
            payload: { ...myRestaurant, menu: updatedMenu },
          });
          if (imagePublicId) {
            // If there is an imagePublicId, make an HTTP DELETE request to delete the image
            const imageDeletionResponse = await axios.delete(
              `/api/image/${imagePublicId}`,
              {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              }
            );

            if (imageDeletionResponse.status === 200) {
              toast.success("Menu item and image deleted successfully");
            } else {
              toast.error("Image deletion failed.");
            }
          } else {
            toast.success("Menu item deleted successfully");
          }
        } else {
          toast.error("Menu deletion failed.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the menu item.");
      }
    }
  };
  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    // Filter the menu items based on the search query
    if (myRestaurant && myRestaurant.menu) {
      const filteredItems = myRestaurant.menu.filter((menuItem) =>
        menuItem.menuName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMenu(filteredItems);
    }
  };
  useEffect(() => {
    if (myRestaurant && myRestaurant.menu) {
      setFilteredMenu(myRestaurant.menu);
    }
  }, [myRestaurant]);

  return (
    <div className='ml-0 lg:ml-72 p-10 font-inter'>
      <div className='flex flex-col justify-center items-center space-y-5'>
        <div className='flex justify-center items-center'>
          <h1 className='text-2xl font-semibold'>MENU</h1>
        </div>
        <div className='flex shadow-md w-full h-20 p-3'>
          <div className='flex justify-start items-center w-1/4 border-r border-neutrals-700'>
            <i className='material-icons text-primary-500 text-4xl'>add</i>
            <div className='w-full flex justify-center items-center text-neutrals-500 text-xl'>
              {showAddMenu ? (
                status === "subscribed" ? (
                  <AddMenuItem
                    onAddMenuItem={handleAddMenuItem}
                    onClose={() => setShowAddMenu(false)}
                  />
                ) : (
                  <div className='w-auto bg-OrangeDefault rounded-md p-1 flex justify-center items-center'>
                    <button
                      onClick={() =>
                        toast.info("Please subscribe for full access.")
                      }
                    >
                      Add Menu
                    </button>
                  </div>
                )
              ) : (
                <div className='w-auto bg-OrangeDefault rounded-md p-1 flex justify-center items-center'>
                  <button onClick={() => setShowAddMenu(true)}>Add Menu</button>
                </div>
              )}
            </div>
          </div>
          <div className='w-3/4 flex justify-start items-center px-5'>
            <i className='material-icons text-4xl text-neutrals-500'>search</i>
            <input
              className='w-full h-full'
              placeholder='Search here...'
              value={searchQuery}
              onChange={handleSearchInputChange}
            ></input>
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
                          className='w-80 h-48 rounded-md object-cover'
                        />
                      ) : (
                        <div>
                          <img
                            className='w-80 h-48 rounded-md'
                            src='/dineLogo.jpg'
                            alt='menuImage'
                          />
                        </div>
                      )}
                    </div>
                    <div className='flex justify-center items-start flex-col w-full shadow-lg h-40 space-y-2 pl-7'>
                      <div>
                        <p className='text-2xl text-neutrals-700 font-semibold'>
                          {menuItem.menuName}
                        </p>
                      </div>
                      <div>
                        <p>P {menuItem.price}</p>
                      </div>
                      <div>
                        <Rating name='read-only' defaultValue={3.5} readOnly />
                      </div>
                      <div className='flex items-end justify-end w-full space-x-2 px-2'>
                        <div className='border border-primary-500 flex justify-center items-center w-auto hover:bg-primary-500 text-primary-500 hover:text-TextColor transition-all duration-300 p-1 rounded-md'>
                          <button>Edit</button>
                        </div>
                        <div className='border border-red-200 flex justify-center items-center w-auto hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-1 rounded-md'>
                          <button
                            onClick={() =>
                              deleteMenu(menuItem._id, menuItem.imagePublicId)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No Menu Available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
