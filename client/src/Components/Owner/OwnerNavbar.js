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
  useEffect(() => {
    const checkPaymentStatusAndRedirect = async () => {
      if (userInfo.linkId) {
        try {
          const response = await fetch(
            `/api/payment/getPaymentLink/${userInfo.linkId}`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to get payment link details");
          }
          const { users } = await response.json();

          if (users) {
            if (users.subscriptionStatus === "subscribed") {
              userInfo.subscriptionStatus = "subscribed";
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            } else if (users.subscriptionStatus === "not subscribed") {
              userInfo.subscriptionStatus = "not subscribed";
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            } else {
              userInfo.subscriptionStatus = "expired";
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            }
          }
        } catch (error) {
          console.error("Error checking payment status :", error);
          dispatch({ type: "FETCH_FAIL", payload: error });
        }
      }
    };

    checkPaymentStatusAndRedirect();
  }, []);

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
      {error ? (
        error
      ) : (
        <div>
          <nav className='bg-orange-500 text-TextColor w-72 h-screen fixed top-0 left-0 overflow-y-auto font-inter space-y-10 hidden sm:flex flex-col p-5'>
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
                to={`/dineretso-restaurant/${myRestaurant.resName}/dashboard`}
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>dashboard</i>
                <span className='ml-2'>Dashboard</span>
              </Link>
              <Link
                to={`/dineretso-restaurant/${myRestaurant.resName}/Menu`}
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>restaurant_menu</i>
                <span className='ml-2'>Menu</span>
              </Link>
              <Link
                to={`/dineretso-restaurant/${myRestaurant.resName}/customers`}
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>people</i>
                <span className='ml-2'>Customers</span>
              </Link>
              <Link
                to={`/dineretso-restaurant/${myRestaurant.resName}/analytics`}
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>analytics</i>
                <span className='ml-2'>Analytics</span>
              </Link>
              <Link
                to={`/dineretso-restaurant/${myRestaurant.resName}/owner-posting`}
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>description</i>
                <span className='ml-2'>Posting</span>
              </Link>
              <Link
                to={`/dineretso-restaurant/${myRestaurant.resName}/PlansNPricing`}
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>subscriptions</i>
                <span className='ml-2'>Plans and Subscriptions</span>
              </Link>
              <Link
                to='/settings'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>settings</i>
                <span className='ml-2'>Settings</span>
              </Link>
              <div className='flex items-center hover:bg-orange-700 p-2'>
                <i className='material-icons'>logout</i>
                <button onClick={signoutHandler} className='ml-2'>
                  Logout
                </button>
              </div>
            </div>
          </nav>
          <div className='bg-orange-200 sm:hidden w-full'>
            <div className='w-full flex flex-row h-20 justify-between items-center'>
              <div className='flex justify-center items-center h-16 w-16'>
                <img src='/Logo.png' alt='logo' className='h-16 w-16' />
              </div>
              <div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className='bg-orange-200 text-TextColor p-5  w-full'
                >
                  <svg
                    className='w-10 h-10'
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
              </div>
            </div>
          </div>
          <div
            className={`${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500 ease-in-out`}
          >
            {isMobileMenuOpen && (
              <nav className='bg-orange-200 text-TextColor w-full h-screen fixed top-0 left-0 overflow-y-auto font-inter space-y-10 p-7 sm:hidden z-50 '>
                <div className='fixed top-0 w-full'>
                  <div className='w-full flex flex-row h-20 justify-between items-center'>
                    <div className='flex justify-center items-center h-16 w-16'>
                      <img src='/Logo.png' alt='logo' className='h-16 w-16' />
                    </div>
                    <div className='pr-8'>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className=' text-TextColor p-5  w-full'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-10 h-10'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className='w-full flex flex-col justify-center items-center space-y-3 border-b border-TextColor py-5 mt-[-40px]'>
                  <div>
                    <h1 className='text-2xl font-bold'>
                      {myRestaurant.resName}
                    </h1>
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
                    to={`/dineretso-restaurant/${myRestaurant.resName}/dashboard`}
                    className='flex items-center hover:bg-neutrals-600 p-3'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className='material-icons'>dashboard</i>
                    <span className='ml-2'>Dashboard</span>
                  </Link>
                  <Link
                    to={`/dineretso-restaurant/${myRestaurant.resName}/Menu`}
                    className='flex items-center hover:bg-neutrals-600 p-3'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className='material-icons'>restaurant_menu</i>
                    <span className='ml-2'>Menu</span>
                  </Link>
                  <Link
                    to={`/dineretso-restaurant/${myRestaurant.resName}/customers`}
                    className='flex items-center hover:bg-neutrals-600 p-3'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className='material-icons'>people</i>
                    <span className='ml-2'>Customers</span>
                  </Link>
                  <Link
                    to={`/dineretso-restaurant/${myRestaurant.resName}/analytics`}
                    className='flex items-center hover:bg-neutrals-600 p-3'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className='material-icons'>analytics</i>
                    <span className='ml-2'>Analytics</span>
                  </Link>
                  <Link
                    to={`/dineretso-restaurant/${myRestaurant.resName}/PlansNPricing`}
                    className='flex items-center hover:bg-neutrals-600 p-3'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className='material-icons'>subscriptions</i>
                    <span className='ml-2'>Plans and Subscriptions</span>
                  </Link>
                  <Link
                    to='/settings'
                    className='flex items-center hover:bg-neutrals-600 p-3'
                    onClick={() => setIsMobileMenuOpen(false)}
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
                </div>
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
