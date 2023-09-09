import React, { useReducer, useState } from "react";
import LoadingSpinner from "../Components/LoadingSpinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, Dine: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [{ loading, error, Dine }, dispatch] = useReducer(reducer, {
    Dine: [],
    loading: true,
    error: "",
  });
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.post("/api/admin/admin-login", {
        username,
        password,
      });
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      localStorage.setItem("dineInfo", JSON.stringify(data));
      navigate("/dine-admin/secret/admin-dashboard");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div>
      <div className='relative font-sans'>
        <div className='relative'>
          <div className='flex flex-col pt-20 justify-center items-center relative h-screen z-20'>
            <div className='w-3/4 bg-trans-background md:w-3/4 lg:w-1/2 bg-white p-8 lg:px-1 space-y-5 rounded-xl flex flex-col  justify-center items-center'>
              <form className='w-full md:w-3/4'>
                <input
                  type='text'
                  className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
                  placeholder='Username'
                  id='username'
                  required
                  value={username}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
                <input
                  type='password'
                  className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
                  placeholder='Password'
                  id='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  className='mt-4 text-TextColor bg-ButtonColor px-4 py-2 rounded-xl w-full'
                  type='submit'
                  onClick={loginHandler}
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
