import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import ProfileSettings from "./ProfileSettings";
import RestoSettings from "./RestoSettings";

export default function Settings() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});
  const [restoData, setRestoData] = useState({});
  const [userReview, setUserReview] = useState([]);
  const [chosenData, setChosenData] = useState("Profile");

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `/api/owner/getProfile/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.data.user) {
          setUserData(response.data.user);
        } else {
          setError("User not found");
        }
        if (response.data.restaurant) {
          setRestoData(response.data.restaurant);
        } else {
          setError("Restaurant not found");
        }
        if (response.data.userReviews) {
          setUserReview(response.data.userReviews);
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchUser();
  }, [userInfo._id, userInfo.token]);

  const setProfile = (e) => {
    e.preventDefault();
    setChosenData("Profile");
  };
  const setResto = (e) => {
    e.preventDefault();
    setChosenData("Resto");
  };
  return (
    <div className='sm:ml-72 p-5 font-inter'>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full flex flex-col'>
          <div className='w-full h-20 shadow-xl flex flex-col justify-between p-2'>
            <h1 className='text-2xl text-orange-500 font-semibold'>Settings</h1>
            <div className='w-full flex flex-row space-x-2'>
              <div className='border' onClick={setProfile}>
                <h1>User Profile</h1>
              </div>
              <div onClick={setResto}>
                <h1>Resto Profile</h1>
              </div>
            </div>
          </div>
          <div className='p-3'>
            {chosenData === "Profile" ? (
              <ProfileSettings
                userData={userData}
                userInfo={userInfo}
                userReview={userReview}
                restoData={restoData}
              />
            ) : (
              <RestoSettings restoData={restoData} userInfo={userInfo} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
