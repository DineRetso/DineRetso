import React, { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { getError } from "../../../utils";

export default function RestoSettings({ restoData, userInfo }) {
  const [profileImage, setProfileImage] = useState(restoData.profileImage);
  const [profileImageId, setProfileImageId] = useState(
    restoData.profileImageId
  );
  const [resName, setResname] = useState(restoData.resName);
  const [bgPhoto, setBgPhoto] = useState(restoData.bgPhoto);
  const [bgPhotoId, setBgPhotoId] = useState(restoData.bgPhotoId);
  const [owner, setOwner] = useState(restoData.owner);
  const [address, setAddress] = useState(restoData.address);
  const [category, setCategory] = useState(restoData.category);
  const [phoneNo, setPhoneNo] = useState(restoData.phoneNo);
  const [openAt, setOpenAt] = useState(restoData.openAt);
  const [closeAt, setCloseAt] = useState(restoData.closeAt);
  const [description, setDescription] = useState(restoData.description);
  const [pinLocation, setPinLocation] = useState({
    lat: restoData.pinLocation ? restoData.pinLocation.lat : 16.29,
    lng: restoData.pinLocation ? restoData.pinLocation.lng : 121.017,
  });
  const [fbLink, setFbLink] = useState(restoData.fbLink);
  const [igLink, setIgLink] = useState(restoData.ifLink);
  const [webLink, setWebLink] = useState(restoData.webLink);
  const markerRef = useRef(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [bgLoading, setBgLoading] = useState(false);
  const [password, setPassword] = useState("");
  const userId = userInfo._id;

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          const { lat, lng } = marker.getLatLng();
          setPinLocation({ lat, lng });
        }
      },
    }),
    []
  );

  const uploadimg = async (e) => {
    if (restoData.isSubscribed !== "subscribed") {
      return toast.error("Please Subscribed for full acess.");
    }
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setProfileLoading(true);
      const { data } = await axios.post(`/api/image`, bodyFormData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setProfileImage(data.secure_url);
      setProfileImageId(data.public_id);
      setProfileLoading(false);
    } catch (err) {
      console.error(err);
      setProfileLoading(false);
      toast.error("Failed to upload image!");
    }
  };
  const uploadBg = async (e) => {
    if (restoData.isSubscribed !== "subscribed") {
      return toast.error("Please Subscribed for full acess.");
    }
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setBgLoading(true);
      const { data } = await axios.post(`/api/image`, bodyFormData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setBgPhoto(data.secure_url);
      setBgPhotoId(data.public_id);
      setBgLoading(false);
    } catch (err) {
      console.error(err);
      setBgLoading(false);
      toast.error("Failed to upload image!");
    }
  };

  const removeImage = async () => {
    try {
      setProfileLoading(true);
      await axios.delete(`/api/image/${profileImageId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setProfileImage("");
      setProfileImageId("");
      setProfileLoading(false);
    } catch (err) {
      console.error(err);
      setProfileLoading(false);
      toast.error("Failed to remove image!");
    }
  };

  const removeBg = async () => {
    try {
      setBgLoading(true);
      await axios.delete(`/api/image/${bgPhotoId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setBgPhoto("");
      setBgPhotoId("");
      setBgLoading(false);
    } catch (err) {
      console.error(err);
      setBgLoading(false);
      toast.error("Failed to remove image!");
    }
  };

  const handleSaveButton = async (e) => {
    e.preventDefault();
    try {
      if (restoData.isSubscribed === "subscribed") {
        const response = await axios.put(
          `/api/owner/edit-restoprofile/${restoData._id}`,
          {
            profileImage,
            profileImageId,
            resName,
            bgPhoto,
            bgPhotoId,
            owner,
            address,
            category,
            phoneNo,
            openAt,
            closeAt,
            description,
            pinLocation,
            fbLink,
            igLink,
            webLink,
            password,
            userId,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.status === 200) {
          toast.success("Restaurant Updated");
        } else {
          toast.error("Failed to update Restaurant");
        }
      } else {
        return toast.info("Subscribe for full access!");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };
  return (
    <div className='w-full flex flex-col font-inter lg:p-5 md:p-4 sm:p-3 p-2'>
      <form onSubmit={handleSaveButton}>
        <div className='flex flex-col'>
          <div className='w-full object-cover max-h-72 h-60 border flex justify-center items-center'>
            {bgLoading ? (
              <LoadingSpinner type='uploading' />
            ) : bgPhoto ? (
              <div className='w-full h-60 object-cover relative'>
                <img
                  src={bgPhoto}
                  alt='bg'
                  className='w-full h-full object-cover'
                />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <div
                    className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md'
                    onClick={removeBg}
                  >
                    <h1>Remove</h1>
                  </div>
                </div>
              </div>
            ) : (
              <div className='w-full flex justify-center items-center flex-col'>
                <h1 className='text-neutrals-500'>No Background Image</h1>
                <label className='cursor-pointer p-1 rounded-md text-main border text-orange-500'>
                  Add Image
                  <input
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={uploadBg}
                    id='image'
                  />
                </label>
              </div>
            )}
          </div>
          <div className='flex lg:flex-row  flex-col'>
            <div className='sm:w-[40%] w-full'>
              {profileLoading ? (
                <div className='w-full flex justify-center items-center'>
                  <LoadingSpinner type='uploading' />
                </div>
              ) : profileImage ? (
                <div className='w-full object-cover relative'>
                  <img
                    src={profileImage}
                    alt='profile'
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <div
                      className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md'
                      onClick={removeImage}
                    >
                      <h1>Remove</h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='w-full flex justify-center items-center flex-col h-full'>
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
            <div className='w-full flex flex-col sm:p-2'>
              <input
                className='border-b p-2 w-full text-xl text-orange-500 outline-none focus:border-orange-500 font-semibold'
                type='text'
                value={resName}
                onChange={(e) => setResname(e.target.value)}
              />
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2'>Owned by: </h2>
                <input
                  className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                  type='text'
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Address: </h2>
                <input
                  className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                  type='text'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Category: </h2>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full p-2 outline-none focus:border-orange-500 text-neutrals-500'
                >
                  <option value={category}>{category}</option>
                  <option value='Famous'>Famous</option>
                  <option value='Local'>Local</option>
                  <option value='Unique'>Unique</option>
                </select>
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Phone No: </h2>
                <input
                  className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                  type='text'
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>
              <div className='w-full flex sm:flex-row flex-col justify-center items-start'>
                <div className='flex w-full'>
                  <h2 className='w-32 p-2 '>Open At: </h2>
                  <input
                    className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                    type='time'
                    value={openAt}
                    onChange={(e) => setOpenAt(e.target.value)}
                  />
                </div>
                <div className='flex w-full'>
                  <h2 className='w-32 p-2 '>Close At: </h2>
                  <input
                    className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                    type='time'
                    value={closeAt}
                    onChange={(e) => setCloseAt(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <div className='w-full flex p-2'>
              <h2 className='w-40 p-2 '>Facebook Link: </h2>
              <input
                className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                type='text'
                value={fbLink}
                onChange={(e) => setFbLink(e.target.value)}
              />
            </div>
            <div className='w-full flex p-2'>
              <h2 className='w-40 p-2 '>Instagram Link: </h2>
              <input
                className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                type='text'
                value={igLink}
                onChange={(e) => setIgLink(e.target.value)}
              />
            </div>
            <div className='w-full flex p-2'>
              <h2 className='w-40 p-2 '>Website Link: </h2>
              <input
                className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                type='text'
                value={webLink}
                onChange={(e) => setWebLink(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full flex flex-col sm:p-2 mt-2'>
            <label className='text-xl text-orange-500'>Description:</label>
            <textarea
              className='w-full h-60 text-sm text-justify p-2 border outline-neutrals-500'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className='w-full flex flex-col sm:p-2'>
            <label className='text-xl text-orange-500 font-semibold'>
              Pin Location:
            </label>
            <div id='map' style={{ height: "300px" }}>
              <MapContainer
                center={[pinLocation.lat, pinLocation.lng]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <Marker
                  icon={L.icon({
                    iconUrl: "/pinpoint.png",
                    iconSize: [30, 30],
                  })}
                  draggable={true}
                  position={[pinLocation.lat, pinLocation.lng]}
                  ref={markerRef}
                  eventHandlers={eventHandlers}
                >
                  <Popup minWidth={90}>Your restaurant's location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          <div className='w-full sm:p-2'>
            <input
              placeholder='Enter password here...'
              className='w-full p-2 text-xl outline-none border-b border-orange-500'
              required
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className='w-full flex justify-center items-center mt-5'>
            <div className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
              <button type='submit' className='w-full'>
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
