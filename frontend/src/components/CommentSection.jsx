import { useState, useEffect } from "react";
import {
  createComment,
  getCommentsByBlogs,
  deleteComment,
} from "../services/commentService";
import { useAuth } from "../context/AuthContext";
import CommentItem from "./CommentItem";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const buildCommentTree = (comments) => {
  const commentMap = {};
  const roots = [];

  const cloned = comments.map((c) => ({ ...c, replies: [] }));
  cloned.forEach((comment) => (commentMap[comment._id] = comment));

  cloned.forEach((comment) => {
    if (comment.parentComment) {
      const parent = commentMap[comment.parentComment._id];
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addReplyToComment = (parentId, newReply) => {
    const updateTree = (comments) =>
      comments.map((comment) => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateTree(comment.replies),
          };
        }
        return comment;
      });

    setComments((prev) => updateTree(prev));
  };

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!blogId || !/^[0-9a-fA-F]{24}$/.test(blogId)) {
        throw new Error("Invalid blog ID");
      }
      const comments = await getCommentsByBlogs(blogId);
      const tree = buildCommentTree(comments.data);
      setComments(tree);
    } catch (err) {
      setError(
        err.message || "Failed to load comments. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const comment = {
        content: newComment,
        blog: blogId,
        author: user.id,
      };
      await createComment(comment);
      setNewComment("");
      Toastify({
        text: "Comment posted successfully!",
        className: "info",        
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#4fbe87",
        },
      }).showToast();
      await loadComments();
    } catch (err) {
      setError("Failed to post comment. Please try again.");
      Toastify({
        text: "Failed to post comment.",
        className: "error",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#f87171",
        },
      }).showToast();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [blogId]);

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      Toastify({
        text: "Comment deleted successfully!",
        className: "info",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#ff4d4d",
        },
      }).showToast();
      await loadComments();
    } catch (err) {
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const comment = {
        content,
        blog: blogId,
        author: user.id,
        parentComment: parentId,
      };
      const response = await createComment(comment);
      addReplyToComment(parentId, response.data);
    } catch (err) {
      setError("Failed to post reply. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4">
        Discussion
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {user && (
        <form onSubmit={handleNewComment} className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px] transition duration-200 ease-in-out"
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`absolute bottom-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out flex items-center space-x-2 text-sm font-medium ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </>
              ) : (
                <span>Post Comment</span>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              onReply={handleReply}
              onDelete={handleDelete}
              onLocalReplyUpdate={addReplyToComment}
              loadComments={loadComments} // Add this prop
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
