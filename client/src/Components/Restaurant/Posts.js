import React from "react";

export default function Posts({ post }) {
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  return (
    <div className='flex w-full justify-center items-center flex-col p-5'>
      <div className='w-full flex justify-center border-b'>
        <h1 className='text-2xl text-orange-500 font-bold text-center mb-3'>
          {post.title}
        </h1>
      </div>
      <div className='w-full flex justify-center'>
        <div className='grid sm:grid-cols-3 grid-cols-2 w-full p-2 sm:gap-5 gap-2 '>
          {post.video && (
            <div className='sm:col-span-4 w-full'>
              <video
                src={post.video.secure_url}
                alt='Uploaded Video'
                controls
                className='w-full rounded-lg shadow-md'
              ></video>
            </div>
          )}
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image.secure_url}
              alt={`post`}
              className='w-full h-auto rounded-lg'
            />
          ))}
        </div>
      </div>
      <div className='w-full p-2'>
        <div className='text-orange-500 border-r sm:text-xl text-sm'>
          {formatDate(post.createdAt)}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: post.description }}
          className='text-justify text-neutrals-500 mt-2 sm:text-xl text-sm'
        />
      </div>
    </div>
  );
}
