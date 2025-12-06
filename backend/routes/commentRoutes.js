import express from 'express';
import {createComment, getCommentsByBlogs, deleteComment} from "../controllers/commentController.js"
import { authenticate }  from "../middlewares/authMiddleware.js"

const router = express.Router();

// Create a new comment
router.post('/create', authenticate, createComment);
router.get("/:blogId", getCommentsByBlogs);
router.delete('/:id', authenticate, deleteComment);

export default router;