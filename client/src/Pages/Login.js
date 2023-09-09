import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";
import { toast } from "react-toastify";

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
        navigate(`/dineretso-restaurants/${data.isOwner}/${data.myRestaurant}`);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
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
      toast.error(err.response.data.message);
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
    <div className='relative font-sans'>
      {loading ? (
        <LoadingSpinner type='resetPass' />
      ) : (
        <div className='relative'>
          <div
            className='absolute z-0 w-full h-full bg-cover rounded-full lg:right-96 md:right-96 sm:right-60 right-60 bg-left'
            style={{
              backgroundImage: 'url("../loginbg.jpg")',
            }}
          ></div>
          <div className='flex flex-col pt-20 lg:ml-60 justify-center items-center relative h-screen z-20'>
            <div className='w-3/4 bg-trans-background md:w-3/4 lg:w-1/2 bg-white p-8 lg:px-1 space-y-5 rounded-xl flex flex-col  justify-center items-center'>
              <div className='rounded-full w-32 h-32 flex items-center justify-center border border-ButtonColor'>
                <FontAwesomeIcon
                  icon={faUser}
                  className='text-ButtonColor text-6xl'
                />
              </div>
              <form className='w-full md:w-3/4'>
                <input
                  type='text'
                  className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
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
                  onClick={LoginHandler}
                >
                  Login
                </button>
                <button
                  className='mt-4 text-TextColor bg-ButtonColor px-4 py-2 rounded-xl w-full'
                  type='submit'
                  onClick={resetPassword}
                >
                  Forgot Password
                </button>

                <div className='text-center'>
                  <p className='mt-2'>Don't have an account?</p>
                  <a href='/signup' className='text-blue-500'>
                    <p>Sign up here!</p>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
