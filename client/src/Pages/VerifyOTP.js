import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import bcrypt from "bcryptjs";

export default function VerifyOTP() {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [remainingTime, setRemain] = useState(0);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const calculateRemainingTime = () => {
    const now = new Date().getTime();
    const expirationTime = userInfo.expiration;
    const timeDiff = expirationTime - now;
    return Math.max(0, Math.floor(timeDiff / 1000));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = calculateRemainingTime();
      setRemain(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (remainingTime <= 0) {
      alert("OTP has expired. Please sign up again.");
      localStorage.removeItem("userInfo");
      navigate("/signup");
      return;
    }

    if (bcrypt.compareSync(enteredOTP, userInfo.otp)) {
      try {
        const response = await Axios.post(
          `http://localhost:5000/api/users/signup`,
          {
            fName: userInfo.fName,
            lName: userInfo.lName,
            address: userInfo.address,
            mobileNo: userInfo.mobileNo,
            email: userInfo.email,
            password: userInfo.password,
          }
        );
        if (response.status === 201) {
          alert(response.data.message);
          localStorage.removeItem("userInfo"); // Remove user data from local storage
          navigate("/login");
        } else {
          alert("Failed to create account.");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.data.message);
        } else {
          alert(error.data.message);
        }
      }
    } else {
      alert("Invalid OTP Verification!");
      localStorage.removeItem("userInfo");
      navigate("/signup");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen font-sans'>
      <div className='bg-main w-1/2 rounded-md p-8'>
        <form onSubmit={verifyOTP}>
          <div className='mb-4'>
            <label className='block text-first-text font-bold mb-2'>
              Enter OTP
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='text'
              placeholder='Enter the OTP sent to your email'
              required
              value={enteredOTP}
              onChange={(e) => setEnteredOTP(e.target.value)}
            />
          </div>
          <div className='mb-2 text-center text-gray-600'>
            {remainingTime > 0
              ? `OTP will expire in ${remainingTime} seconds`
              : "OTP has expired"}
          </div>
          <div className='flex items-center justify-center'>
            <button
              className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
