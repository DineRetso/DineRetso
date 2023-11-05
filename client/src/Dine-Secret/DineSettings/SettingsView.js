import React, { useEffect, useState } from "react";
import DineProfile from "./DineProfile";
import Audit from "./Audit";
import { getError } from "../../utils";
import axios from "axios";

export default function SettingsView() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auditError, setAE] = useState("");
  const [dineData, setDineData] = useState({});
  const [auditData, setAuditData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const id = dineInfo._id;

  useEffect(() => {
    const fetchDine = async () => {
      try {
        const response = await axios.get("/api/admin/getDine", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
          params: { id },
        });
        if (response.status === 200) {
          setDineData(response.data);
        } else {
          setError("Admin Invalid");
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    const fetchAudits = async () => {
      try {
        const response = await axios.get("/api/admin/getAudits", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        if (response.status === 200) {
          setAuditData(response.data);
        } else {
          setAE("Audit Unavailable");
        }
        setLoading(false);
      } catch (error) {
        setAE(getError(error));
        setLoading(false);
      }
    };
    fetchDine();
    fetchAudits();
  });

  const filteredAudits = auditData.filter((audits) => {
    const searchLower = searchQuery.toLowerCase();
    const formattedDate = formatDate(audits.createdAt);
    const auditDate = formattedDate.toLowerCase();
    return (
      audits.action.toLowerCase().includes(searchLower) ||
      auditDate.includes(searchLower)
    );
  });

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  return (
    <div className='lg:ml-72 md:ml-72  sm:ml-72  p-5 font-inter'>
      <div className='w-full flex flex-row space-x-2 mb-2'>
        <div
          className={`text-md 
            font-semibold p-2 border-b border-orange-500 rounded-xl text-orange-500
          `}
        >
          Profile
        </div>
      </div>
      <div className='w-full'>
        <DineProfile dineData={dineData} />
      </div>
      <div className=' mt-5'>
        <div className='w-full flex flex-row justify-center items-center'>
          <i className='material-icons text-3xl text-orange-500'>search</i>
          <input
            className='w-full p-2 outline-none border-b border-orange-500'
            placeholder='Search here'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Audit auditData={filteredAudits} />
      </div>
    </div>
  );
}
