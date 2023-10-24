import React, { useEffect, useState } from "react";
import { getError } from "../../../utils";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";

export default function PostView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postData, setPostData] = useState({});
  const source = "web";

  const { id, postSource } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/restaurant/getResto/posting/${id}/${postSource}`
        );
        if (response.status === 200) {
          setPostData(response.data);
        } else {
          console.error("Post Not Found");
          setError("Post unavailable");
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, setPostData]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  return (
    <div className='w-full p-2'>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full flex flex-col px-20'>
          <div className='w-full border-b p-5 mb-5'>
            <h1 className='text-center text-2xl text-orange-500 font-bold'>
              {postData.title}
            </h1>
          </div>
          <div className='w-full'>
            <div className='w-full flex justify-center'>
              <div className='grid grid-cols-3 w-full p-2 h-[500px]'>
                {postData.video && (
                  <video
                    src={postData.video.secure_url}
                    alt='Uploaded Video'
                    controls
                    className='max-h-[500px] max-w-full object-cover rounded-lg'
                  ></video>
                )}
                {postData.images &&
                  postData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.secure_url}
                      alt={`post`}
                      className='max-h-[400px] max-w-full object-cover rounded-lg'
                    />
                  ))}
              </div>
            </div>
            <div className='w-full p-2'>
              <Link to={`/Restaurant/${postData.resName}/${source}`}>
                <h2 className='text-2xl text-orange-500 font-bold'>
                  {postData.resName}
                </h2>
              </Link>
              <div className='text-orange-500 border-r'>
                {formatDate(postData.createdAt)}
              </div>
              <div className='text-orange-500 border-r'>{postData.address}</div>
              <div
                dangerouslySetInnerHTML={{ __html: postData.description }}
                className='text-justify text-neutrals-500 mt-2 shadow-lg p-5'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
