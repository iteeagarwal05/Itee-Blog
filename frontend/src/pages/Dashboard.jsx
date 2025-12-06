import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyBlogs, togglePublishBlog } from "../services/blogService";

export default function Dashboard() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusToggle = async (postId, currentStatus) => {
    try {
      const updated = await togglePublishBlog(postId, !currentStatus);
      setMyBlogs((prev) =>
        prev.map((blog) =>
          blog._id === postId ? { ...blog, isPublished: updated.isPublished } : blog
        )
      );
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Could not update post status.");
    }
  };
  

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const blogs = await getMyBlogs();
        setMyBlogs(blogs || []); // fallback to empty array
      } catch (error) {
        console.error("Failed to fetch user blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Blog Posts</h1>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Create New Post
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Loading your blogs...</p>
        ) : myBlogs.length === 0 ? (
          <p className="text-gray-600 text-center">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBlogs.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col"
              >
                {/* Cover Image */}
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt="Cover"
                    className="h-40 w-full object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-sm mb-4">
                    No Image
                  </div>
                )}
                {/* Title & Content */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title || "Untitled"}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {post.content?.length > 100
                    ? post.content.substring(0, 100) + "..."
                    : post.content || "No content available"}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* Action Buttons */}
                <div className="mt-auto flex justify-end space-x-2">
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit/${post._id}`}
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <button
                  onClick={async () => {
                    await handleStatusToggle(post._id, post.isPublished);
                    if (!post.isPublished) {
                      const blogs = await getMyBlogs();
                      setMyBlogs(blogs || []);
                    }
                  }}
                  className={`text-sm ${
                    post.isPublished 
                      ? "text-gray-500 hover:bg-gray-200" 
                      : "text-green-600 hover:bg-green-50"
                  } px-2 py-1 rounded transition-colors`}
                >
                  {post.isPublished ? "Mark as Draft" : "Publish"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
