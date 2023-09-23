import React from "react";

export default function FeaturedMenu(props) {
  const { fMenu } = props;
  return (
    <div className='flex flex-col justify-center w-full shadow-xl h-auto sm:h-96 rounded-md'>
      <div className='flex justify-center items-center w-full h-72 bg-neutrals-600 bg-opacity-70 rounded-md'>
        <img
          className='h-full w-full object-contain'
          src={fMenu.menuImage}
          alt={fMenu.menuName}
        />
      </div>
      <div className='flex flex-col justify-between flex-grow px-3 bg-neutrals-200 shadow-md p-2'>
        <div className='flex flex-col text-neutrals-700'>
          <h1 className='text-2xl font-semibold'>{fMenu.menuName}</h1>
          <h1 className='text-md'>{fMenu.owner}</h1>
        </div>
        <div>ratings</div>
      </div>
    </div>
  );
}
