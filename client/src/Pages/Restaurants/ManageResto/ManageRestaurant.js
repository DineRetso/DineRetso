import React, { useContext, useEffect, useReducer } from "react";
import PendingRestaurants from "../../../Components/PendingRestaurants";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faLink } from "@fortawesome/free-solid-svg-icons";
import RestaurantView1 from "../../../Components/RestaurantView1";
import { Store } from "../../../Store";
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
const registeredReducer = (state, action) => {
  switch (action.type) {
    case "GET_RESTO":
      return { ...state, loading: true };
    case "GET_SUCCESS":
      return { ...state, Resto: action.payload, loading: false };
    case "GET_FAILED":
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
const initialRegisteredState = {
  Resto: [],
  loading: true,
  error: "",
};
export default function ManageRestaurant() {
  const [pendingState, pendingDispatch] = useReducer(
    pendingReducer,
    initialPendingState
  );
  const [registeredState, registeredDispatch] = useReducer(
    registeredReducer,
    initialRegisteredState
  );
  const { loading, error, pendingResto } = pendingState;
  const { Resto } = registeredState;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchPendingResto = async () => {
      pendingDispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/restaurant/pendingResto", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
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
  }, []);
  useEffect(() => {
    const fetchRestaurants = async () => {
      registeredDispatch({ type: "GET_RESTO" });
      try {
        const response = await axios.get("/api/restaurant/getRestaurants", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        registeredDispatch({ type: "GET_SUCCESS", payload: response.data });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage =
            error.response.data.message || "No Restaurant Registered!";
          registeredDispatch({ type: "GET_FAILED", payload: errorMessage });
        } else {
          registeredDispatch({ type: "GET_FAILED", payload: error.message });
        }
      }
    };
    fetchRestaurants();
  }, []);
  return (
    <div className='w-full font-sans flex flex-row mt-24'>
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
          ) : pendingResto.length === 0 ? ( // Check if pendingResto array is empty
            <div className='text-center text-red-500'>
              No Pending Restaurants!
            </div>
          ) : (
            pendingResto.map((pending) => (
              <div key={pending._id}>
                <PendingRestaurants pending={pending} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className='flex flex-col lg:w-3/4 md:w-1/2 w-full px-4  space-y-5'>
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
            <select>
              <option value=''>Sort Restaurant</option>
              <option value='1'>Premium</option>
              <option value='0'>Basic</option>
            </select>
          </div>
        </div>
        <div className=''>
          <div className='text-2xl'>
            <span>List of Restaurants</span>
          </div>
          <hr className='border border-main'></hr>
        </div>
        <div>
          {loading ? (
            <LoadingSpinner type='getpending' />
          ) : Resto.length === 0 ? (
            <div className='text-center text-red-500'>
              No Restaurants Registered!
            </div>
          ) : (
            Resto.map((resto) => (
              <div key={resto._id}>
                <RestaurantView1 resto={resto} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
