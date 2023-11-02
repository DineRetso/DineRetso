import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "../../utils";
import { Store } from "../../Store";
import LoadingSpinner from "../../Components/LoadingSpinner";
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
  const [description, setDescription] = useState("");
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [reasonCancelled, setReason] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { id: pendingID } = params;
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/admin/pendingRestoInfo/${pendingID}`,
          {
            headers: { Authorization: `Bearer ${dineInfo.token}` },
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
        setDescription(data.description);
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
  }, [pendingID, dineInfo.token]);
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
          headers: { Authorization: `Bearer ${dineInfo.token}` },
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
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/dine/admin/secret/registration");
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
    <div className='font-inter sm:ml-72 p-2'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className='text-center'>
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
        <div className='flex justify-center items-center flex-col w-full'>
          <div className='w-full flex flex-col'>
            <div className='flex flex-row justify-center items-center w-full p-2 bg-orange-200'>
              <div className='w-64 flex items-center justify-center bg-cover'>
                {image ? (
                  <img
                    src={image}
                    alt='Restaurant'
                    className='h-auto w-64 border-black p-1 shadow-md'
                  />
                ) : (
                  <div className='text-black font-bold text-lg text-center'>
                    No image uploaded
                  </div>
                )}
              </div>
              <div className='w-full'>
                <h1 className='text-TextColor text-2xl font-semibold'>
                  {resName}
                </h1>
                <p className='text-justify text-sm'>{description}</p>
              </div>
            </div>
            <div className='w-full p-2 text-neutrals-500'>
              <h1 className='text-xl font-semibold text-neutrals-500'>
                Restaurant Information
              </h1>
              <div className='flex flex-col space-y-4 w-full p-2'>
                <div className='w-full p-1 border border-orange-500 rounded-md flex flex-col justify-center items-start'>
                  <p className=''>Address:</p>
                  <p className='font-bold'>{address}</p>
                </div>
                <div className='w-full p-1 border border-orange-500 rounded-md flex flex-col justify-center items-start'>
                  <p className=''>Category:</p>
                  <p className=' font-bold '>{category} Restaurant</p>
                </div>
              </div>
              <h1 className='text-xl font-semibold text-neutrals-500'>
                Contact Information
              </h1>
              <div className='flex flex-col space-y-4 w-full p-2'>
                <div className='w-full p-1 border border-orange-500 rounded-md flex flex-col justify-center items-start'>
                  <p className=''>Contact No:</p>
                  <p className='font-bold'>{phoneNo}</p>
                </div>
                <div className='w-full p-1 border border-orange-500 rounded-md flex flex-col justify-center items-start'>
                  <p className=''>Email:</p>
                  <p className='font-bold'>{email}</p>
                </div>
              </div>
            </div>
          </div>
          {showCancelReason && (
            <div className='relative bg-main bg-opacity-80 flex justify-center items-center w-full'>
              <div className='w-full h-auto bg-nav-text p-5 rounded-md'>
                <h2 className='text-lg font-semibold text-neutrals-500 mb-3'>
                  Reason for Cancellation
                </h2>
                <textarea
                  className='w-full outline-none p-2 border  rounded'
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
          <div className='flex space-x-5'>
            <div className='w-24 flex justify-center items-center p-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all border rounded-xl'>
              <button onClick={confirmRegistration} className='w-full'>
                Confirm
              </button>
            </div>
            <div className='w-24 flex justify-center items-center p-1 border-orange-500 text-orange-500 hover:bg-red-500 hover:text-TextColor transition-all border rounded-xl'>
              <button
                onClick={() => setShowCancelReason(true)}
                className='bg-ButtonColor text-white px-3 py-1 text-center rounded hover:bg-warning'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
