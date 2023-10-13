import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";

export default function VerifyOTP() {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [remainingTime, setRemain] = useState(0);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const calculateRemainingTime = useCallback(() => {
    if (userInfo) {
      const now = new Date().getTime();
      const expirationTime = userInfo.expiration;
      const timeDiff = expirationTime - now;
      return Math.max(0, Math.floor(timeDiff / 1000));
    }
    return 0;
  }, [userInfo]);

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error(
        "User information is missing or expired. Please fill out the signup form again."
      );
      localStorage.removeItem("userInfo");
      navigate("/signup");
      return;
    }
    if (remainingTime <= 0) {
      toast.error("OTP has expired. Please sign up again.");
      localStorage.removeItem("userInfo");
      navigate("/signup");
      return;
    }

    if (bcrypt.compareSync(enteredOTP, userInfo.otp)) {
      try {
        const response = await Axios.post(`/api/users/signup`, {
          fName: userInfo.fName,
          lName: userInfo.lName,
          address: userInfo.address,
          mobileNo: userInfo.mobileNo,
          email: userInfo.email,
          password: userInfo.password,
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
        } else {
          toast.error("Failed to create account.");
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.message);
        } else {
          toast.error(error.message);
        }
      }
    } else {
      toast.error("Invalid OTP Verification!");
      localStorage.removeItem("userInfo");
      navigate("/signup");
    }
  };

  useEffect(() => {
    if (userInfo) {
      const interval = setInterval(() => {
        const timeLeft = calculateRemainingTime();
        setRemain(timeLeft);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [calculateRemainingTime]);

  return (
    <div className='flex items-center justify-center h-screen font-sans'>
      <div className='w-1/2 rounded-md p-16 border h-96 shadow bg-orange-100 '>
        <form onSubmit={verifyOTP}>
          <div className='mb-4'>
            <label className='flex items-center justify-center text-first-text font-bold mb-2'>
              Enter OTP
            </label>
            <input
              className='mt-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
          <div className='bg-red-700 border mt-14 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline'>
            <button
              className=' w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline'
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
