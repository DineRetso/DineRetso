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
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type='password'
          placeholder='New Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && isPasswordValid(password) && (
          <span className='text-sm text-green'>Password Valid!</span>
        )}
        {password && !isPasswordValid(password) && (
          <span className='text-sm text-warning'>
            Password must have at least 8 characters and contain a symbol,
            number and Capital.
          </span>
        )}
        <input
          type='password'
          placeholder='Confirm New Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type='submit'>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
