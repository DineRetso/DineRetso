import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import RegisterSteps from "../../../Components/RegisterSteps";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [resName, setResName] = useState("");
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  const registerHandler = async (e) => {
    const resData = {
      image,
      resName,
      owner,
      email,
      phoneNo,
      address,
      category,
    };
    localStorage.setItem("resData", JSON.stringify(resData));
    navigate("/confirm-register");
  };

  const uploadimg = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/image`, bodyFormData, {
        headers: {},
      });
      setImage(data.secure_url);
      setImagePublicId(data.public_id);
      toast.info("Image Uploaded");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Failed to upload image!");
    }
  };
  const removeImage = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/image/${imagePublicId}`);
      setImage("");
      setImagePublicId("");
      toast.info("Image Removed");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Failed to remove image!");
    }
  };
  useEffect(() => {
    const rData = localStorage.getItem("resData");
    if (rData) {
      navigate("");
    }
  });

  return (
    <div className='pt-24 bg-cover'>
      <RegisterSteps step1 />
      <div className='flex justify-center items-center font-sans'>
        <div className='bg-white p-8 rounded-lg lg:px-28 md:px-28 sm:px-24 w-full'>
          <h2 className='lg:text-4xl md:text-3xl sm:text-2xl text-xl font-semibold text-center text-main mb-4'>
            Register Your Restaurant
          </h2>
          <hr className='mb-2' />
          <form>
            <div className='flex flex-col md:flex-row'>
              <div className='flex justify-center items-center flex-col md:w-1/2 mb-4 md:mb-0 md:mr-4'>
                <div className='relative w-full h-auto'>
                  {loading ? (
                    <div className='w-full h-full flex items-center justify-center rounded-md shadow-md'>
                      <LoadingSpinner type='uploading' />
                    </div>
                  ) : image ? (
                    <div className='bg-cover flex flex-col justify-center items-center'>
                      <div>
                        <img
                          src={image}
                          alt='Selected'
                          className='w-full h-full object-cover rounded-md'
                        />
                      </div>
                      <div>
                        <button
                          className='mt-2 text-sm bg-ButtonColor p-3 rounded-md w-auto text-warning'
                          onClick={removeImage}
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-col justify-center items-center w-full h-full space-y-5'>
                      <div className='w-full h-44 flex items-center justify-center rounded-md border border-main shadow-md shadow-main'>
                        No Image
                      </div>
                      <div>
                        <label className='cursor-pointer bg-ButtonColor p-3 rounded-md text-main mt-3'>
                          Add Image
                          <input
                            type='file'
                            className='hidden'
                            accept='image/*'
                            onChange={uploadimg}
                            id='image'
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  className='hidden shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='image'
                  type='text'
                  placeholder='Image name'
                  disabled
                  value={image}
                  required
                  onChange={(e) => setImage(e.target.value)}
                  style={{ cursor: "not-allowed" }}
                />
              </div>
              <div className='flex flex-col md:w-1/2'>
                <div>
                  <input
                    type='text'
                    placeholder='Restaurant Name'
                    className='mb-3 border-b w-full border-lg outline-0 focus:shadow-md focus:shadow-ButtonColor p-3 rounded-md shadow-BackgroundGray text-main'
                    id='resName'
                    required
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                  />
                </div>
                <input
                  type='text'
                  placeholder='Owner'
                  className='mb-3 shadow-md w-full p-3  focus-within:shadow-ButtonColor shadow-BackgroundGray text-main'
                  id='owner'
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
                <input
                  type='email'
                  placeholder='Email'
                  className='mb-3 shadow-md w-full p-3 rounded-md shadow-BackgroundGray text-main'
                  id='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type='number'
                  placeholder='Phone Number'
                  className='mb-3 shadow-md w-full p-3 rounded-md shadow-BackgroundGray text-main'
                  id='phoneNo'
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Complete Address'
                  className='mb-3 shadow-md w-full p-3 rounded-md shadow-BackgroundGray text-main'
                  id='address'
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <select
                  className='mb-3 shadow-md w-full p-3 rounded-md shadow-BackgroundGray text-main'
                  id='category'
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value=''>Select Category</option>
                  <option value='Famous'>Famous</option>
                  <option value='Local'>Local</option>
                  <option value='Unique'>Unique</option>
                </select>

                <button
                  className='bg-ButtonColor text-white py-2 px-4 rounded'
                  onClick={registerHandler}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
