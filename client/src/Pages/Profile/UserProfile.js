import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { getError } from "../../utils";

const pendingReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function UserProfile() {
  const { id: userID } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, user }, dispatch] = useReducer(pendingReducer, {
    loading: true,
    user: {},
    error: "",
  });

  const [image, setImage] = useState("");
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [password, setPassword] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [reviews, setReviews] = useState([]);

  const isValidMobileNo = (mobileNo) => {
    const regex = /^(?:\+639|\b09)[0-9]{9}$/;
    return regex.test(mobileNo);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/users/getUserProfile/${userID}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setImage(response.data.user.image);
        setFname(response.data.user.fName);
        setLname(response.data.user.lName);
        setMobileNo(response.data.user.mobileNo);
        setAddress(response.data.user.address);
        setImagePublicId(response.data.user.imagePublicId);
        setEmail(response.data.user.email);
        setReviews(response.data.userReviews);
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        console.error(error);
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    fetchUser();
  }, [userID, userInfo.token]);

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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (password === "") {
      return toast.error("Please enter your password to verify.");
    }

    if (!isValidMobileNo(mobileNo)) {
      toast.error("Please enter a valid Philippine mobile number.");
      return;
    }
    try {
      const response = await axios.put(
        `/api/users/updateUserProfile/${userID}`,
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

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  return (
    <div className='font-inter'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : user ? (
        <div className='p-5 flex justify-center items-center flex-col'>
          <div>
            <h1 className='text-2xl text-center mb-5 font-semibold text-orange-500'>
              User Profile
            </h1>
          </div>
          <div className='w-full bg-orange-200 p-2'>
            <form className='w-full' onSubmit={handleSaveProfile}>
              <div className='flex sm:flex-row flex-col w-full sm:space-x-5'>
                <div className='sm:w-[40%] w-full p-2 '>
                  {imageLoading ? (
                    <div className='w-full flex justify-center items-center max-h-60 bg-TextColor'>
                      <LoadingSpinner type='uploading' />
                    </div>
                  ) : image ? (
                    <div className='w-full object-cover relative'>
                      <img
                        src={image}
                        alt='profile'
                        className='w-full max-h-60 object-cover rounded-md'
                      />
                      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <div
                          className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor hover:cursor-pointer transition-all duration-300 p-2 rounded-md'
                          onClick={removeImage}
                        >
                          <h1 className='w-full text-center'>Remove</h1>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='w-full flex justify-center items-center flex-col sm:h-full h-60  border bg-TextColor rounded-xl'>
                      <h1 className='text-neutrals-500'>No Profile Image</h1>
                      <label className='cursor-pointer bg-ButtonColor p-1 rounded-md text-main border text-orange-500'>
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
                  )}
                </div>
                <div className='w-full flex flex-col '>
                  <div className='flex sm:space-x-3 w-full mb-1'>
                    <input
                      className='border-b p-2 w-full outline-none focus:border-orange-500 bg-TextColor rounded-md bg-opacity-50'
                      type='text'
                      value={fName}
                      onChange={(e) => setFname(e.target.value)}
                    />
                    <input
                      className='border-b p-2 w-full outline-none focus:border-orange-500 bg-TextColor rounded-md bg-opacity-50'
                      type='text'
                      value={lName}
                      onChange={(e) => setLname(e.target.value)}
                    />
                  </div>
                  <div className='mb-1'>
                    <input
                      className='border-b p-2 w-full outline-none focus:border-orange-500 bg-TextColor rounded-md bg-opacity-50'
                      type='text'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className='mb-1'>
                    <input
                      className='border-b p-2 w-full outline-none focus:border-orange-500 bg-TextColor rounded-md bg-opacity-50'
                      type='text'
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </div>
                  <div className='mb-1'>
                    <input
                      className='border-b p-2 w-full outline-none focus:border-orange-500 bg-TextColor rounded-md bg-opacity-50'
                      type='text'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className='w-full mb-1'>
                    <input
                      className='border-b p-2 w-full outline-none focus:border-orange-500 text-TextColor bg-TextColor rounded-md bg-opacity-50'
                      placeholder='Verify password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-row justify-center items-center space-x-2 p-2'>
                    <div className='border border-TextColor flex justify-center items-center w-40 hover:bg-red-200  text-TextColor transition-all duration-300 p-2 rounded-md'>
                      <button type='submit' className='w-full'>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='w-full flex flex-col justify-center items-center mt-5'>
            <h1 className='text-center text-2xl font-semibold text-orange-500'>
              Reviews
            </h1>
            {reviews.length > 0 ? (
              <div className='w-full flex flex-col space-y-2'>
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className='flex sm:flex-row flex-col border rounded-xl p-2 sm:justify-start sm:items-center space-x-2'
                  >
                    <div className='sm:border-r sm:border-b-0 border-b border-orange-500 pr-3'>
                      <h1 className='font-semibold'>{review.resName}</h1>
                      <h1 className='text-sm text-neutrals-500'>
                        {formatDate(review.createdAt)}
                      </h1>
                      <h1 className='text-sm text-orange-500'>
                        {review.status}
                      </h1>
                    </div>
                    <div className='text-justify text-sm text-neutrals-500'>
                      {" "}
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center text-orange-500 text-lg'>
                No Reviews Made
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No user found!</p>
      )}
    </div>
  );
}
