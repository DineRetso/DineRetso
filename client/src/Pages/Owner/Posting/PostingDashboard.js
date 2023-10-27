import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostingDashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [posts, setPost] = useState([]);
  const [resto, setResto] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullContent, setShowFullContent] = useState(false);
  const [pStatus, setPstatus] = useState("Approved");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `/api/owner/getPosting/${userInfo.myRestaurant}/${pStatus}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        const resto = await axios.get(`/api/owner/posting/getResto`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          params: { id: userInfo.myRestaurant },
        });
        if (response.status === 200) {
          setPost(response.data);
        }
        if (resto.status === 200) {
          setResto(resto.data);
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userInfo.myRestaurant, userInfo.token, setPost, setResto, pStatus]);
  const remainingPosts = 15 - resto.postCount;

  const filteredPosts = posts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    const tagsString = post.tags.join(" ").toLowerCase();
    const formattedDate = formatDate(post.createdAt);
    const postDate = formattedDate.toLowerCase();

    return (
      post.resName.toLowerCase().includes(searchLower) ||
      post.address.toLowerCase().includes(searchLower) ||
      tagsString.includes(searchLower) ||
      post.title.toLowerCase().includes(searchLower) ||
      postDate.includes(searchLower)
    );
  });

  const handleAddButton = (e) => {
    e.preventDefault();
    if (remainingPosts >= 15) {
      toast.info("Maximum posts have reached their limit.");
    } else {
      navigate(
        `/dineretso-restaurant/${userInfo.myRestaurant}/owner-posting/add`
      );
    }
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5 font-inter'>
      {loading ? (
        <div className='flex w-full justify-center items-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <div className='flex w-full justify-center items-center flex-col'>
          <div className='flex space-x-2 justify-between items-center w-full p-5 border-b'>
            <div>
              <h1 className='text-orange-500 text-2xl font-bold'>
                Posting Dashboard
              </h1>
            </div>
          </div>
          <div className='mt-2 flex justify-between items-center w-full space-x-5 p-5 '>
            <div>
              <h1 className='text-neutrals-500'>
                Remaining Post: {remainingPosts}
              </h1>
            </div>
            <div>
              <select
                className='p-2 w-full rounded-md text-sm border outline-orange-500 shadow-md text-neutrals-500'
                value={pStatus}
                onChange={(e) => setPstatus(e.target.value)}
              >
                <option value='Pending'>Pending</option>
                <option value='Approved'>Approved</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
            </div>
            <div className='flex flex-row justify-center items-center'>
              <div className='flex flex-row justify-center items-center '>
                <i className='material-icons text-2xl text-orange-500'>
                  search
                </i>
                <input
                  className='p-3 border-b '
                  placeholder='Search here...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className='border p-3 flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                <button className='w-full' onClick={handleAddButton}>
                  Submit Post
                </button>
              </div>
            </div>
          </div>
          <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 w-full'>
            {error ? (
              <div className='flex w-full justify-center items-center'>
                <h1>{error}</h1>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div>
                <h1>No Posts available.</h1>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post._id} className='mt-2'>
                  <div className='w-full'>
                    <div className=' bg-orange-300 p-2 hover:cursor-pointer'>
                      <div
                        className='text-xl font-semibold text-TextColor'
                        onClick={() =>
                          navigate(`/dineretso-restaurant/posting/${post._id}`)
                        }
                      >
                        {post.title}
                      </div>
                    </div>
                    <div className='w-full flex flex-row p-2'>
                      <div className='text-orange-500 border-r border-orange-500 px-2'>
                        {formatDate(post.createdAt)}
                      </div>
                      <div className='text-orange-500 px-2'>{post.resName}</div>
                    </div>
                    <div
                      className={`shadow-xl ${
                        showFullContent[post._id]
                          ? "p-2 text-neutrals-700 text-justify"
                          : "h-40 max-h-40 p-2 text-neutrals-700 text-justify"
                      } overflow-hidden`}
                      dangerouslySetInnerHTML={{ __html: post.description }}
                    ></div>
                    {post.description.length > 160 && (
                      <button
                        className='text-orange-500 underline w-full text-center'
                        onClick={() =>
                          setShowFullContent({
                            ...showFullContent,
                            [post._id]: !showFullContent[post._id],
                          })
                        }
                      >
                        {showFullContent[post._id] ? "View Less" : "View More"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
