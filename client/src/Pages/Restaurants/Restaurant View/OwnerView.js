import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../../../Store";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";
import AddMenuItem from "../../../Components/Owner/AddMenuItem";

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
export default function OwnerView() {
  const params = useParams();
  const { state } = useContext(Store);
  const [imgLoading, setImgLoading] = useState(null);
  const [status, setStatus] = useState("");
  const [imageId, setImageId] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { userInfo } = state;
  const [activeLink, setActiveLink] = useState("");
  const [{ loading, error, myRestaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    myRestaurant: [],
    error: "",
  });
  const handleNavClick = (sectionId) => {
    setActiveLink(sectionId);
  };
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/owner/restaurant/${params.owner}/${params.restaurantID}`,
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
  }, [params.owner, userInfo.token, params.restaurantID]);

  const uploadCoverPhoto = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setImgLoading(true);
      const { data } = await axios.post(
        `/api/image/${params.restaurantID}`,
        bodyFormData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setImgLoading(false);
      setImageId(data.public_id);
      toast.info("Cover Photo Uploaded!");
      navigate(
        `/dineretso-restaurants/${userInfo.fName}/${userInfo.myRestaurant}`
      );
    } catch (error) {
      setImgLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Failed to upload Cover Photo. Please try again later!");
      }
    }
  };
  const handleAddMenuItem = async (menuItemData) => {
    try {

      const response = await axios.post(
        `/api/owner/restaurant/add-menu-item/${params.restaurantID}`,
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
  function groupMenuByClassification(menu) {
    if (!loading) {
      const groupedMenu = {};
      menu.forEach((menuItem) => {
        const { classification } = menuItem;
        if (!groupedMenu[classification]) {
          groupedMenu[classification] = [];
        }
        groupedMenu[classification].push(menuItem);
      });
      return groupedMenu;
    }
  }
  const groupedMenu = groupMenuByClassification(myRestaurant.menu);
  return (
    <div className='font-inter w-full flex justify-center items-center'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='w-full h-80 border border-main flex justify-center items-center'>
            {status === "subscribed" ? (
              <div className='w-full h-80 border border-main flex justify-center items-center'>
                {myRestaurant.bgPhoto ? (
                  <img
                    src={myRestaurant.bgPhoto}
                    alt='coverphoto'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className=''>
                    {imgLoading ? (
                      <LoadingSpinner type='uploading' />
                    ) : (
                      <label className='cursor-pointer bg-ButtonColor p-3 rounded-md text-main mt-3'>
                        Add Cover Photo
                        <input
                          type='file'
                          className='hidden'
                          accept='image/*'
                          onChange={uploadCoverPhoto}
                          id='image'
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button>Subscribe for full access.</button>
              </div>
            )}
          </div>
          <div className='w-11/12 flex justify-center items-center flex-col mt-3'>
            <div className='w-full flex justify-evenly items-center border-b border-main p-2'>
              <div>
                <h1 className='sm:text-4xl md:text-5xl lg:text-6xl text-3xl capitalize font-bold'>
                  {myRestaurant.resName}
                </h1>
                <div className='p-2'>
                  <p>Category: {myRestaurant.category}</p>
                  <p>Location: {myRestaurant.address}</p>
                  <p>Phone No: {myRestaurant.phoneNo}</p>
                  <div className='flex w-full space-x-3'>
                    <div>
                      {status === "not subscribed" ? (
                        <div>
                          <p>Subscribe for full access.</p>
                        </div>
                      ) : (
                        <div className='flex space-x-5 text-TextColor'>
                          <div className='bg-OrangeDefault rounded-md p-1 '>
                            <button>My subscription</button>
                          </div>
                          <div className='bg-OrangeDefault rounded-md p-1'>
                            <button>Restaurant Analytics</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-center items-center space-x-5 shadow-xl pb-5'>
                <div className='h-72 rounded-md'>
                  {myRestaurant.profileImage ? (
                    <img
                      src={myRestaurant.profileImage}
                      alt='coverphoto'
                      className='h-72 rounded-md '
                    />
                  ) : (
                    <div>
                      <p>No Profile Image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className='w-full bg-TextColor flex justify-center items-center sticky top-0 py-5 shadow-lg mb-5 space-x-5
              lg:text-3xl md:text-3xl sm:text-2xl text-lg font-semibold'
            >
              <a
                href='#Menus'
                className={activeLink === "Menus" ? "active" : ""}
                onClick={() => handleNavClick("Menus")}
              >
                MENUS
              </a>
              <a
                href='#Blogpost'
                className={activeLink === "Blogposts" ? "active" : ""}
                onClick={() => handleNavClick("Blogposts")}
              >
                BLOG POSTS
              </a>
              <a
                href='#Reviews'
                className={activeLink === "Reviews" ? "active" : ""}
                onClick={() => handleNavClick("Reviews")}
              >
                REVIEWS
              </a>
            </div>
            <div
              id='Menus'
              className='w-full flex flex-col justify-center items-start py-5'
            >
              {status === "subscribed" ? (
                <div className='w-full'>
                  <div className='flex justify-center items-center'>
                    <h1 className='text-5xl'>Menu</h1>
                  </div>
                  <div className='w-full flex justify-start items-start'>
                    {showAddMenu ? (
                      <AddMenuItem
                        onAddMenuItem={handleAddMenuItem}
                        onClose={() => setShowAddMenu(false)}
                      />
                    ) : (
                      <div className='w-auto bg-OrangeDefault rounded-md p-1 flex justify-center items-center'>
                        <button onClick={() => setShowAddMenu(true)}>
                          Add Menu
                        </button>
                      </div>
                    )}
                  </div>
                  {Object.keys(groupedMenu).length === 0 ? (
                    <div>No Menu Available</div>
                  ) : (
                    <div>
                      {Object.keys(groupedMenu).map((classification) => (
                        <div key={classification}>
                          <h2 className='text-xl font-semibold'>
                            {classification}
                          </h2>
                          <div className='flex justify-start items-start w-full overflow-y-auto'>
                            {groupedMenu[classification].map(
                              (menuItem, index) => (
                                <div
                                  key={index}
                                  className='space-x-auto flex flex-row justify-start items-start'
                                >
                                  <div className='flex flex-col justify-center items-center rounded-md h-auto w-40 shadow-xl p-3'>
                                    {menuItem.menuImage ? (
                                      <img
                                        className='w-auto max-h-40'
                                        src={menuItem.menuImage}
                                        alt='Menu'
                                      />
                                    ) : (
                                      <div>
                                        <img
                                          className='h-32 w-32'
                                          src='/dineLogo.jpg'
                                          alt='menuImage'
                                        />
                                      </div>
                                    )}
                                    <p>{menuItem.menuName}</p>
                                    <p>Price: {menuItem.price}</p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button>Subscribe for full access.</button>
                </div>
              )}
            </div>
            <div id='Blogpost' className='flex flex-col'>
              <div>
                <p>Posts</p>
              </div>
              <div>Write Restaurant Review</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
