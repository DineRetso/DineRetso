import axios from "axios";
import React, { useEffect, useReducer } from "react";
import LoadingSpinner from "../../Components/LoadingSpinner";
import RestaurantView1 from "../../Components/Dine/RestaurantView1";

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
const initialRegisteredState = {
  Resto: [],
  loading: true,
  error: "",
};

export default function Restaurants() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [registeredState, registeredDispatch] = useReducer(
    registeredReducer,
    initialRegisteredState
  );
  const { loading, error, Resto } = registeredState;

  useEffect(() => {
    const fetchRestaurants = async () => {
      registeredDispatch({ type: "GET_RESTO" });
      try {
        const response = await axios.get("/api/admin/getRestaurants", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
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
  }, [dineInfo.token]);
  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72'>
      <h1>Restaurants</h1>
      <div className='w-full'>
        <div className='w-full flex flex-row justify-start items-center'>
          <i className='material-icons'>search</i>
          <input placeholder='Search here...' className='w-full p-3'></input>
        </div>
        <div className='w-full p-3 flex flex-row border-b justify-between items-center'>
          <div className='flex flex-row space-x-5 text-2xl'>
            <h1>FAMOUS</h1>
            <h1>LOCAL</h1>
            <h1>UNIQUE</h1>
          </div>
          <div className='flex justify-center items-center'>
            <select>
              <option value=''>Sort Restaurant</option>
              <option value='1'>Premium</option>
              <option value='0'>Basic</option>
            </select>
          </div>
        </div>
        <div>
          {loading ? (
            <LoadingSpinner />
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
