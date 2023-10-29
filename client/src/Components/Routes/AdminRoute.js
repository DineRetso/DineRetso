import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import axios from "axios"; // Make sure you have axios installed
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";

export default function AdminRoute({ children }) {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const fetchDineInfo = async () => {
      if (dineInfo === null) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      } else {
        try {
          const id = dineInfo._id;
          const response = await axios.post("/api/admin/dineInfo", {
            _id: id,
          });

          if (response.data && response.data.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching admin info:", error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchDineInfo();
  }, [dineInfo]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    toast.info("Unauthorized!");
    return navigate("/login");
  }

  return children;
}
