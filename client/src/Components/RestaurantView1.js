import React from "react";

export default function RestaurantView1(props) {
  const { resto } = props;
  return (
    <div className='flex flex-col lg:flex-row border-2 border-main rounded-md p-5 space-x-2 w-full'>
      <div className='flex justify-center lg:w-1/2 w-90 h-auto'>
        <img
          className='w-90 lg:w-3/4 h-60 rounded-xl shadow-md'
          src={resto.profileImage}
          alt='profile image'
        />
      </div>
      <div className='flex flex-col  h-auto justify-evenly w-1/2'>
        <div>
          <p className='font-bold text-xl'>{resto.resName}</p>
        </div>
        <div>
          <p>
            Location: <span>{resto.address}</span>
          </p>
        </div>
        <div>
          <p>
            Category: <span>{resto.category}</span>
          </p>
        </div>
        <div>
          <p>Phone No: {resto.phoneNo}</p>
        </div>
        <div className='flex flex-col'>
          <p>Social Media:</p>
          <div className='flex flex-row space-x-2 text-2xl'>
            <a href={resto.fbLink} target='_blank' rel='noopener noreferrer'>
              <img
                src='../facebook.png'
                alt='Facebook'
                width='32'
                height='32'
              />
            </a>
            <img src='../instagram.png' alt='Facebook' width='32' height='32' />
          </div>
        </div>
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}
