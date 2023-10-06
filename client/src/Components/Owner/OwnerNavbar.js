import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

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

export default function OwnerNavbar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [status, setStatus] = useState("");
  const [resId, setResId] = useState("");
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          `/api/owner/restaurant/${userInfo.fName}/${userInfo.myRestaurant}`,
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
  }, [userInfo.fName, userInfo.myRestaurant, userInfo.token]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className='flex z-50'>
      <nav className='bg-neutrals-500 text-TextColor w-72 h-screen fixed top-0 left-0 overflow-y-auto font-inter space-y-10 hidden sm:flex flex-col p-5'>
        <div className='w-full flex flex-col justify-center items-center space-y-3 border-b border-TextColor py-5'>
          <div>
            <h1 className='text-2xl font-bold'>{myRestaurant.resName}</h1>
          </div>
          <div className='rounded-full h-32 w-32 bg-cover'>
            <img
              className='rounded-full h-32 w-32'
              src={myRestaurant.profileImage}
              alt={myRestaurant.resName}
            />
          </div>
        </div>
        <div className='w-full h-auto space-y-1 font-thin text-2xl'>
          <Link
            to='/dashboard'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>dashboard</i>
            <span className='ml-2 border-b w-full'>Dashboard</span>
          </Link>
          <Link
            to={`/dineretso-restaurant/${myRestaurant.resName}/Menu`}
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>restaurant_menu</i>
            <span className='ml-2 border-b w-full'>Menu</span>
          </Link>
          <Link
            to={`/dineretso-restaurant/${myRestaurant.resName}/customers`}
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>people</i>
            <span className='ml-2 border-b w-full'>Customers</span>
          </Link>
          <Link
            to='/analytics'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>analytics</i>
            <span className='ml-2 border-b w-full'>Analytics</span>
          </Link>
          <Link
            to={`/dineretso-restaurant/${myRestaurant.resName}/subscriptions`}
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>subscriptions</i>
            <span className='ml-2 border-b w-full'>
              Plans and Subscriptions
            </span>
          </Link>
          <Link
            to='/settings'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>settings</i>
            <span className='ml-2 border-b w-full'>Settings</span>
          </Link>
          <div className='flex items-center hover:bg-orange-700 p-2'>
            <i className='material-icons'>logout</i>
            <button onClick={signoutHandler} className='ml-2'>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className='bg-neutrals-700 text-TextColor p-2 sm:hidden'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 6h16M4 12h16m-7 6h7'
          />
        </svg>
      </button>
      {isMobileMenuOpen && (
        <nav className='bg-neutrals-700 text-TextColor w-full h-screen fixed top-0 left-0 overflow-y-auto font-inter space-y-10 p-7 sm:hidden'>
          <div className='w-full flex flex-col justify-center items-center space-y-3 border-b border-TextColor py-5'>
            <div>
              <h1 className='text-2xl font-bold'>{myRestaurant.resName}</h1>
            </div>
            <div className='rounded-full h-32 w-32 bg-cover'>
              <img
                className='rounded-full h-32 w-32'
                src={myRestaurant.profileImage}
                alt={myRestaurant.resName}
              />
            </div>
          </div>
          <div className='w-full h-auto space-y-3 font-thin text-2xl'>
            <Link
              to='/dashboard'
              className='flex items-center hover:bg-neutrals-600 p-3'
            >
              <i className='material-icons'>dashboard</i>
              <span className='ml-2'>Dashboard</span>
            </Link>
            <Link
              to='/menu'
              className='flex items-center hover:bg-neutrals-600 p-3'
            >
              <i className='material-icons'>restaurant_menu</i>
              <span className='ml-2'>Menu</span>
            </Link>
            <Link
              to='/customers'
              className='flex items-center hover:bg-neutrals-600 p-3'
            >
              <i className='material-icons'>people</i>
              <span className='ml-2'>Customers</span>
            </Link>
            <Link
              to='/analytics'
              className='flex items-center hover:bg-neutrals-600 p-3'
            >
              <i className='material-icons'>analytics</i>
              <span className='ml-2'>Analytics</span>
            </Link>
            <Link
              to='/settings'
              className='flex items-center hover:bg-neutrals-600 p-3'
            >
              <i className='material-icons'>settings</i>
              <span className='ml-2'>Settings</span>
            </Link>
            <div className='flex items-center hover:bg-neutrals-600 p-3'>
              <i className='material-icons'>logout</i>
              <button onClick={signoutHandler} className='ml-2'>
                Logout
              </button>
            </div>
            <div className='flex items-center hover:bg-neutrals-600 p-3'>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className='flex items-center'
              >
                <i className='material-icons'>close</i>
                <span className='ml-2'>Close</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
