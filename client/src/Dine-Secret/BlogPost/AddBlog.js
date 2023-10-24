import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const registeredReducer = (state, action) => {
  switch (action.type) {
    case "GET_RESTO":
      return { ...state, loading: true };
    case "GET_SUCCESS":
      return { ...state, Resto: action.payload, loading: false };
    case "GET_FAILED":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const initialRegisteredState = {
  Resto: [],
  loading: true,
  error: "",
};

export default function AddBlog() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [registeredState, registeredDispatch] = useReducer(
    registeredReducer,
    initialRegisteredState
  );
  const { loading, error, Resto } = registeredState;
  const params = useParams();
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      registeredDispatch({ type: "GET_RESTO" });
      try {
        const response = await axios.get(
          `/api/admin/getSubmittedPost/${params.id}`,
          {
            headers: { Authorization: `Bearer ${dineInfo.token}` },
          }
        );
        registeredDispatch({ type: "GET_SUCCESS", payload: response.data });
        setTitle(response.data.title);
        setDescription(response.data.description);
        setTags(response.data.tags);
        setSelectedImages(response.data.images);
        setSelectedVideo(response.data.video);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage =
            error.response.data.message || "No Restaurant Registered!";
          registeredDispatch({ type: "GET_FAILED", payload: errorMessage });
        } else {
          registeredDispatch({ type: "GET_FAILED", payload: error.message });
        }
      }
    };
    fetchRestaurants();
  }, [dineInfo.token, params.id]);
  const handleTagAdd = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
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

  const handleRemoveVideo = async (public_id) => {
    try {
      const response = await axios.delete(
        `/api/image/video/delete/${public_id}`,
        {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
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

  const handlePublish = async (e) => {
    e.preventDefault();
    setDataLoading(true);
    try {
      const blogPost = {
        title,
        description,
        tags,
        images: selectedImages,
        video: selectedVideo,
      };
      const response = await axios.put(
        `/api/admin/posting/approve/${Resto._id}`,
        blogPost,
        {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.success("Post Approved");
        navigate("/dine/admin/secret/blog-post");
      } else {
        toast.error("Error creating posting!");
      }
      setDataLoading(false);
    } catch (error) {
      console.error("Error creating blog post:", error);
      setDataLoading(false);
    }
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/admin/posting/cancel/${Resto._id}`,
        undefined,
        {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.success("Post Cancelled");
        navigate("/dine/admin/secret/blog-post");
      } else {
        toast.error("Error cancelling posting!");
      }
    } catch (error) {
      console.error("Error cancelling blog post:", error);
    }
  };

  const uploadimg = async (e) => {
    const files = e.target.files;
    const newSelectedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);

      try {
        const { data } = await axios.post(`/api/image`, bodyFormData, {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });

        // Add the uploaded image URL to the newSelectedImages array
        newSelectedImages.push(data.secure_url);

        toast.info("Image Uploaded");
      } catch (err) {
        console.error(err);

        toast.error("Failed to upload image!");
      }
    }
    setSelectedImages([...selectedImages, ...newSelectedImages]);
  };
  const handleRemoveImage = (indexToRemove) => {
    // Create a new array without the image at the specified index
    const updatedImages = selectedImages.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedImages(updatedImages);
  };

  return (
    <div className=' lg:ml-72 md:ml-72 sm:ml-72 p-5'>
      <div className='text-4xl font-bold text-orange-500 '>Manage Post</div>
      {dataLoading ? (
        <LoadingSpinner type='getPublish' />
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full'>
          <div>
            <form onSubmit={handlePublish}>
              <h1>{Resto.resName}</h1>
              <div className='w-full mt-7'>
                <label>Title</label>
                <input
                  className='w-full p-3 text-2xl border'
                  placeholder='Title here'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
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

                <div className='mt-2'>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className='bg-gray-300 px-2 py-1 rounded-full m-1'
                    >
                      {tag}
                      <button
                        type='button'
                        className='ml-2 text-red-500 hover:text-red-700'
                        onClick={() => removeTag(index)}
                      >
                        Remove Tag
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className='w-full'>
                <div className='flex flex-row'>
                  {/* Render uploaded images */}
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className='relative inline-block m-2'>
                      <img
                        src={imageUrl.secure_url}
                        alt={`Preview ${index}`}
                        className='max-w-full max-h-36 mb-2'
                      />
                      <button
                        type='button'
                        className='absolute top-0 right-0 text-red-500 hover:text-red-700'
                        onClick={() => handleRemoveImage(index)}
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
                    multiple
                  />
                </label>
              </div>
              <div className='w-full'>
                {selectedVideo && (
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
                      onClick={() => handleRemoveVideo(selectedVideo.public_id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className='w-full flex flex-row justify-center items-center mt-2 space-x-2'>
                <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                  <button type='submit' className='w-full'>
                    Publish
                  </button>
                </div>
                <div
                  onClick={handleCancel}
                  className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all hover:cursor-pointer'
                >
                  <h1>Cancel</h1>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
