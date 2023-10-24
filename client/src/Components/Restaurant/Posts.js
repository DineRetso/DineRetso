import React from "react";

export default function Posts({ post }) {
  return (
    <div className='flex w-full justify-center items-center flex-col p-5'>
      <div className='w-1/2 text-center'>
        <h1 className='text-2xl text-orange-500 font-semibold'>{post.title}</h1>
      </div>

      <div className='flex flex-row'>
        <div className='grid grid-cols-3 max-h-[400px] w-[40%] p-2 overflow-y-auto'>
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image.secure_url}
              alt={`post`}
              className='w-full h-auto rounded-lg'
            />
          ))}
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: post.description }}
          className='text-justify text-gray-700 mt-2 w-[60%] p-5'
        />
      </div>
    </div>
  );
}
