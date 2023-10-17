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
        navigate("/register-restaurant");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      navigate("/register-restaurant");
    }
  };
  const cancelRegistration = async (e) => {
    e.preventDefault();
    localStorage.removeItem("resData");
    navigate("/register-restaurant");
  };

  return (
    <div className='p-10'>
      <RegisterSteps step1Completed step2 />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='flex  justify-center items-center h-96 font-sans'>
          <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
            <h2 className='text-2xl font-semibold text-main mb-4'>
              Terms and Conditions here...
            </h2>
            <form className='flex flex-row justify-evenly'>
              <div className='border border-orange-500 flex justify-center items-center w-40 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md mt-2'>
                <button
                  type='submit'
                  className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full'
                  onClick={sendRegistration}
                >
                  Confirm
                </button>
              </div>
              <div className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md mt-2'>
                <button
                  type='submit'
                  className='w-full'
                  onClick={cancelRegistration}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
