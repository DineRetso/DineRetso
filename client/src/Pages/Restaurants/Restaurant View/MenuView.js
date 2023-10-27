import React, { useEffect, useState } from "react";
import { getError } from "../../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";

export default function MenuView() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [menuData, setMenuData] = useState({});
  const { menuId } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `/api/restaurant/Menu/getMenuItem/${menuId}`
        );
        if (response) {
          setMenuData(response.data);
        } else {
          setError("Menu Unavailable");
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchMenu();
  }, [menuId]);

  return (
    <div className='w-full flex justify-center items-center flex-col'>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full flex justify-center items-center'>
          <div>
            {menuData.menuImage ? (
              <img
                src={menuData.menuImage}
                alt={menuData.menuName}
                className='w-full max-h-96 rounded-t-md object-cover'
              />
            ) : (
              <div>
                <img
                  className='w-64 h-40 sm:h-48 sm:w-80 rounded-t-md'
                  src='/dineLogo.jpg'
                  alt='menuImage'
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
