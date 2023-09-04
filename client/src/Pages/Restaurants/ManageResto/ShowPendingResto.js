import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "../../../utils";
import { Store } from "../../../Store";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, pendingResto: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function ShowPendingResto() {
  const [{ loading, error, pendingResto }, dispatch] = useReducer(reducer, {
    pendingResto: [],
    loading: true,
    error: "",
  });
  const [image, setImage] = useState("");
  const [resName, setResName] = useState("");
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [reasonCancelled, setReason] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { id: pendingID } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/admin/pendingRestoInfo/${pendingID}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setImage(data.image);
        setResName(data.resName);
        setOwner(data.owner);
        setEmail(data.email);
        setPhoneNo(data.phoneNo);
        setAddress(data.address);
        setCategory(data.category);
        setCreatedAt(data.createdAt);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        window.location.href = "/";
        toast.error("Invalid User!");
      }
    };

    fetchData();
  }, [pendingID]);
  const cancelRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/admin/cancelRegistration",
        {
          _id: pendingID,
          reasonCancelled: reasonCancelled,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/admin/manage-restaurants");
      } else {
        toast.error("Cancellation Failed!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    }
  };
  const confirmRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/admin/confirmRegistration",
        {
          _id: pendingID,
          email: email,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/admin/manage-restaurants");
      } else {
        toast.error("Cancellation Failed!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    }
  };
  return (
    <div className='font-sans'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className='text-center text-warning mt-28'>
          {typeof error === "string" ? (
            <p>{error}</p>
          ) : (
            <div>
              <p>An error occurred:</p>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className='flex justify-center items-center flex-col mt-24 py-5 space-y-5'>
          <div
            className=' bg-trans-background flex w-3/4 flex-col h-auto md:flex-row justify-center items-center lg:mx-24 md:mx-20 mx-5 sm:mx-14 shadow-md
            lg:pt-0 md:pt-0 sm:pt-5 pt-10 p-5 rounded-md'
          >
            <div className='flex justify-center items-center w-full md:w-1/2'>
              <div className=''>
                <div className='h-80 flex items-center justify-center bg-cover'>
                  {image ? (
                    <img
                      src={image}
                      alt='Restaurant'
                      className='h-auto w-64 border-black p-5 shadow-md'
                    />
                  ) : (
                    <div className='text-black font-bold text-lg text-center'>
                      No image uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2'>
              <div className='flex flex-col space-y-4 w-full'>
                <div className='w-full'>
                  <p className='block text-first-text font-bold mb-2'>
                    Restaurant Name:{" "}
                    <span className='font-thin'>{resName}</span>
                  </p>
                </div>
                <div className='w-full'>
                  <p className='block text-first-text font-bold mb-2'>
                    Owner: <span className='font-thin'>{owner}</span>
                  </p>
                </div>
                <div className='w-full'>
                  <p className='block text-first-text font-bold mb-2'>
                    Email: <span className='font-thin'>{email}</span>
                  </p>
                </div>
                <div className='w-full'>
                  <p className='block text-first-text font-bold mb-2'>
                    Phone Number: <span className='font-thin'>{phoneNo}</span>
                  </p>
                </div>
                <div className='w-full'>
                  <p className='block text-first-text font-bold mb-2'>
                    Address: <span className='font-thin'>{address}</span>
                  </p>
                </div>
                <div className='w-full'>
                  <p className='block text-first-text font-bold mb-2'>
                    Category: <span className='font-thin'>{category}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex space-x-5'>
            <button
              onClick={confirmRegistration}
              className='bg-ButtonColor text-white px-3 py-1 text-center rounded hover:bg-green'
            >
              Confirm
            </button>
            <button
              onClick={() => setShowCancelReason(true)}
              className='bg-ButtonColor text-white px-3 py-1 text-center rounded hover:bg-warning'
            >
              Cancel
            </button>
            {showCancelReason && (
              <div className='absolute inset-0 bg-main bg-opacity-80 flex justify-center items-center'>
                <div className='w-3/4 h-auto bg-nav-text p-5 rounded-md'>
                  <h2 className='text-lg font-bold mb-3'>
                    Reason for Cancellation
                  </h2>
                  <textarea
                    className='w-full h-3/4 p-2 border border-gray-300 rounded'
                    placeholder='Enter the reason for cancellation...'
                    value={reasonCancelled}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className='mt-3 flex justify-end space-x-2'>
                    <button
                      onClick={() => setShowCancelReason(false)}
                      className='bg-ButtonColor text-white px-3 py-1 text-center rounded hover:bg-warning'
                    >
                      Cancel
                    </button>
                    <button
                      className='bg-ButtonColor text-white px-3 py-1 text-center rounded hover:bg-green'
                      onClick={cancelRegistration}
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
