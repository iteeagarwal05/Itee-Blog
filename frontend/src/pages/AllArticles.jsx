import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../services/blogService";
import DOMPurify from "dompurify";
import {
  FiSearch,
  FiClock,
  FiCalendar,
  FiHeart,
  FiUser,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AllArticles() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Latest First");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const { data } = await getBlogs({ page: 1, limit: 1000 });
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Filter posts based on search term and sort criteria
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === "Oldest First") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort select change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">All Articles</h1>
        <p className="text-lg">
          Discover insights, tutorials, and stories from our community of creators
        </p>
      </section>

      {/* Filters + Search */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              "All",
              "Technology",
              "Development",
              "Design",
              "JavaScript",
              "CSS",
            ].map((cat, i) => (
              <button
                key={i}
                className={`px-4 py-1.5 rounded-lg border text-sm font-medium ${
                  cat === "All"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option>Latest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg text-blue-500 font-semibold">
              Loading post...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {post.tags?.[0] && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/posts/${post.slug}`}>
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {stripHtml(post.content).substring(0, 120)}...
                  </p>
                  <div className="text-xs text-gray-500 flex flex-col gap-1 mt-auto">
                    <div className="flex items-center gap-2">
                      <FiUser />
                      <span>{post.author?.username || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>
                        {Math.max(
                          2,
                          Math.round(
                            stripHtml(post.content).split(" ").length / 200
                          )
                        )}{" "}
                        min read
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiHeart />
                      <span>{Math.floor(Math.random() * 200)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
