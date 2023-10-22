import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "../../../utils";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";

export default function ViewOwnerPosting() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { postingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("/api/owner/getOwnerPost", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          params: { id: postingId },
        });
        if (response.status === 200) {
          setPostData(response.data);
        } else {
          console.error("Post Unavailable.");
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchPost();
  }, [userInfo.token, postingId]);

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `/api/owner/posting/delete/${postingId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        if (response.status === 200) {
          toast.success("Post Deleted");
          navigate(`/dineretso-restaurant/${postData.resName}/owner-posting`);
        } else {
          toast.error("Failed to delete post.");
        }
      } catch (error) {
        console.error(getError(error));
      }
    }
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  return (
    <div className='lg:ml-72 md::ml-72 sm::ml-72 p-5 font-inter'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full flex justify-center items-center flex-col space-y-5'>
          <div className='w-full flex flex-col space-y-2'>
            <h1 className='text-orange-500 text-2xl font-semibold'>
              {postData.title}
            </h1>
            <div>
              <p className='text-neutrals-500'>
                {formatDate(postData.createdAt)}
              </p>
              <div className='flex space-x-2'>
                {postData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className='px-2 py-1 rounded border border-orange-500 text-neutrals-500 flex justify-center items-center'
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex w-full justfy-start'>Post Content</div>
          <div
            dangerouslySetInnerHTML={{ __html: postData.description }}
            className='text-justify text-gray-700 mt-2 border p-2'
          />
          <div className='w-full grid grid-cols-3 gap-3 p-5'>
            {postData.images.map((image, index) => (
              <img
                key={index}
                src={image.secure_url}
                alt={`post-${index}`}
                className='w-96 max-h-[200px] rounded-lg'
              />
            ))}
          </div>
          <div className='w-full flex justify-center space-x-2'>
            <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all w-32'>
              <button
                className='w-full'
                onClick={() =>
                  navigate(`/dineretso-restaurant/editPost/${postData._id}`)
                }
              >
                Edit
              </button>
            </div>
            <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all w-32'>
              <button className='w-full' onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
