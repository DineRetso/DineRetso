import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
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

  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("All");

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

  const filteredResto = Resto.filter((resto) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (selectedCat === "All" || resto.category === selectedCat) &&
      (selectedPayment === "All" || resto.paymentType === selectedPayment) &&
      (resto.resName.toLowerCase().includes(searchLower) ||
        resto._id.toLowerCase().includes(searchLower) ||
        resto.owner.toLowerCase().includes(searchLower) ||
        resto.email.toLowerCase().includes(searchLower) ||
        resto.address.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72'>
      {error ? (
        <div className='flex justify-center items-center'>
          <h1>{error}</h1>
        </div>
      ) : (
        <div className='w-full p-2'>
          <div className='w-full flex flex-row justify-start items-center'>
            <i className='material-icons text-3xl text-orange-500'>search</i>
            <input
              placeholder='Search here...'
              className='w-full p-3 outline-none border-b border-orange-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></input>
          </div>
          <div className='w-full p-3 flex sm:flex-row flex-col border-b justify-between items-center'>
            <div className='flex flex-row space-x-5 text-xl text-neutrals-500'>
              <div
                onClick={() => setSelectedCat("All")}
                className={`${
                  selectedCat === "All" &&
                  "border-b border-orange-500 p-1 rounded-md"
                }`}
              >
                <h1>All</h1>
              </div>
              <div
                onClick={() => setSelectedCat("Famous")}
                className={`${
                  selectedCat === "Famous" &&
                  "border-b border-orange-500 p-1 rounded-md"
                }`}
              >
                <h1>FAMOUS</h1>
              </div>
              <div
                onClick={() => setSelectedCat("Local")}
                className={`${
                  selectedCat === "Local" &&
                  "border-b border-orange-500 p-1 rounded-md"
                }`}
              >
                <h1>LOCAL</h1>
              </div>
              <div
                onClick={() => setSelectedCat("Unique")}
                className={`${
                  selectedCat === "Unique" &&
                  "border-b border-orange-500 p-1 rounded-md"
                }`}
              >
                <h1>UNIQUE</h1>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className='text-neutrals-500 p-2 outline-none'
              >
                <option value='All'>All</option>
                <option value='Premium'>Premium</option>
                <option value='Basic'>Basic</option>
                <option value='None'>None</option>
              </select>
            </div>
          </div>
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : filteredResto.length === 0 ? (
              <div className='text-center text-red-500'>
                No Restaurants Registered!
              </div>
            ) : (
              <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 grid-flow-row'>
                {filteredResto.map((resto) => (
                  <div key={resto._id}>
                    <RestaurantView1 resto={resto} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
