import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Components/LoadingSpinner";
import AdminNavbar from "../../Components/Dine/AdminNavbar";
import OwnerNavbar from "../../Components/Owner/OwnerNavbar";

const pendingReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function UserProfile() {
  const params = useParams();
  const { id: userID } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, user }, dispatch] = useReducer(pendingReducer, {
    loading: true,
    user: [],
    error: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(`/api/users/get-user/${userID}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
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
          // Set a generic error message for unexpected errors
          dispatch({
            type: "FETCH_FAIL",
            payload: "An unexpected error occurred.",
          });
        }
      }
    };

    fetchUser();
  }, [userID, userInfo.token]);

  return (
    <div className='mt-24 font-roboto'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : user ? (
        <div>
          {user.isAdmin && <AdminNavbar />}
          {user.isOwner && <OwnerNavbar user={user} />}
          <h1>User Profile</h1>
          <p>Name: {user.fName}</p>
          {/* Add other user details you want to display */}
        </div>
      ) : (
        <p>No user found!</p>
      )}
    </div>
  );
}
