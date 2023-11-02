import React, { useEffect, useState, useMemo, useref } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { getError } from "../../utils";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function RestaurantView2() {
  const [restoData, setRestoData] = useState({});
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResto = async () => {
      try {
        const response = await axios.get(`/api/admin/getResto/${params.id}`, {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        if (response.status === 400) {
          setError("Invalid Restaurant");
        } else {
          setRestoData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchResto();
  }, [params.id, dineInfo.token]);

  return (
    <div className='sm:ml-72  flex flex-col font-inter lg:p-5 md:p-4 sm:p-3 p-2'>
      {error ? (
        <div className='flex justify-center items-center'>
          <h1>{error}</h1>
        </div>
      ) : loading ? (
        <div className='flex justify-center items-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <div className='flex flex-col'>
          <div className='w-full object-cover max-h-72 h-60 border flex justify-center items-center'>
            {restoData.bgPhoto ? (
              <div className='w-full h-60 object-cover relative'>
                <img
                  src={restoData.bgPhoto}
                  alt='bg'
                  className='w-full h-full object-cover'
                />
              </div>
            ) : (
              <div className='w-full flex justify-center items-center flex-col'>
                <h1 className='text-neutrals-500'>No Background Image</h1>
              </div>
            )}
          </div>
          <div className='flex lg:flex-row  flex-col justify-start items-center'>
            <div className='w-72'>
              {restoData.profileImage ? (
                <div className='w-full object-cover relative'>
                  <img
                    src={restoData.profileImage}
                    alt='profile'
                    className='w-full h-full object-cover'
                  />
                </div>
              ) : (
                <div className='w-full flex justify-center items-center flex-col h-full'>
                  <h1 className='text-neutrals-500'>No Profile Image</h1>
                </div>
              )}
            </div>
            <div className='w-auto flex flex-col sm:p-2'>
              <input
                className='border-b p-2 w-full text-xl text-orange-500 outline-none focus:border-orange-500 font-semibold'
                type='text'
                value={restoData.resName}
                disabled
              />
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2'>Owned by: </h2>
                <input
                  className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                  type='text'
                  value={restoData.owner}
                  disabled
                />
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Address: </h2>
                <input
                  className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                  type='text'
                  value={restoData.address}
                  disabled
                />
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Category: </h2>
                <select className='w-full p-2 outline-none focus:border-orange-500 text-neutrals-500'>
                  <option value={restoData.category}>
                    {restoData.category}
                  </option>
                </select>
              </div>
              <div className='w-full flex justify-center'>
                <h2 className='w-32 p-2 '>Phone No: </h2>
                <input
                  className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                  type='text'
                  value={restoData.phoneNo}
                  disabled
                />
              </div>
              <div className='w-full flex sm:flex-row flex-col justify-center items-start'>
                <div className='flex w-full'>
                  <h2 className='w-32 p-2 '>Open At: </h2>
                  <input
                    className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                    type='time'
                    value={restoData.openAt ? restoData.openAt : ""}
                    disabled
                  />
                </div>
                <div className='flex w-full'>
                  <h2 className='w-32 p-2 '>Close At: </h2>
                  <input
                    className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                    type='time'
                    value={restoData.closeAt ? restoData.closeAt : ""}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <div className='w-full flex p-2'>
              <h2 className='w-40 p-2 '>Facebook Link: </h2>
              <input
                className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                type='text'
                value={restoData.fbLink ? restoData.fbLink : ""}
                disabled
              />
            </div>
            <div className='w-full flex p-2'>
              <h2 className='w-40 p-2 '>Instagram Link: </h2>
              <input
                className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                type='text'
                value={restoData.igLink ? restoData.igLing : ""}
                disabled
              />
            </div>
            <div className='w-full flex p-2'>
              <h2 className='w-40 p-2 '>Website Link: </h2>
              <input
                className='border-b p-2 w-full outline-none focus:border-orange-500 text-neutrals-500'
                type='text'
                value={restoData.webLink ? restoData.webLink : ""}
                disabled
              />
            </div>
          </div>
          <div className='w-full flex flex-col sm:p-2 mt-2'>
            <label className='text-xl text-orange-500'>Description:</label>
            <textarea
              className='w-full h-60 text-sm text-justify p-2 border outline-neutrals-500'
              value={restoData.description}
              disabled
            ></textarea>
          </div>
          <div className='w-full flex flex-col sm:p-2'>
            <label className='text-xl text-orange-500 font-semibold'>
              Pin Location:
            </label>
            {restoData.pinLocation ? (
              <div id='map' style={{ height: "300px" }}>
                <MapContainer
                  center={[
                    restoData.pinLocation.lat,
                    restoData.pinLocation.lng,
                  ]}
                  zoom={13}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <Marker
                    icon={L.icon({
                      iconUrl: "/pinpoint.png",
                      iconSize: [30, 30],
                    })}
                    position={[
                      restoData.pinLocation.lat,
                      restoData.pinLocation.lng,
                    ]}
                  >
                    <Popup minWidth={90}>Restaurant Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className='flex justify-center items-center'>
                No Pin Location
              </div>
            )}
          </div>
          <div className='w-full flex flex-row justify-evenly items-center p-1'>
            <div className='border p-1 w-16 flex justify-center items-center rounded-xl border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
              <button
                className='w-full'
                onClick={() => navigate("/dine/admin/secret/restaurants")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
