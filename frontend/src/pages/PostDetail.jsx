import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogBySlug, deleteBlog } from "../services/blogService";
import { jwtDecode } from "jwt-decode";
import DOMPurify from "dompurify";
import CommentSection from "../components/CommentSection";
import BlogReaction from "../components/BlogReaction";
import { useAuth } from "../context/AuthContext";
import SocialShare from "../components/SocialShare";
import VersionHistoryModal from "../components/VersionHistoryModal";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;

    try {
      await deleteBlog(slug);
      navigate("/");
      Toastify({
        text: "Blog deleted successfully!",
        className: "info",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#ff4d4d",
        },
      }).showToast();
    } catch (error) {
      Toastify({
        text: "Failed to delete blog post.",
        className: "error",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#ff4d4d",
        },
      }).showToast();
      console.error("Error deleting blog:", error);
    }
  };

  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await getBlogBySlug(slug);
        setPost(data);
        Toastify({
          text: "Blog fetched successfully!",
          className: "info",
          close: true,
          duration: 2000,
          gravity: "top",
          position: "right",
          style: {
            backgroundColor: "#4fbe87",
          },
        }).showToast();
      } catch (error) {
        Toastify({
          text: "Failed to fetch blog post.",
          className: "error",
          close: true,
          duration: 2000,
          gravity: "top",
          position: "right",
          style: {
            backgroundColor: "#ff4d4d",
          },
        }).showToast();
        console.error("Error fetching blog by slug:", error);
      } finally {
        setLoading(false);
      }
    };
    getBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-blue-500 font-semibold">
          Loading post...
        </span>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-10 text-red-500">Post not found</div>;
  }

  const isAuthor =
    currentUserId &&
    (post.author?.id === currentUserId || post.author?._id === currentUserId);

  const blogUrl = `${window.location.origin}/blogs/${post.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-100 text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Blog
          </Link>

          {isAuthor && (
            <div>
              <Link
                to={`/edit/${post.slug}`}
                className="bg-yellow-500 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-yellow-600 transition"
              >
                ✎ Edit Post
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition ml-4"
              >
                🗑 Delete Post
              </button>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="ml-4 bg-gray-100 text-sm px-3 py-1 rounded-md hover:bg-gray-200"
              >
                🕒 View History
              </button>
            </div>
          )}
        </div>

        {!post.isPublished && (
          <div className="flex items-center mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg shadow-sm">
            <svg
              className="w-6 h-6 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              ></path>
            </svg>
            <p className="text-sm font-semibold">
              ⚠️ This post is currently a <span className="italic">draft</span>{" "}
              and not publicly visible.
            </p>
          </div>
        )}

        <VersionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          slug={post.slug}
          onRestored={() => window.location.reload()}
        />

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt="Cover"
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {post.title}
            </h1>

            <p className="text-sm text-gray-500 mb-4">
              By <span className="font-semibold">{post.author?.username}</span>{" "}
              • {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div
              className="prose prose-blue max-w-none prose-img:rounded-xl prose-headings:text-indigo-900 prose-a:text-blue-600"
              dangerouslySetInnerHTML={createMarkup(post.content)}
            />

            {/* ✅ Social Share Section */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Share this post:
              </h3>
              <SocialShare blogUrl={blogUrl} title={post.title} />
            </div>

            {/* Add BlogReaction component here */}
            <div className="mt-6 border-t pt-6">
              <BlogReaction
                blogId={post._id}
                currentUserReaction={post.userReaction}
                reactionCounts={post.reactions || {}}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </article>
        <div className="mt-8">
          <CommentSection blogId={post._id} />
        </div>
      </div>
    </div>
  );
}
