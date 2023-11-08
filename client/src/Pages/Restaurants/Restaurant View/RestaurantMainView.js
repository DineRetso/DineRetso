import axios from "axios";
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { Store } from "../../../Store";

import Menu from "../../../Components/Restaurant/Menu";
import Review from "../../../Components/Restaurant/Review";
import Posts from "../../../Components/Restaurant/Posts";
import { getError } from "../../../utils";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, Restaurant: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function RestaurantMainView() {
  const [{ loading, error, Restaurant }, dispatch] = useReducer(reducer, {
    loading: true,
    Restaurant: [],
    error: "",
  });
  const params = useParams();
  const [classi, setClassi] = useState([]);
  const [menuItem, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rates, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerId, setReviewerId] = useState("");
  const [location, setLocation] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [loc, setLoc] = useState("");
  const [classMenu, setClassMenu] = useState("All");
  const [pinLocation, setPinLocation] = useState({});

  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          const { lat, lng } = marker.getLatLng();
          setPinLocation({ lat, lng });
        }
      },
    }),
    []
  );

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/restaurant/${params.resName}/${params.source}`
        );
        if (response.data.pinLocation) {
          const pL = response.data.pinLocation;
          setPinLocation(pL);
        }

        const items = response.data.menu.filter(
          (menu) => menu.isAvailable === true
        );
        const uniqueClassifications = Array.from(
          new Set(items.map((menu) => menu.classification))
        );
        const post = response.data.blogPosts.filter(
          (pos) => pos.status === "Approved"
        );
        if (post && post.length > 1) {
          post.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        const rev = response.data.restoReview.filter(
          (review) => review.status === "approved"
        );
        if (rev && rev.length > 1) {
          rev.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        if (classMenu === "All") {
          setMenuItems(items);
        } else {
          setMenuItems(
            response.data.menu.filter(
              (menu) =>
                menu.classification === classMenu && menu.isAvailable === true
            )
          );
        }
        setReviews(rev);
        setClassi(uniqueClassifications);
        setPosts(post);

        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        console.error(getError(error));
      }
    };
    fetchRestaurant();
  }, [params.resName, params._id, params.source, classMenu]);

  useEffect(() => {
    if (userInfo && userInfo.fName) {
      setReviewerName(userInfo.fName + " " + userInfo.lName);
      setLocation(userInfo.address);
      setReviewerId(userInfo._id);
    }
  }, [userInfo]);

  //submit rating
  const rateHandler = async (e) => {
    e.preventDefault();
    if (!userInfo || !userInfo.token) {
      navigate("/login");
      return;
    }
    if (rates === null || rates === undefined) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    const rating = Math.round(rates * 2) / 2;
    try {
      const response = await axios.post(
        `/api/restaurant/add-review/${params.resName}`,
        { reviewerId, reviewerName, comment, rating, location },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.info(response.data.message);
        setRating("");
        setComment("");
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };
  const calculateAverage = () => {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRatings = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    const averageRating = totalRatings / reviews.length;
    return averageRating;
  };
  const averageRating = calculateAverage();

  return (
    <div className='flex flex-col justify-center items-center w-full font-inter'>
      <div className='head-container w-full mt-[-110px] mb-2'>
        <div className='w-full h-80 border'>
          {!Restaurant.bgPhoto ? (
            <div className='flex w-full h-full justify-center items-center text-neutrals-500 border '>
              <h1>No Background Image</h1>
            </div>
          ) : (
            <img
              className='h-full w-full object-cover'
              src={Restaurant.bgPhoto}
              alt='Restaurant Background'
            />
          )}
        </div>
      </div>
      <div className='w-full p-4 sm:p-2 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-x-5 mb-3 bg-orange-100 rounded-lg shadow-md'>
        <div className='w-32 h-32 sm:w-60 sm:h-60 lg:w-72 lg:h-72 border-2 border-orange-700 rounded-full overflow-hidden'>
          <img
            src={Restaurant.profileImage}
            alt={Restaurant.resName}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='w-full text-center sm:text-left'>
          <h1 className='text-4xl sm:text-5xl font-bold text-orange-500 capitalize'>
            {Restaurant.resName}
          </h1>
          <div className='text-sm sm:text-base mt-2 text-justify text-neutrals-500'>
            <p>{Restaurant.description}</p>
          </div>
          <div className='flex w-full justify-start items-center'>
            <i className='material-icons text-orange-500'>pin_drop</i>
            <span className='text-sm sm:text-base text-neutrals-500'>
              {Restaurant.address}
            </span>
          </div>
          <div className='flex w-full justify-start items-center'>
            <i className='material-icons text-orange-500'>call</i>
            <span className='text-sm sm:text-base text-neutrals-500'>
              {Restaurant.phoneNo}
            </span>
          </div>
          {Restaurant.openAt && Restaurant.closeAt && (
            <div className='w-full flex space-x-3 mt-3'>
              <div>
                <label className='text-neutrals-500 text-sm sm:text-base'>
                  Open At:{" "}
                </label>
                <span className='text-orange-500 text-sm sm:text-base'>
                  {Restaurant.openAt}
                </span>
              </div>
              <div>
                <label className='text-neutrals-500 text-sm sm:text-base'>
                  Close At:{" "}
                </label>{" "}
                <span className='text-orange-500 text-sm sm:text-base'>
                  {Restaurant.closeAt}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='sticky w-full sm:top-[87px] top-[70px] flex justify-center items-center space-x-3 shadow-md h-14 p-3 z-40 sm:text-xl text-xs bg-TextColor bg-opacity-60  '>
        <a
          href='#menu'
          onClick={() => setLoc("menu")}
          className={`${
            loc === "menu" && "text-orange-500 p-2 border-b border-orange-500"
          }`}
        >
          MENUS
        </a>
        <a
          href='#posts'
          onClick={() => setLoc("posts")}
          className={`${
            loc === "posts" && "text-orange-500 p-2 border-b border-orange-500"
          }`}
        >
          BLOG POSTS
        </a>
        <a
          href='#reviews'
          onClick={() => setLoc("reviews")}
          className={`${
            loc === "reviews" &&
            "text-orange-500 p-2 border-b border-orange-500"
          }`}
        >
          REVIEWS
        </a>
        <a
          href='#contacts'
          onClick={() => setLoc("contacts")}
          className={`${
            loc === "contacts" &&
            "text-orange-500 p-2 border-b border-orange-500"
          }`}
        >
          CONTACTS
        </a>
      </div>
      <div
        id='menu'
        className='flex flex-col h-screen w-11/12 overflow-y-hidden overflow-hidden space-y-5 shadow-xl sm:p-5 p-2'
      >
        <div className='flex space-x-2'>
          <div
            className={`border p-2 rounded-md hover:cursor-pointer ${
              classMenu === "All" && "bg-orange-500 text-TextColor"
            }`}
            onClick={() => setClassMenu("All")}
          >
            All
          </div>
          {classi.map((classification, index) => (
            <div
              key={index}
              className={`p-2 border rounded-md hover:cursor-pointer ${
                classMenu === classification && "bg-orange-500 text-TextColor"
              }`}
              onClick={() => setClassMenu(classification)}
            >
              {classification}
            </div>
          ))}
        </div>
        {menuItem && menuItem.length > 0 ? (
          <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-5 gap-2 max-h-screen overflow-y-auto overflow-x-hidden'>
            {menuItem.map((menu, index) => (
              <div key={index} className='flex flex-col shadow-lg'>
                <Menu menu={menu} pid={params.resName} />
              </div>
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-60  w-full  '>
            <h1 className='text-neutrals-500 font-semibold'>
              No Menu available
            </h1>
          </div>
        )}
      </div>
      <div id='posts' className='my-5 text-center bg-orange-500 p-3 w-full'>
        <h1 className='sm:text-5xl text-xl text-TextColor font-semibold'>
          Dining Discoveries
        </h1>
      </div>
      <div className='flex lg:w-9/12 w-full flex-col space-y-5 lg:px-20 md:px-16 sm:px-12 px-2 max-h-screen shadow-lg overflow-y-auto'>
        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <div
                key={post._id}
                className='flex flex-col w-full border shadow-lg p-4 justify-center items-center'
              >
                <Posts post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-60 border w-full  '>
            <h1 className='text-neutrals-500 font-semibold'>
              No post available
            </h1>
          </div>
        )}
      </div>
      <div
        id='reviews'
        className='text-center my-5 border-b w-full bg-orange-500 p-3'
      >
        <h1 className='sm:text-5xl text-xl text-TextColor font-semibold'>
          Reviews
        </h1>
      </div>
      <div className='flex flex-col max-h-screen w-full md:w-11/12 overflow-y-auto space-y-5 shadow-xl md:p-5 p-2'>
        {reviews && reviews.length > 0 ? (
          <div className='w-full flex flex-col overflow-y-auto'>
            <div className='w-full flex justify-between items-center border-b p-3'>
              <div className='w-1/2 md:w-1/4 border-r flex flex-col'>
                <h1 className='text-lg md:text-xl font-semibold'>
                  Total Reviews
                </h1>
                <h1 className='text-2xl md:text-3xl font-semibold'>
                  {reviews.length}
                </h1>
              </div>
              <div className='flex flex-col items-center'>
                <h1 className='text-lg md:text-xl font-semibold'>
                  {averageRating.toFixed(1)}/5
                </h1>
                <Rating
                  name='read-only'
                  size='large'
                  value={averageRating}
                  readOnly
                  precision={0.1}
                  title={`Average Rating: ${averageRating.toFixed(1)}`}
                />
              </div>
            </div>
            <div className='w-full h-96 md:h-[500px] overflow-y-auto'>
              {reviews.map((rev, index) => (
                <div key={index}>
                  <Review rev={rev} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex w-full justify-center items-center h-40'>
            <h1 className='text-neutrals-500 font-semibold'>
              No review available
            </h1>
          </div>
        )}
      </div>
      <div className='lg:w-9/12 w-full p-2 my-5'>
        {userInfo ? (
          <form className='w-full flex flex-col' onSubmit={rateHandler}>
            <div className='flex flex-row  justify-start items-center'>
              <label className='text-lg md:text-xl font-semibold text-neutrals-500 sm:pr-5'>
                Your rating
              </label>
              <Rating
                name='half-rating'
                size='large'
                value={parseFloat(rates)}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                precision={0.5}
              />
            </div>
            <div className='w-full flex flex-col items-center'>
              <label className='text-lg md:text-xl font-semibold text-neutrals-500'>
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className='mt-2 h-32 p-3 w-full rounded-md text-base md:text-sm border outline-orange-500 shadow-md'
              ></textarea>
            </div>
            <div className='w-full flex justify-center items-center mt-2'>
              <div className='border border-orange-500 flex justify-center items-center w-1/2 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
                <button className='w-full' type='submit'>
                  Submit
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className='w-full flex justify-center items-center flex-col'>
            <h1 className='text-lg md:text-xl font-semibold text-neutrals-500'>
              Please login to submit a rating!
            </h1>
            <div className=' mt-2 text-center border border-orange-500 flex justify-center items-center w-1/2 hover:bg-orange-500 text-orange-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
              <a href='/login' className='w-full'>
                Login
              </a>
            </div>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col justify-center sm:p-2'>
        {pinLocation && pinLocation.lat && pinLocation.lng && (
          <div className='w-full flex flex-col justify-center'>
            <label className='text-xl text-orange-500 font-semibold'>
              About
            </label>

            <div id='map' style={{ height: "300px" }}>
              <MapContainer
                center={[pinLocation.lat, pinLocation.lng]}
                zoom={15}
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <Marker
                  icon={L.icon({
                    iconUrl: "/pinpoint.png",
                    iconSize: [30, 30],
                  })}
                  position={[pinLocation.lat, pinLocation.lng]}
                >
                  <Popup minWidth={90}>{Restaurant.resName} location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
      <footer
        id='contacts'
        className='w-full bg-gray-800 text-TextColor bg-orange-500 py-6'
      >
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center px-4'>
          <div className='mb-4 md:mb-0'>
            <h1 className='text-2xl font-bold'>{Restaurant.category}</h1>
            <div className='flex items-center mt-2'>
              <i className='material-icons text-gray-400 text-lg'>
                location_on
              </i>
              <span className='ml-2'>{Restaurant.address}</span>
            </div>
            <div className='flex items-center mt-2'>
              <i className='material-icons text-gray-400 text-lg'>phone</i>
              <span className='ml-2'>{Restaurant.phoneNo}</span>
            </div>
          </div>
          <div className='flex'>
            <a
              href={Restaurant.fbLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center mr-6 text-gray-400'
            >
              <i className='material-icons text-4xl'>facebook</i>
            </a>
            <a
              href={Restaurant.igLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-400'
            >
              <i className='material-icons text-4xl'>link_sharp</i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
