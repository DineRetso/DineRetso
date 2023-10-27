import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { getError } from "../../../utils";
import ChangePass from "./ChangePass";

export default function ProfileSettings({
  userData,
  userInfo,
  userReview,
  restoData,
}) {
  const [image, setImage] = useState(restoData.profileImage);
  const [fName, setFname] = useState(userData.fName);
  const [lName, setLname] = useState(userData.lName);
  const [mobileNo, setMobileNo] = useState(userData.mobileNo);
  const [address, setAddress] = useState(userData.address);
  const [email, setEmail] = useState(userData.email);
  const [imagePublicId, setImagePublicId] = useState(restoData.profileImageId);
  const [password, setPassword] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [isChangeOpen, setIsChangeOpen] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/owner/updateProfile/${userData._id}`,
        {
          image,
          imagePublicId,
          fName,
          lName,
          mobileNo,
          address,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 400) {
        return toast.error("Invalid Password");
      } else if (response.status === 200) {
        toast.success("Profile Updated");
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };

  const openChangePass = () => {
    setIsChangeOpen(true);
  };
  const closeChangePass = () => {
    setIsChangeOpen(false);
  };
  const uploadimg = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setImageLoading(true);
      const { data } = await axios.post(`/api/image`, bodyFormData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setImage(data.secure_url);
      setImagePublicId(data.public_id);
      setImageLoading(false);
    } catch (err) {
      console.error(err);
      setImageLoading(false);
      toast.error("Failed to upload image!");
    }
  };
  const removeImage = async () => {
    try {
      setImageLoading(true);
      await axios.delete(`/api/image/${imagePublicId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setImage("");
      setImagePublicId("");
      setImageLoading(false);
    } catch (err) {
      console.error(err);
      setImageLoading(false);
      toast.error("Failed to remove image!");
    }
  };
  return (
    <div className='w-full flex flex-col font-inter'>
      <div>
        <h1 className='text-2xl font-semibold'>Profile</h1>
      </div>
      <div>
        <form className='flex flex-col w-full' onSubmit={handleSaveProfile}>
          <div className='flex sm:flex-row flex-col max-h-96'>
            <div className='sm:w-[30%] flex justify-center items-center'>
              {imageLoading ? (
                <LoadingSpinner type='uploading' />
              ) : image ? (
                <div>
                  <div>
                    <img src={image} alt='profile' className='w-40 h-40' />
                  </div>
                </div>
              ) : (
                <div>
                  <div className='w-40 h-40 border flex justify-center items-center'>
                    <h1 className='text-sm'>No Image</h1>
                  </div>
                </div>
              )}
            </div>
            <div className='sm:w-[70%] flex flex-col'>
              <div className='flex space-x-3 w-full'>
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={fName}
                  onChange={(e) => setFname(e.target.value)}
                />
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={lName}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
              <div>
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                />
              </div>
              <div>
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className='w-full'>
                <input
                  className='border-b p-2 w-full'
                  placeholder='Enter password save.'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='flex flex-row justify-center items-center space-x-2'>
                <div
                  className='border border-red-200 flex justify-center items-center w-72 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md hover:cursor-pointer'
                  onClick={openChangePass}
                >
                  <h1>Change Password</h1>
                </div>
                <div className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
                  <button type='submit'>Save</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {isChangeOpen && (
        <ChangePass
          userInfo={userInfo}
          userData={userData}
          closeChangePass={closeChangePass}
        />
      )}
      <div>
        {userReview.length > 0 ? (
          <div>
            {userReview.map((review) => (
              <div key={review._id}>
                <h1>Restaurant name: {review.resName}</h1>
                {review.comment}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>No Reviews submitted</h1>
          </div>
        )}
      </div>
    </div>
  );
}
