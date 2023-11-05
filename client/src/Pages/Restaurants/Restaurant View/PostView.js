import React, { useEffect, useState } from "react";
import { getError } from "../../../utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";

export default function PostView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postData, setPostData] = useState({});
  const source = "web";
  const navigate = useNavigate();

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
        <div className='w-full flex flex-col lg:px-20 md:px-16 sm:px-12 px-2'>
          <div className='w-full border-b p-5 mb-5'>
            <h1 className='text-center text-2xl text-orange-500 font-bold'>
              {postData.title}
            </h1>
          </div>
          <div className='w-full'>
            <div className='w-full flex justify-center'>
              <div className='grid sm:grid-cols-3 grid-cols-2 w-full p-2 overflow-y-auto'>
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
                      className='w-full h-auto rounded-lg'
                    />
                  ))}
              </div>
            </div>
            <div className='w-full p-2'>
              <Link to={`/Restaurant/${postData.resName}/${source}`}>
                <h2 className='sm:text-2xl text-xl text-orange-500 font-bold'>
                  {postData.resName}
                </h2>
              </Link>
              <div className='text-orange-500 border-r sm:text-xl text-sm'>
                {formatDate(postData.createdAt)}
              </div>
              <div className='text-orange-500 border-r sm:text-xl text-sm'>
                {postData.address}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: postData.description }}
                className='text-justify text-neutrals-500 mt-2 sm:text-md text-sm'
              />
            </div>
            <div className='w-full flex justify-center items-center'>
              <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all w-32'>
                <button className='w-full' onClick={() => navigate(`/`)}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
