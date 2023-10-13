import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, Resto: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const initialState = {
  Resto: [],
  loading: true,
  error: "",
};

export default function BlogPost() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [State, Dispatch] = useReducer(reducer, initialState);
  const { loading, error, Resto } = State;
  const navigate = useNavigate();
  const [pS, setPS] = useState("pending");

  useEffect(() => {
    const fetchPendingResto = async () => {
      Dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/admin/getRestaurants", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });

        Dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage =
            error.response.data.message || "No Pending Restaurants!";
          Dispatch({ type: "FETCH_FAIL", payload: errorMessage });
        } else {
          Dispatch({ type: "FETCH_FAIL", payload: error.message });
        }
      }
    };
    fetchPendingResto();
  }, [dineInfo.token, Dispatch]);

  const subscribedRestaurants = Resto.filter(
    (resto) => resto.isSubscribed === "subscribed"
  );

  const filteredResto = () => {
    let resto = [...subscribedRestaurants];
    if (pS === "pending") {
      resto = resto.filter((res) => res.postStatus === "pending");
    } else if (pS === "finished") {
      resto = resto.filter((res) => res.postStatus === "finished");
    } else {
      resto = resto.filter((res) => res.postStatus === "ellapsed");
    }
    return resto;
  };
  const retaurants = filteredResto();

  const calculateRemainingTime = (endDate) => {
    const currentDateTime = new Date();
    const subscriptionEndDate = new Date(endDate);
    const timeDifference = subscriptionEndDate - currentDateTime;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return `${days} days, ${hours} hours`;
  };
  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5'>
      <h1>Blog post</h1>
      <div className='flex flex-row w-full'>
        <div>
          <select
            className='p-2 w-full rounded-md text-sm border outline-primary-500 shadow-md'
            value={pS}
            onChange={(e) => setPS(e.target.value)}
          >
            <option value='pending'>Pending</option>
            <option value='finished'>Finished</option>
            <option value='ellapsed'>Ellapsed</option>
          </select>
        </div>
        <div>
          <select>
            <option>All</option>
            <option>Famous</option>
            <option>Local</option>
            <option>Unique</option>
          </select>
        </div>
        <div>
          <i className='material-icons'>search</i>
          <input placeholder='Search here...'></input>
        </div>
      </div>
      <div className='mt-4'>
        <table className='w-full border border-collapse'>
          <thead className='border'>
            <tr className='border'>
              <th className='py-2 border border-solid  p-2'>Restaurant Name</th>

              <th className='py-2 border border-solid  p-2'>Expires In</th>
              <th className='py-2 border border-solid p-2'>
                Remaining Blog Posts
              </th>
              <th className='py-2 border border-solid p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {retaurants.map((resto) => (
              <tr key={resto._id}>
                <td className='border py-2 text-center'>{resto.resName}</td>

                <td className='border py-2 text-center'>
                  {calculateRemainingTime(resto.subscriptionEndDate)}
                </td>
                <td className='border py-2 text-center'>
                  {10 - resto.postCount}
                </td>
                <td>
                  {resto.postCount >= 10 ? (
                    <div>
                      <h1>Finished</h1>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          navigate(
                            `/dine/admin/secret/add-blog-post/${resto._id}`
                          )
                        }
                      >
                        Add Posting
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
