import Blog from "../models/Blog.js";
import { buildQueryOptions } from "../utils/paginationSearch.js";
import slugify from "slugify";
import { generateUniqueSlug } from "../utils/slugifyUnique.js";
import { logger } from "../config/logger.js";

export const createBlog = async (req, res) => {
    const { title, content, tags, coverImage, isPublished } = req.body;
    const author = req.user.id;

    try {
        const newBlog = new Blog({
            title,
            content,
            author,
            tags,
            coverImage,
            isPublished,
        });

        await newBlog.save();
        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: newBlog,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const { query, pagination, sort } = buildQueryOptions(req.query, [
            "title",
            "content",
            "tags",
        ]);

        const blogs = await Blog.find(query)
            .populate("author", "username email")
            .sort(sort)
            .skip(pagination.skip)
            .limit(pagination.limit);

        const total = await Blog.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
            totalPages: Math.ceil(total / pagination.limit),
            currentPage: pagination.page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserDrafts = async (req, res) => {
    try {
        const drafts = await Blog.find({
            author: req.user.id,
            isPublished: false,
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .populate("author", "username");

        res.status(200).json({
            success: true,
            message: "User drafts fetched successfully",
            data: drafts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById({ _id: id, isDeleted: false }).populate(
            "author",
            "username email"
        );
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBlog = async (req, res) => {
    const { slug } = req.params;
    const { title, content, tags, coverImage, isPublished } = req.body;

    try {
        const blog = await Blog.findOne({ slug, isDeleted: false });
        if (!blog) return res.status(404).json({ message: "Not found" });

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        blog.versions.push({
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            coverImage: blog.coverImage,
            updatedAt: new Date(),
        });

        if (blog.versions.length > 10) {
            blog.versions = blog.versions.slice(-10);
        }
        // Update current blog fields
        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        blog.coverImage = coverImage;
        blog.isPublished = isPublished;

        if (blog.title !== title) {
            blog.slug = await generateUniqueSlug(title, blog._id);
        }

        const updatedBlog = await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const restoreBlogVersion = async (req, res) => {
    try {
        const { slug, versionIndex } = req.params;
        const blog = await Blog.findOne({ slug });

        if (!blog || !blog.versions[versionIndex])
            return res.status(404).json({ message: "Version not found" });

        const version = blog.versions[versionIndex];

        blog.versions.push({
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            coverImage: blog.coverImage,
        });

        blog.title = version.title;
        blog.content = version.content;
        blog.tags = version.tags;
        blog.coverImage = version.coverImage;
        blog.slug = slugify(version.title, { lower: true, strict: true });

        const updated = await blog.save();
        res.status(200).json({
            success: true,
            message: "Version restored successfully",
            data: updated.slug, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogVersions = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug });

        if (!blog) return res.status(404).json({ message: "Not found" });

        res
            .status(200)
            .json({
                success: true,
                message: "Blog versions fetched successfully",
                data: blog.versions,
            });
    } catch (error) {
        logger.error("Error fetching blog versions:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    const { slug } = req.params;

    try {
        const blog = await Blog.findOne({ slug, isDeleted: false });
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        blog.isDeleted = true;
        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog soft-deleted successfully",
        });
    } catch (error) {
        logger.error("Error deleting blog:", error);
        res.status(500).json({ message: error.message });
    }
};

export const restoreBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog || !blog.isDeleted) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        if (blog.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        blog.isDeleted = false;
        blog.deletedAt = new Date();
        await blog.save();
        res.status(200).json({
            success: true,
            message: "Blog restored successfully",
            data: blog,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =================Get Blogs by author=================
export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id, isDeleted: false })
            .populate("author", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            isDeleted: false,
        }).populate("author", "username email");
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const togglePublishStatus = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            _id: req.params.id,
            author: req.user.id,
        });
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.status(200).json({
            success: true,
            message: `Blog ${blog.isPublished ? "published" : "unpublished"}`,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
