import React, { useState } from "react";

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
  return (
    <div className='w-full flex flex-col font-inter p-5'>
      <form>
        <div className='flex flex-col'>
          <div className='w-full object-cover max-h-60 h-60 border flex justify-center items-center'>
            {bgPhoto ? (
              <div>
                <img src={bgPhoto} alt='bg' />
              </div>
            ) : (
              <div>
                <h1>No Background Image</h1>
              </div>
            )}
          </div>
          <div className='flex flex-row'>
            <div className='w-[40%]'>
              {profileImage ? (
                <div>
                  <img src={profileImage} alt='profile' />
                </div>
              ) : (
                <div>
                  <h1>No Profile Image</h1>
                </div>
              )}
            </div>
            <div className='w-full flex flex-col'>
              <input
                className='border-b p-2 w-full'
                type='text'
                value={resName}
                onChange={(e) => setResname(e.target.value)}
              />
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Owned by: </h2>
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Address: </h2>
                <input
                  className='border-b p-2 w-full'
                  type='text'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Category: </h2>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full'
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
                  className='border-b p-2 w-full'
                  type='text'
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>
              <div className='w-full flex flex-row justify-center items-start'>
                <div className='flex w-full'>
                  <h2 className='w-32 p-2 '>Open At: </h2>
                  <input
                    className='border-b p-2 w-full'
                    type='time'
                    value={openAt}
                    onChange={(e) => setOpenAt(e.target.value)}
                  />
                </div>
                <div className='flex w-full'>
                  <h2 className='w-32 p-2 '>Close At: </h2>
                  <input
                    className='border-b p-2 w-full'
                    type='time'
                    value={closeAt}
                    onChange={(e) => setCloseAt(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <label>Description:</label>
            <textarea
              className='w-full'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
