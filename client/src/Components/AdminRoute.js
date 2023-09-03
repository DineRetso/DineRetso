import React, { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import axios from "axios"; // Make sure you have axios installed
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  // State to track if user information is loading
  const [isLoading, setIsLoading] = useState(true);

  // State to store user information
  const [isAdmin, setIsAdmin] = useState(false); // Initialize isAdmin to false

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userInfo) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      const id = userInfo._id;
      try {
        const response = await axios.post("/api/users/userInfo", {
          _id: id,
        });

        if (response.data && response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userInfo]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return navigate("/login");
  }

  return children;
}
