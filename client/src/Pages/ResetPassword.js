import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //confirm password
  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!isPasswordValid(password)) {
      alert("Password must contain symbol, number and capital letter!");
      return;
    }
    try {
      const response = await Axios.post("/api/users/reset-password", {
        token,
        password,
      });
      alert(response.data.message);
      navigate("/login"); // Redirect to login page after successful reset
    } catch (error) {
      console.error(error.response.data.message);
    }
  };
  return (
    <div className='flex justify-center items-center h-screen bg-orange-500 flex-col font-inter'>
      <div className='flex lg:w-1/2 lg:h-1/2 md:w-1/2 md:h-1/2 rounded-xl bg-TextColor p-5 flex-col justify-center items-center'>
        <img
          src='/Logo.png'
          alt='dine-logo'
          className='h-20 w-20 rounded-xl'
        ></img>
        <h2 className='text-2xl text-orange-500 font-bold'>
          Reset Your Password
        </h2>
        <form
          onSubmit={handleResetPassword}
          className='flex flex-col justify-center items-center p-2'
        >
          <input
            className='p-2 border-b border-orange-500 outline-none'
            type='password'
            placeholder='New Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && isPasswordValid(password) && (
            <span className='text-sm text-green-500'>Password Valid!</span>
          )}
          {password && !isPasswordValid(password) && (
            <span className='text-sm text-red-500'>
              Password must have at least 8 characters and contain a symbol,
              number and Capital.
            </span>
          )}
          <input
            className='p-2 border-b border-orange-500 outline-none'
            type='password'
            placeholder='Confirm New Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className='border border-orange-500 bg-orange-500 flex justify-center items-center w-full hover:bg-TextColor text-TextColor hover:text-orange-500 transition-all duration-300 p-2 rounded-md mt-2'>
            <button type='submit'>Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
