import React, { useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import { Store } from "../../Store";

export default function AddMenuItem({ onAddMenuItem, onClose }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [menuName, setMenuName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [menuImage, setMenuImage] = useState(); // Add state for menuImage
  const [isAvailable, setIsAvailable] = useState(true); // Add state for isAvailable
  const [classification, setClassification] = useState(""); // Add state for classification
  const [loading, setLoading] = useState();
  const [imagePublicId, setImagePublicId] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const uploadimg = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/image`, bodyFormData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setMenuImage(data.secure_url);
      setImagePublicId(data.public_id);
      toast.info("Image Uploaded");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Failed to upload image!");
    }
  };

  const removeImage = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/image/${imagePublicId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setMenuImage("");
      setImagePublicId("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  const handleAddMenuItem = () => {
    // Validate and submit the menu item data
    if (!menuName || !description || !price || !classification) {
      // Handle validation error
      toast.error("Please fill out all fields.");
    } else {
      // Add the menu item and close the component
      onAddMenuItem({
        menuName,
        description,
        price,
        menuImage,
        classification,
        imagePublicId,
      });
      onClose();
    }
  };

  return (
    <div className='fixed flex inset-0 items-center justify-center z-[1] top-0 left-0 sm:left-auto w-full sm:w-3/4 h-screen'>
      <div
        className='bg-TextColor flex flex-col justify-center items-center p-5 sm:p-10 rounded-md w-full sm:w-1/2
    border border-orange-500'
      >
        <h2 className='text-2xl text-orange-500'>ADD NEW MENU</h2>
        <form
          className='flex flex-col w-full justify-center items-center space-y-1 sm:space-y-1 text-sm'
          onSubmit={handleAddMenuItem}
        >
          <div className='flex flex-col w-full space-y-1 sm:space-y-1 justify-center items-center'>
            <div className='w-full'>
              <label>Name</label>
              <input
                type='text'
                className='p-2 w-full rounded-md text-sm border outline-orange-500'
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                required
              />
            </div>
            <div className='w-full'>
              <label className='text-md'>Price</label>
              <input
                type='number'
                className='p-2 w-full rounded-md text-sm border outline-orange-500'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className='w-full'>
              <label>Classification</label>
              <input
                type='text'
                className='p-2 w-full rounded-md text-sm border outline-orange-500'
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                required
              />
            </div>
            <div className='w-full'>
              <label>Description</label>
              <textarea
                className='p-2 w-full rounded-md text-sm border outline-orange-500'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className='flex flex-col w-full h-auto'>
            <div className='border border-main h-40 sm:h-60 w-full'>
              {loading ? (
                <div className='w-full h-full flex items-center justify-center rounded-md shadow-md'>
                  <LoadingSpinner type='uploading' />
                </div>
              ) : menuImage ? (
                <div className='bg-cover flex flex-col justify-center items-center'>
                  <div>
                    <img
                      src={menuImage}
                      alt='Selected'
                      className='w-full max-h-32 sm:max-h-52 object-contain rounded-md'
                    />
                  </div>
                  <div className='border border-orange-500 flex justify-center items-center w-1/2 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
                    <button className='w-full' onClick={removeImage}>
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center w-full h-full space-y-3 sm:space-y-5'>
                  <div className='w-full h-full flex items-center justify-center rounded-md border border-main shadow-md'>
                    No Image
                  </div>
                  <div>
                    <label className='cursor-pointer bg-ButtonColor p-2 sm:p-3 rounded-md text-main mt-2 sm:mt-3'>
                      Add Image
                      <input
                        type='file'
                        className='hidden'
                        accept='image/*'
                        onChange={uploadimg}
                        id='image'
                      />
                    </label>
                  </div>
                  <input
                    className='hidden shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='image'
                    type='text'
                    placeholder='Image name'
                    value={menuImage}
                    onChange={(e) => setMenuImage(e.target.value)}
                    style={{ cursor: "not-allowed" }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row w-full sm:pt-5 pt-10 space-x-4'>
            <div className='border border-orange-500 flex justify-center items-center w-3/4 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
              <button type='submit' className='w-full'>
                Add
              </button>
            </div>
            <div className='border border-orange-500 flex justify-center items-center w-3/4 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
              <button
                onClick={() => {
                  removeImage();
                  onClose();
                }}
                className='w-full'
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Define prop types for the component
AddMenuItem.propTypes = {
  onAddMenuItem: PropTypes.func.isRequired, // Function to handle adding a menu item
  onClose: PropTypes.func.isRequired, // Function to handle closing the component
};
