import { useState } from "react";
import { sendReaction } from "../services/blogService";
import { useAuth } from "../context/AuthContext";

const emojis = ["❤️", "😂", "😮", "😢", "👎"];

const emojiLabels = {
  "❤️": "Love it",
  "😂": "Funny",
  "😮": "Surprised",
  "😢": "Sad",
  "👎": "Dislike",
};

export default function BlogReaction({
  blogId,
  currentUserReaction,
  reactionCounts: initialCounts,
  currentUserId,
}) {
  const { user } = useAuth();

  const [selected, setSelected] = useState(currentUserReaction || null);
  const [reactionCounts, setReactionCounts] = useState(initialCounts || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  const handleReaction = async (emoji) => {
    if (!user) {
      alert("Please log in to react to blogs.");
      return;
    }
    if (isLoading) return;

    const newEmoji = selected === emoji ? null : emoji;

    // Optimistic UI update
    const newCounts = { ...reactionCounts };
    emojis.forEach((e) => {
      newCounts[e] = (newCounts[e] || []).filter((id) => id !== currentUserId);
    });
    if (newEmoji) {
      newCounts[newEmoji] = [...(newCounts[newEmoji] || []), currentUserId];
    }
    setSelected(newEmoji);
    setReactionCounts(newCounts);

    try {
      setIsLoading(true);
      const updatedReactions = await sendReaction(blogId, newEmoji);
      setReactionCounts(updatedReactions || {});
    } catch (err) {
      setError("Failed to update reaction");
      console.error("Reaction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
            disabled={isLoading}
            className={`
                relative group flex flex-col items-center
                transition-all duration-300 ease-in-out
                ${selected === emoji ? "bg-blue-50" : "hover:bg-gray-100"}
                ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }
                rounded-full p-2
              `}
          >
            <span
              className={`
                text-2xl transform transition-transform duration-200
                ${selected === emoji ? "scale-125" : ""}
                ${hoveredEmoji === emoji ? "scale-110" : ""}
              `}
            >
              {emoji}
            </span>
            <span
              className={`
                text-xs font-medium mt-1
                ${selected === emoji ? "text-blue-600" : "text-gray-600"}
              `}
            >
              {reactionCounts[emoji]?.length || 0}
            </span>
            {hoveredEmoji === emoji && (
              <div
                className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-gray-800 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                "
              >
                {selected === emoji
                  ? `Remove: ${emojiLabels[emoji]}`
                  : `React: ${emojiLabels[emoji]}`}
              </div>
            )}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
    </div>
  );
}
