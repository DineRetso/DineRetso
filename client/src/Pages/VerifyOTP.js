import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function VerifyOTP() {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [remainingTime, setRemain] = useState(0);
  const signupData = JSON.parse(localStorage.getItem("signupData"));

  const navigate = useNavigate();

  const calculateRemainingTime = useCallback(() => {
    if (signupData) {
      const now = new Date().getTime();
      const expirationTime = signupData.expiration;
      const timeDiff = expirationTime - now;
      return Math.max(0, Math.floor(timeDiff / 1000));
    }
    return 0;
  }, [signupData]);

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!signupData) {
      toast.error(
        "User information is missing or expired. Please fill out the signup form again."
      );
      localStorage.removeItem("signupData");
      navigate("/signup");
      return;
    }
    if (remainingTime <= 0) {
      toast.error("OTP has expired. Please sign up again.");
      localStorage.removeItem("signupData");
      navigate("/signup");
      return;
    }

    if (bcrypt.compareSync(enteredOTP, signupData.otp)) {
      try {
        const response = await Axios.post(`/api/users/signup`, {
          fName: signupData.fName,
          lName: signupData.lName,
          address: signupData.address,
          mobileNo: signupData.mobileNo,
          email: signupData.email,
          password: signupData.password,
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          localStorage.removeItem("signupData");
          window.location.href = "/login";
        } else {
          toast.error("Failed to create account.");
          localStorage.removeItem("signupData");
          window.location.href = "/login";
        }
      } catch (error) {
        toast.error(getError(error));
        localStorage.removeItem("signupData");
        navigate("/signup");
      }
    } else {
      toast.error("Invalid OTP Verification!");
      localStorage.removeItem("signupData");
      navigate("/signup");
    }
  };

  useEffect(() => {
    if (signupData) {
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
