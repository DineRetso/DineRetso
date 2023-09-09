import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterSteps from "../../../Components/RegisterSteps";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Store } from "../../../Store";

export default function ConfirmRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const rData = JSON.parse(localStorage.getItem("resData"));
  const { state } = useContext(Store);
  const { userInfo } = state;
  const sendRegistration = async (e) => {
    e.preventDefault();
    if (!rData) {
      toast.error("Registration data not found!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/restaurant/send-registration`,
        {
          image: rData.image,
          resName: rData.resName,
          owner: rData.owner,
          email: rData.email,
          phoneNo: rData.phoneNo,
          address: rData.address,
          category: rData.category,
          description: rData.description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 201) {
        setLoading(false);
        toast.success("Registration has been sent to DineRetso!");
        localStorage.removeItem("resData");
        navigate("/register-restaurant");
      } else {
        setLoading(false);
        toast.error("Failed to send registration! Please try again later!");
        localStorage.removeItem("resData");
        navigate("/register-restaurant");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      localStorage.removeItem("resData");
      navigate("/register-restaurant");
    }
  };
  const cancelRegistration = async (e) => {
    e.preventDefault();
    localStorage.removeItem("resData");
    navigate("/register-restaurant");
  };

  return (
    <div className='pt-24'>
      <RegisterSteps step1Completed step2 />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='flex  justify-center items-center h-96 font-sans'>
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
              <button
                type='submit'
                className='bg-ButtonColor hover:bg-hover-text py-2 px-4 rounded w-full'
                onClick={cancelRegistration}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
