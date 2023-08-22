import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";

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
      navigate(redirect || "/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
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
      alert("Password Reset Link has been send to your email.");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert(err.response.data.message);
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
        <div className='flex flex-col lg:flex-row'>
          <div
            className='w-full lg:w-1/2 h-screen lg:h-auto bg-cover bg-left relative rounded-t-lg lg:rounded-l-lg lg:rounded-t-none transform lg:translate-x-0'
            style={{
              backgroundImage: 'url("../loginbg.jpg")',
            }}
          ></div>
          <div className='w-full bg-white p-8 flex flex-col justify-center items-center space-y-5'>
            <div className='rounded-full bg-white w-32 h-32 flex items-center justify-center border border-cyan-950'>
              <FontAwesomeIcon
                icon={faUser}
                className='text-cyan-950 text-6xl'
              />
            </div>
            <form className='w-full md:w-3/4'>
              <input
                type='text'
                className='mt-2 p-2 border w-full bg-gray-200 rounded-xl'
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
                className='mt-2 p-2 border w-full bg-gray-200 rounded-xl'
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
                Forget Password
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
      )}
    </div>
  );
};

export default Login;
