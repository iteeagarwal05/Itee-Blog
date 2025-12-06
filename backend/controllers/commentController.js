import Comment from "../models/Comment.js";
import {logger} from "../config/logger.js"; 

// Create a new comment
export const createComment = async (req, res) => {
    const { content, blog, parentComment } = req.body;
    const author = req.user.id;

    try {
        const newComment = new Comment({
            content,
            author,
            blog,
            parentComment:  parentComment || null,
        });

        await newComment.save();

        logger.info("Creating comment: ", newComment);
        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: newComment,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create comment",
            error: error.message,
        });
    }
}

export const getCommentsByBlogs = async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId, isDeleted: false }).populate('author', 'displayName avatar').populate('parentComment').sort('-createdAt').lean().exec();

        logger.info("Fetching comments: ", comments);
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: comments,
        })
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch comments",
            error: error.message,
        });
    }
}

export const deleteComment = async (req, res) => {
    const commentId = req.params.id;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            logger.error("Comment not found");
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        comment.isDeleted = true;
        await comment.save();

        logger.info("Deleting comment: ", comment);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: comment,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete comment",
            error: error.message,
        });
    }
}