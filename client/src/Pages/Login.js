import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";
import { toast } from "react-toastify";
import { getError } from "../utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const LoginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(`/api/users/signin`, {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (!data.isOwner) {
        navigate(redirect || "/");
      } else {
        navigate(`/dineretso-restaurant/${data.myRestaurant}/dashboard`);
      }
    } catch (err) {
      console.error(getError(err));
      toast.error(getError(err));
    }
  };
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await Axios.post(`/api/users/forget-password`, {
        email,
      });
      setLoading(false);
      toast.success("Password Reset Link has been send to your email.");
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(getError(err));
      navigate("/login");
    }
  };
  //redirect to homepage once already signin
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className='font-inter flex w-full justify-center items-center lg:p-28 md:p-20 sm:p-14 p-10 h-screen bg-neutrals-700'>
      {loading ? (
        <LoadingSpinner type='resetPass' />
      ) : (
        <div className='flex w-full h-full justify-center items-center'>
          <div className='flex w-full h-auto border-TextColor justify-center items-center'>
            <div className='flex flex-row justify-center lg:p-20 md:p-4 w-full rounded-md'>
              <div className='flex flex-col w-[600px] bg-cover border border-orange-500 bg-TextColor justify-center items-center py-10 lg:px-8 md:p-5 p-2 lg:rounded-l-md md:rounded-l-md sm:rounded-l-md rounded-md'>
                <div className='flex flex-row w-full h-auto justify-start border-b border-orange-500 pb-5'>
                  <div className='w-16 h-16'>
                    <img src='/Logo.png' alt='logo' />
                  </div>
                  <div className='flex justify-start items-center'>
                    <h1 className='text-orange-500 text-3xl font-bold'>
                      Login
                    </h1>
                  </div>
                </div>
                <form className='flex flex-col w-full justify-center items-center space-y-5'>
                  <input
                    type='text'
                    className='mt-2 p-3 w-full rounded-md text-sm border outline-orange-500'
                    placeholder='Email'
                    id='email'
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <input
                    type='password'
                    className='mt-2 p-3 w-full rounded-md text-sm border outline-orange-500'
                    placeholder='Password'
                    id='password'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <div className='border border-orange-500 flex justify-center items-center w-3/4 hover:bg-TextColor bg-orange-500 text-TextColor hover:text-orange-500 transition-all duration-300 p-2 rounded-md'>
                    <button
                      className=' rounded-xl w-full'
                      type='submit'
                      onClick={LoginHandler}
                    >
                      Login
                    </button>
                  </div>
                  <button
                    className='text-sm text-red-200 hover:text-lg transition-all duration-200 bg-ButtonColor px-4 rounded-xl w-full'
                    type='submit'
                    onClick={resetPassword}
                  >
                    Forgot Password
                  </button>

                  <div className='text-center'>
                    <p className='mt-2'>Don't have an account?</p>
                    <a href='/signup' className=''>
                      <p className='text-primary-500 text-sm hover:text-lg transition-all duration-200'>
                        Sign up here!
                      </p>
                    </a>
                  </div>
                </form>
              </div>
              <div className='bg-cover w-full hidden sm:flex rounded-r-md'>
                <Link
                  to={"/"}
                  className='bg-cover w-full hidden sm:flex rounded-r-md'
                >
                  <img
                    className='h-[500px] bg-cover w-full rounded-r-md'
                    src='./login.jpg'
                    alt='DineRetso Restaurant Login'
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
