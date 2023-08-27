import React, { useEffect, useReducer } from "react";
import PendingRestaurants from "../../../Components/PendingRestaurants";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
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

export default function ManageRestaurant() {
  const [{ loading, error, pendingResto }, dispatch] = useReducer(reducer, {
    pendingResto: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchPendingResto = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/restaurant/pendingResto");
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchPendingResto();
  }, []);
  return (
    <div className='w-full font-sans flex flex-row'>
      <div className='lg:w-1/4 md:w-1/2 w-full px-4 mb-4 md:mb-0 border-r border-main h-screen overflow-y-auto'>
        <div>
          <select className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500'>
            <option value=''>Select Category</option>
            <option value='Famous'>Famous</option>
            <option value='Local'>Local</option>
            <option value='Unique'>Unique</option>
          </select>
        </div>
        <div className='mt-5 text-center bg-main p-4 text-nav-text shadow-md'>
          <p>Pending Restaurant Registration</p>
        </div>
        <div>
          {loading ? (
            <LoadingSpinner type='getpending' />
          ) : error ? (
            <div className='text-center'>{error}</div>
          ) : (
            pendingResto.map((pending) => (
              <div key={pending._id}>
                <PendingRestaurants pending={pending} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className='lg:w-3/4 md:w-1/2 w-full px-4'>
        <div className='flex flex-col md:flex-row space-y-1 md:space-y-0 justify-between'>
          <div className='flex flex-row w-full md:w-3/4'>
            <input
              type='text'
              placeholder='Search'
              className='w-full bg-white border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:border-indigo-500 pr-10'
            />
            <div className='h-full flex items-center p-3 border justify-center'>
              <FontAwesomeIcon
                icon={faSearch}
                className='text-cyan-950 text-2xl'
              />
            </div>
          </div>
          <div className='flex'>
            <button className='bg-ButtonColor text-white rounded-r px-4 py-2 ml-1 hover:bg-opacity-80 transition duration-300'>
              Add Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
