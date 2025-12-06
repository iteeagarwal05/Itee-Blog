import { useState, useEffect } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const CommentItem = ({
  comment,  
  user,
  onReply,
  onDelete,
  onLocalReplyUpdate,
  loadComments,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      setReplyText("");
      setShowReplyBox(false);
    }
  }, [isCollapsed]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!user || !user.id) {
      setError("You must be logged in to reply");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createdReply = await onReply(comment._id, replyText);
      if (createdReply && createdReply.data) {
        onLocalReplyUpdate(createdReply.data);
      }
      setReplyText("");
      Toastify({
        text: "Reply posted successfully!",
        className: "info",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#4caf50",
        },
      }).showToast();
      setShowReplyBox(false);
    } catch (error) {
      Toastify({
        text: "Failed to post reply. Please try again.",
        className: "error",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#f44336",
        },
      }).showToast();
      setError("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await onDelete(comment._id);
      } catch (error) {
        setError("Failed to delete comment. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="ml-6 border-l-2 border-gray-100 pl-6 mt-4 relative before:absolute before:w-4 before:h-4 before:bg-blue-50 before:rounded-full before:-left-2 before:top-0 before:border-2 before:border-blue-200">
      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <img
              src={'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-50"
              alt={comment.author?.displayName}
            />
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-900 font-medium">
              {comment.author?.displayName}
            </strong>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none mt-2">
          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-50">
          {user && (
            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors duration-200"
              disabled={isSubmitting}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              Reply
            </button>
          )}
          {user?.id === comment.author?._id && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors duration-200 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? (
                <svg
                  className="animate-spin h-4 w-4"
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
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </>
              )}
            </button>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 transition-colors duration-200"
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isCollapsed ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {isCollapsed
                ? `Show ${comment.replies.length} ${
                    comment.replies.length === 1 ? "reply" : "replies"
                  }`
                : "Hide replies"}
            </button>
          )}
        </div>

        {showReplyBox && (
          <form onSubmit={handleReplySubmit} className="mt-4">
            <textarea
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-none min-h-[80px]"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              disabled={isSubmitting}
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowReplyBox(false);
                  setError(null);
                }}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center ${
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
                    Submitting...
                  </>
                ) : (
                  "Submit Reply"
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div
        className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[9999px] opacity-100"
        }`}
      >
        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            user={user}
            onReply={onReply}
            onDelete={onDelete}
            onLocalReplyUpdate={onLocalReplyUpdate}
            loadComments={loadComments} 

          />
        ))}
      </div>
    </div>
  );
};

export default CommentItem;
