import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import LoadingSpinner from "../../Components/LoadingSpinner";
import PendingRestaurants from "../../Components/Dine/PendingRestaurants";

const pendingReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, pendingResto: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const initialPendingState = {
  pendingResto: [],
  loading: true,
  error: "",
};

export default function Registration() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [pendingState, pendingDispatch] = useReducer(
    pendingReducer,
    initialPendingState
  );
  const { loading, error, pendingResto } = pendingState;

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPendingResto = async () => {
      pendingDispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/admin/pendingResto", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        pendingDispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage =
            error.response.data.message || "No Pending Restaurants!";
          pendingDispatch({ type: "FETCH_FAIL", payload: errorMessage });
        } else {
          pendingDispatch({ type: "FETCH_FAIL", payload: error.message });
        }
      }
    };
    fetchPendingResto();
  }, [dineInfo.token, pendingDispatch]);

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-2'>
      <div className='w-full flex flex-row p-1 justify-center items-center'>
        <i className='material-icons text-orange-500 text-3xl'>search</i>
        <input
          type='text'
          placeholder='Search here...'
          className='w-full p-1 outline-none border-b border-orange-500'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : pendingResto.length === 0 ? (
          <div className='text-center text-red-500'>
            No Pending Restaurants!
          </div>
        ) : (
          pendingResto.map((pending) => (
            <div key={pending._id} className='grid grid-cols-4'>
              <PendingRestaurants pending={pending} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
