import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterSteps from "../../../Components/RegisterSteps";

export default function ConfirmRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const rData = JSON.parse(localStorage.getItem("resData"));
  const sendRegistration = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`/api/restaurant/send-registration`, {
        image: rData.image,
        resName: rData.resName,
        owner: rData.owner,
        email: rData.email,
        phoneNo: rData.phoneNo,
        address: rData.address,
        category: rData.category,
      });
      if (response.status === 201) {
        setLoading(false);
        alert("Registration has been sent to DineRetso!");
        localStorage.removeItem("resData");
        navigate("/register-restaurant");
      } else {
        setLoading(false);
        alert("Failed to sent registration! Please try again later!");
        localStorage.removeItem("resData");
        navigate("/register-restaurant");
      }
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
      localStorage.removeItem("resData");
      navigate("/register-restaurant");
    }
  };

  return (
    <div>
      <RegisterSteps step1 step2 />
      <div className='flex items-center justify-center min-h-screen bg-BackgroundGray font-sans'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
          <h2 className='text-2xl font-semibold text-main mb-4'>
            Enter Your Email Password
          </h2>
          <form>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full'
              onClick={sendRegistration}
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
