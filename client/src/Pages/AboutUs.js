import React from "react";

export default function AboutUs() {
  return (
    <div className='absolute top-0 w-full'>
      <div className='w-full'>
        <div className='w-full bg-about-image h-screen flex justify-end items-center pr-20'>
          <div className='w-80'>
            <img src='/Logo.png' />
            <h1 className='text-[70px] font-bold text-orange-200 text'>
              About Us
            </h1>
            <p>
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut{" "}
            </p>
          </div>
        </div>
        <div className='py-10 bg-orange-500 flex flex-col justify-center items-center h-auto'>
          <div>
            <h1 className='text-5xl font-bold text-TextColor'>Our Mission</h1>
          </div>
          <div className='flex flex-row w-full justify-center items-center space-x-10'>
            <div className='w-[65%]'>
              <p className='text-justify text-2xl text-TextColor px-40'>
                {" "}
                To promote and elevate the dining experience in Nueva Vizcaya by
                showcasing the diverse culinary offerings of local restaurants
                and establishing a strong presence for each restaurant in the
                province, thereby contributing to the growth and recognition of
                Nueva Vizcaya's restaurant industry.
              </p>
            </div>
            <div className='w-[35%] flex justify-start items-center h-[400px]'>
              <img className='' src='/about1.png' alt='about' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
