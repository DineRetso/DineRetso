import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import RegisterSteps from "../../../Components/RegisterSteps";
import { useNavigate } from "react-router-dom";

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
      alert("Image Uploaded");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to upload image!");
    }
  };
  const removeImage = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/image/${imagePublicId}`);
      setImage(""); // Clear the image URL after deletion
      setImagePublicId(""); // Clear the public_id
      alert("Image Removed");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to remove image!");
    }
  };
  useEffect(() => {
    const rData = localStorage.getItem("resData");
    if (rData) {
      navigate("");
    }
  });

  return (
    <div>
      <RegisterSteps step1 />
      <div className='flex justify-center items-center min-h-screen font-sans'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-screen-lg w-full'>
          <h2 className='text-2xl font-semibold text-main mb-4'>
            Register Your Restaurant
          </h2>
          <form>
            <div className='flex flex-col md:flex-row'>
              <div className='md:w-1/2 mb-4 md:mb-0 md:mr-4'>
                <div className='relative w-full h-44 mb-4'>
                  {loading ? (
                    <div className='w-full h-full bg-BackgroundGray flex items-center justify-center rounded-md'>
                      <LoadingSpinner type='uploading' />
                    </div>
                  ) : image ? (
                    <div>
                      <img
                        src={image}
                        alt='Selected'
                        className='w-full h-full object-cover rounded-md'
                      />
                      <button
                        className='mt-2 text-sm text-warning hover:underline'
                        onClick={removeImage}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className='w-full h-full bg-BackgroundGray flex items-center justify-center rounded-md'>
                      No Image
                    </div>
                  )}
                </div>
                <label className='cursor-pointer text-DropDownColor'>
                  Add Image
                  <input
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={uploadimg}
                    id='image'
                  />
                </label>
                <label
                  className='block text-first-text font-bold mb-2'
                  htmlFor='image'
                >
                  Image Name
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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

              <div className='md:w-1/2'>
                <input
                  type='text'
                  placeholder='Restaurant Name'
                  className='input mb-3'
                  id='resName'
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Owner'
                  className='input mb-3'
                  id='owner'
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Email'
                  className='input mb-3'
                  id='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Phone Number'
                  className='input mb-3'
                  id='phoneNo'
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Complete Address'
                  className='input mb-3'
                  id='address'
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <select
                  className='input'
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
