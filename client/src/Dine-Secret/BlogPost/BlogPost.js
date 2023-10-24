import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getError } from "../../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, Posts: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const initialState = {
  Posts: [],
  loading: true,
  error: "",
};

export default function BlogPost() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [State, Dispatch] = useReducer(reducer, initialState);
  const { loading, error, Posts } = State;
  const navigate = useNavigate();
  const [pS, setPS] = useState("Pending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPendingResto = async () => {
      Dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/admin/getPosting", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        Dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        Dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchPendingResto();
  }, [dineInfo.token, Dispatch]);

  const filteredAndSortedPosts = Posts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    const tagsString = post.tags.join(" ").toLowerCase();
    const formattedDate = formatDate(post.createdAt);
    const postDate = formattedDate.toLowerCase();
    return (
      ((post.status === pS && selectedCategory === "All") ||
        post.category === selectedCategory) &&
      (post.resName.toLowerCase().includes(searchLower) ||
        post.address.toLowerCase().includes(searchLower) ||
        tagsString.includes(searchLower) ||
        postDate.includes(searchLower) ||
        post.title.toLowerCase().includes(searchLower))
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
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5'>
      <div className='flex flex-row w-full justify-between'>
        <div className='flex flex-row space-x-2'>
          <div>
            <select
              className='p-2 w-full rounded-md text-sm border outline-orange-500 shadow-md text-neutrals-500'
              value={pS}
              onChange={(e) => setPS(e.target.value)}
            >
              <option value='Pending'>Pending</option>
              <option value='Approved'>Approved</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
          </div>
          <div>
            <select
              className='p-2 w-full rounded-md text-sm border outline-orange-500 shadow-md text-neutrals-500'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value='All'>All</option>
              <option value='Famous'>Famous</option>
              <option value='Local'>Local</option>
              <option value='Unique'>Unique</option>
            </select>
          </div>
          <div className='flex flex-row justify-center items-center'>
            <i className='material-icons  text-xl text-orange-500'>search</i>
            <input
              className='p-2 border-b'
              placeholder='Search here...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></input>
          </div>
        </div>
        <div className='border flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
          <button onClick={() => navigate("/dine/admin/secret/posting")}>
            Return
          </button>
        </div>
      </div>
      <div>
        <h1>Total Post: {filteredAndSortedPosts.length}</h1>
      </div>
      <div className='mt-4'>
        <table className='w-full border border-collapse'>
          <thead className='border'>
            <tr className='border'>
              <th className='py-2 border border-solid  p-2'>Restaurant Name</th>

              <th className='py-2 border border-solid  p-2'>Date</th>
              <th className='py-2 border border-solid p-2'>
                Remaining Blog Posts
              </th>
              <th className='py-2 border border-solid p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPosts.map((post) => (
              <tr key={post._id}>
                <td className='border py-2 text-center'>{post.resName}</td>

                <td className='border py-2 text-center'>
                  {formatDate(post.createdAt)}
                </td>
                <td className='border py-2 text-center'>{post.status}</td>
                <td className='border py-2 text-center'>
                  <button
                    onClick={() =>
                      navigate(`/dine/admin/secret/add-blog-post/${post._id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
