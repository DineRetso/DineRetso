import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../../Store";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getError } from "../../../utils";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";

export default function AddPosting() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [resto, setResto] = useState([]);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchResto = async () => {
      try {
        const response = await axios.get(`/api/owner/posting/getResto`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          params: { id: userInfo.myRestaurant },
        });
        if (response.status === 200) {
          setResto(response.data);
        } else {
          setError("Error fetching restaurant data");
        }
        setLoading(false);
        const currentDate = new Date();
        const formattedDate = currentDate.toDateString(); // You can format it as needed
        setCurrentDate(formattedDate);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchResto();
  }, [userInfo.token, userInfo.myRestaurant]);

  const uploadimg = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    const newSelectedImages = [];
    setImageLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bodyFormData = new FormData();
        bodyFormData.append("file", file);
        const { data } = await axios.post(`/api/image`, bodyFormData, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        newSelectedImages.push({
          public_id: data.public_id,
          secure_url: data.secure_url,
        });
      }

      setImageLoading(false);

      setSelectedImages([...selectedImages, ...newSelectedImages]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image!");

      setImageLoading(false);
    }
  };
  const handleRemoveImage = async (public_id) => {
    try {
      const response = await axios.delete(`/api/image/${public_id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (response.status === 200) {
        const updatedImages = selectedImages.filter(
          (img) => img.public_id !== public_id
        );
        setSelectedImages(updatedImages);
      } else {
        toast.error("Failed to delete the image.");
      }
    } catch (error) {
      // Handle errors
      console.error(error);
      toast.error("Failed to delete the image.");
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Selected video file size exceeds 25 MB.");
      return;
    }
    setImageLoading(true);
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      const { data } = await axios.post(`/api/image/video`, bodyFormData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      setSelectedVideo({
        public_id: data.public_id,
        secure_url: data.secure_url,
      });

      setImageLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload video!");

      setImageLoading(false);
    }
  };

  const handleRemoveVideo = async (public_id) => {
    try {
      const response = await axios.delete(
        `/api/image/video/delete/${public_id}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        setSelectedVideo(null);
      } else {
        toast.error("Failed to delete the image.");
      }
    } catch (error) {
      // Handle errors
      console.error(error);
      toast.error("Failed to delete the image.");
    }
  };

  const handleReturnButton = (e) => {
    e.preventDefault();
    navigate(`/dineretso-restaurant/${userInfo.myRestaurant}/owner-posting`);
  };
  const handleTagAdd = (e) => {
    e.preventDefault();
    if (newTag.trim() !== "") {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };
  const removeTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setDataLoading(true);

    try {
      const blogPost = {
        title,
        description,
        tags,
        resId: resto._id,
        resName: resto.resName,
        address: resto.address,
        fbLink: resto.fbLink,
        webLink: resto.webLink,
        category: resto.category,
        images: selectedImages,
        video: selectedVideo,
      };

      const response = await axios.post("/api/owner/posting/create", blogPost, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (response.status === 200) {
        setDataLoading(false);
        toast.success("Post submitted.");
        navigate(`/dineretso-restaurant/${resto.resName}/owner-posting`);
      } else {
        toast.error("Error submitting post.");
        setDataLoading(false);
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
      setDataLoading(false);
    }
  };
  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5 font-inter'>
      {dataLoading ? (
        <LoadingSpinner type='getPublish' />
      ) : (
        <div className='flex w-full flex-col space-y-5'>
          <div className='text-center text-4xl text-orange-500 font-bold'>
            <h1>Submit New Post</h1>
          </div>

          {error ? (
            <div>{error}</div>
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <div className='w-full'>
              <h1 className='text-xl'>{resto.resName}</h1>
              <div>
                <h2>{currentDate}</h2>
              </div>
              <form
                className='flex flex-col space-y-5'
                onSubmit={handlePublish}
              >
                <div className='w-full mt-7'>
                  <label>Title</label>
                  <input
                    className='w-full p-3 text-2xl border'
                    placeholder='Title here'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  ></input>
                </div>
                <label>Content</label>
                <ReactQuill value={description} onChange={setDescription} />
                <div>
                  <label>Tags</label>
                  <input
                    type='text'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder='Add tags'
                  />
                  <button onClick={handleTagAdd}>Add</button>

                  <div className='mt-2 flex space-x-2'>
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className=' border border-orange-500 p-2'
                      >
                        <span
                          key={index}
                          className='bg-gray-300 px-2 py-1 rounded-full m-1'
                        >
                          {tag}
                        </span>
                        <button
                          type='button'
                          className=' text-red-500 hover:text-red-700'
                          onClick={() => removeTag(index)}
                        >
                          <i className='fas fa-times'></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='w-full'>
                  <div className='flex flex-row'>
                    {selectedImages.map((image, index) => (
                      <div key={index} className='relative inline-block m-2'>
                        <img
                          src={image.secure_url}
                          alt={`Post Preview ${index}`}
                          className='max-w-full max-h-36 mb-2'
                        />
                        <button
                          type='button'
                          className='absolute top-0 right-0 text-red-500 hover:text-red-700'
                          onClick={() => handleRemoveImage(image.public_id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className='cursor-pointer text-blue-500'>
                    Add Image
                    <input
                      type='file'
                      className='hidden'
                      onChange={uploadimg}
                    />
                  </label>
                </div>

                {resto.paymentType && resto.paymentType === "Premium" && (
                  <div className='w-full'>
                    {selectedVideo ? (
                      <div className='relative inline-block m-2'>
                        <video
                          src={selectedVideo.secure_url}
                          alt='Uploaded Video'
                          className='max-w-full max-h-36 mb-2'
                          controls
                        />
                        <button
                          type='button'
                          className='absolute top-0 right-0 text-red-500 hover:text-red-700'
                          onClick={() =>
                            handleRemoveVideo(selectedVideo.public_id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className='cursor-pointer text-blue-500'>
                        Add Video
                        <input
                          type='file'
                          className='hidden'
                          onChange={uploadVideo}
                          accept='video/*'
                        />
                      </label>
                    )}
                  </div>
                )}

                <div className='w-full flex flex-row justify-center items-center mt-2 space-x-2'>
                  <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                    <button type='submit' className='w-full'>
                      Submit
                    </button>
                  </div>
                  <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                    <button className='w-full' onClick={handleReturnButton}>
                      Return
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
