import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserDrafts,
  getMyBlogs,
  togglePublishStatus,
  getBlogBySlug,
  restoreBlogVersion,
  getBlogVersions
} from '../controllers/blogController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { createBlogSchema, updateBlogSchema, togglePublishSchema } from "../validators/blogValidator.js";
import { validate } from '../middlewares/validate.js';
import { apiLimiter, createBlogLimiter } from '../middlewares/rateLimiter.js';
import {reactionToBlog} from "../controllers/reactionController.js";

const router = express.Router();

router.post('/', authenticate, createBlogLimiter, validate(createBlogSchema), createBlog);
router.get('/', apiLimiter, getBlogs);
router.get('/drafts', apiLimiter, authenticate, getUserDrafts);
router.get('/my-blogs', apiLimiter, authenticate, getMyBlogs);
router.get('/:slug', apiLimiter, getBlogBySlug);
router.post('/:id/reaction', authenticate, reactionToBlog)
router.put('/:id/toggle-publish', apiLimiter, authenticate, validate(togglePublishSchema), togglePublishStatus);
router.get('/:id', apiLimiter, getBlogById);
router.put('/:slug', apiLimiter, authenticate, validate(updateBlogSchema), updateBlog);
router.get("/:slug/versions", getBlogVersions);
router.post("/:slug/restore/:versionIndex", restoreBlogVersion);
router.delete('/:slug', apiLimiter, authenticate, deleteBlog);

export default router;
