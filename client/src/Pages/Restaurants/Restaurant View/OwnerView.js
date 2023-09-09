import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { Store } from "../../../Store";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";

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
  const [status, setStatus] = useState("");
  const { userInfo } = state;
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

  return (
    <div className='mt-24 font-sans w-full flex justify-center items-center'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='w-11/12  flex flex-col justify-center'>
          <div className='w-full h-60 border border-main flex justify-center items-center'>
            {status === "subscribed" ? (
              <div>
                {myRestaurant.bgPhoto ? (
                  <img src={myRestaurant.bgPhoto} alt='coverphoto' />
                ) : (
                  <div>
                    <p>No cover photo</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button>Subscribe for full access.</button>
              </div>
            )}
          </div>
          <div className='flex justify-start items-start'>
            <div className='w-3/4 flex flex-col'>
              <div className='flex justify-start pl-10 space-x-5 border-b border-main pb-5'>
                <div className='h-60 mt-[-80px] rounded-full border border-main'>
                  {myRestaurant.profileImage ? (
                    <img
                      src={myRestaurant.profileImage}
                      alt='coverphoto'
                      className='h-60 rounded-full '
                    />
                  ) : (
                    <div>
                      <p>No Profile Image</p>
                    </div>
                  )}
                </div>
                <div className='p-5'>
                  <p>{myRestaurant.resName}</p>
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
                        <div>
                          <div>
                            <button>My subscription</button>
                          </div>
                          <div>
                            <button>Restaurant Analytics</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='border-b border-main h-auto'>
                <p>{myRestaurant.description}</p>
                <p>hakdog</p>
              </div>
              <div className='flex flex-col'>
                <div>
                  <p>Posts</p>
                </div>
                <div>Write Restaurant Review</div>
              </div>
            </div>
            <div className='w-1/4 border border-main h-screen flex justify-center items-start'>
              {myRestaurant.menu && myRestaurant.menu.length > 0 ? (
                <div>
                  <p>Menu Items:</p>
                  {myRestaurant.menu.map((menuItem, index) => (
                    <div key={index}>
                      <p>{menuItem.menuName}</p>
                      <p>Description: {menuItem.description}</p>
                      <p>Price: {menuItem.price}</p>
                      {/* Render other menu item details */}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No menu items available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
