import axios from "axios";
import React, { useEffect, useReducer } from "react";

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

export default function Static() {
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
  }, [dineInfo.token, registeredDispatch]);

  const calulateTotalActiveRestaurants = () => {
    let totalActive = 0;
    let totalInactive = 0;

    for (const restaurant of Resto) {
      if (restaurant.isSubscribed === "subscribed") {
        totalActive++;
      } else {
        totalInactive++;
      }
    }
    return {
      totalActive,
      totalInactive,
    };
  };
  const { totalActive, totalInactive } = calulateTotalActiveRestaurants();

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 relative flex flex-col'>
      <div className='flex justify-start items-center w-full p-5 border-b'>
        <h1 className='text-4xl'>Admin</h1>
      </div>
      <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-5'>
        <div className='border h-28'>
          <i className='material-icons'>restaurant</i>
          <h1>Total Active Restaurant</h1>
          <h2>{totalActive}</h2>
        </div>
        <div className='border h-28'>
          <i className='material-icons'>restaurant</i>
          <h1>Total Active Restaurant</h1>
          <h2>{totalInactive}</h2>
        </div>
        <div className='border'></div>
      </div>
    </div>
  );
}
