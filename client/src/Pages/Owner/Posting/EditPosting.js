import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import axios from "axios";
import { getError } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

export default function EditPosting() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postData, setPostData] = useState({});
  const { postingId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("/api/owner/getOwnerPost", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          params: { id: postingId },
        });
        if (response.status === 200) {
          setPostData(response.data);
          setTitle(response.data.title);
          setDescription(response.data.description);
          setTags(response.data.tags);
          setSelectedImages(response.data.images);
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
  }, [userInfo.token, postingId, setTitle]);

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
    console.log(public_id);
    try {
      const response = await axios.delete(`/api/image/${public_id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (response.status === 200) {
        const updatedImages = selectedImages.filter(
          (img) => img.public_id !== public_id
        );
        setSelectedImages(updatedImages);
        toast.success("remov");
      } else {
        toast.error("Failed to delete the image.");
      }
    } catch (error) {
      // Handle errors
      console.error(error);
      toast.error("Failed to delete the image.");
    }
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

  const handleEditButton = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const blogPost = {
        title,
        description,
        tags,
        images: selectedImages,
      };
      const response = await axios.put(
        `/api/owner/posting/edit/${postData._id}`,
        blogPost,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.success("Post Updated");
        navigate(`/dineretso-restaurant/posting/${postData._id}`);
      } else {
        toast.error("Edit failed.");
      }
      setLoading(false);
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
      setLoading(false);
    }
  };
  return (
    <div className='lg:ml-72 md::ml-72 sm::ml-72 p-5 font-inter'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full'>
          <form className='flex flex-col space-y-5' onSubmit={handleEditButton}>
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
                  <div key={index} className=' border border-orange-500 p-2'>
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
                <input type='file' className='hidden' onChange={uploadimg} />
              </label>
            </div>
            <div className='w-full flex flex-row justify-center items-center mt-2 space-x-2'>
              <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                <button type='submit' className='w-full'>
                  Save
                </button>
              </div>
              <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                <button
                  className='w-full'
                  onClick={() =>
                    navigate(`/dineretso-restaurant/posting/${postData._id}`)
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
