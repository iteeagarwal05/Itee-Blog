import Blog from "../models/Blog.js";
import mongoose from "mongoose";

export const reactionToBlog = async (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;

  try {
     if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error("Invalid blog ID format:", id);
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.isDeleted) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const reactions = blog.reactions;

    reactions.forEach((users, key) => {
        reactions.set(key, users.filter(id => id !== userId));
    })

    if(emoji) {
        if(!reactions.has(emoji)) {
            reactions.set(emoji, [userId]);
        } else {
            reactions.get(emoji).push(userId);
        }
    }

    await blog.save();

    return res.status(200).json({ success: true, message: "Reaction added successfully", data: reactions }); // Return the updated blog with reactions and emoj
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}