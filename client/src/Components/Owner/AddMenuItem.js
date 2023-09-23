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
  const [menuImage, setMenuImage] = useState(""); // Add state for menuImage
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
    <div className='fixed inset-0 flex items-center justify-center  z-50'>
      <div
        className='bg-trans-background flex flex-col justify-center items-center p-10 rounded-md w-3/4
      bg-neutrals-700 bg-opacity-80'
      >
        <h2>Add Menu Item</h2>
        <form
          className='flex lg:flex-row md:flex-row flex-col w-full justify-center items-center space-x-5'
          onSubmit={handleAddMenuItem}
        >
          <div className='flex flex-col lg:w-1/2 md:w-1/2 sm:w-full'>
            <div className='border border-main h-60 w-full'>
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
                      className='w-full max-h-60 object-cover rounded-md'
                    />
                  </div>
                  <div>
                    <button
                      className='mt-2 text-sm bg-ButtonColor p-3 rounded-md w-auto text-warning'
                      onClick={removeImage}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center w-full h-full space-y-5'>
                  <div className='w-full h-full flex items-center justify-center rounded-md border border-main shadow-md shadow-main'>
                    No Image
                  </div>
                  <div>
                    <label className='cursor-pointer bg-ButtonColor p-3 rounded-md text-main mt-3'>
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
          <div className='flex flex-col lg:w-1/2 md:w-1/2 w-full space-y-5 justify-center items-center'>
            <input
              type='text'
              placeholder='Menu Name'
              className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              required
            />

            <input
              type='number'
              placeholder='Price'
              className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input
              type='text'
              placeholder='Classification'
              className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              required
            />
            <textarea
              placeholder='Description'
              className='mt-2 p-2 w-full bg-gray-200 rounded-xl'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <div>
              <button type='submit'>Add</button>
              <button
                onClick={() => {
                  removeImage();
                  onClose();
                }}
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
