import React, { useEffect, useState } from "react";
import { getError } from "../../utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ViewPosting() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sorted, setSorted] = useState([]);

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const response = await axios.get("/api/admin/getPosting", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        if (response.status === 200) {
          setPosts(response.data);
        } else {
          console.error("No posts found.");
        }
      } catch (error) {
        console.log(error);
        setError(getError(error));
      }
    };
    fetchPosting();
  }, [dineInfo.token]);

  const filteredAndSortedPosts = posts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    const tagsString = post.tags.join(" ").toLowerCase();
    return (
      (selectedCategory === "All" || post.category === selectedCategory) &&
      (post.resName.toLowerCase().includes(searchLower) ||
        post.address.toLowerCase().includes(searchLower) ||
        tagsString.includes(searchLower) ||
        post.title.toLowerCase().includes(searchLower))
    );
  });

  const filteredPosts = posts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    const tagsString = post.tags.join(" ").toLowerCase();
    return (
      post.resName.toLowerCase().includes(searchLower) ||
      post.address.toLowerCase().includes(searchLower) ||
      tagsString.includes(searchLower) ||
      post.title.toLowerCase().includes(searchLower)
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
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5 font-inter'>
      <div className='flex lg:flex-row md:flex-row flex-col justify-between'>
        <div className='flex  space-x-2 justify-center items-center'>
          <div>
            <h1 className='text-xl text-neutrals-500 font-semibold'>
              Categories
            </h1>
          </div>
          <div className='border p-1  text-neutrals-500 '>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value='All'>All</option>
              <option value='Famous'>Famous</option>
              <option value='Local'>Local</option>
              <option value='Unique'>Unique</option>
            </select>
          </div>
          <div className='flex flex-row justify-center items-center '>
            <i className='material-icons text-xl text-orange-500'>search</i>
            <input
              className='p-2 border-b'
              placeholder='Search here...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></input>
          </div>
        </div>
        <div className='border flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
          <button onClick={() => navigate("/dine/admin/secret/blog-post")}>
            Manage Posts
          </button>
        </div>
      </div>
      <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5'>
        {posts.length === 0 ? (
          <div className='py-5 text-xl text-neutrals-600 font-semibold'>
            <h1>No Posts made</h1>
          </div>
        ) : (
          filteredAndSortedPosts.map((post) => (
            <div key={post._id} className='mt-2'>
              <div className='w-full'>
                <div className=' bg-orange-300 p-2'>
                  <div className='text-xl font-semibold text-TextColor'>
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
  );
}
