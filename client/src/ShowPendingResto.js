import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "./utils";

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
  const navigate = useNavigate();
  const params = useParams();
  const { id: pendingID } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/restaurant/pendingRestoInfo/${pendingID}`
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
        console.log(data);
      } catch (err) {
        console.log(err);
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [pendingID]);
  return (
    <div>
      <div className='flex flex-col md:flex-row pt-20'>
        <div className='w-full md:w-1/2 mb-6 md:mb-0 md:pr-8'>
          <div className='border border-main'>
            <div className='h-80 flex items-center justify-center border'>
              {image ? (
                <img
                  src={image}
                  alt='Restaurant'
                  className='h-auto w-64 border-black ml-5 p-5'
                />
              ) : (
                <div className='text-black font-bold text-lg text-center'>
                  No image uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='w-full md:w-1/2'>
          <div className='space-y-4 md:w-64'>
            <div className='mb-4'>
              <label
                className='block text-first-text font-bold mb-2'
                htmlFor='resName'
              >
                Restaurant Name
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='resName'
                type='text'
                placeholder='Restaurant name'
                value={resName}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-first-text font-bold mb-2'
                htmlFor='owner'
              >
                Owner
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='owner'
                type='text'
                placeholder='Owner'
                value={owner}
                required
              />
              
            </div>
            <div className='mb-4'>
              <label
                className='block text-first-text font-bold mb-2'
                htmlFor='resName'
              >
                Email
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                type='text'
                placeholder='Email'
                value={email}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-first-text font-bold mb-2'
                htmlFor='phoneNo'
              >
                Phone Number
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='phoneNo'
                type='text'
                placeholder='Phone Number'
                value={phoneNo}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-first-text font-bold mb-2'
                htmlFor='address'
              >
                Complete Address
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='address'
                type='text'
                placeholder='Address'
                value={address}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-first-text font-bold mb-2'
                htmlFor='category'
              >
                Category
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='category'
                type='text'
                placeholder='Category'
                value={category}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
