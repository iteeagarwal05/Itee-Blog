import axios from "axios";

// Use Vite env variable VITE_API_URL in production; fall back to localhost for local dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE}/api/v1/blogs/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getBlogs = async ({
  page = 1,
  limit = 6,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        isPublished: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

const getUserDrafts = async () => {
    try {
        const response = await axios.get(API_URL + "drafts", getAuthHeaders());
        return response.data.data;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
};

const getBlogBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}${slug}`);
        console.log(response)
        return response.data.data;
    } catch (error) {
        console.error('Error fetching blog by slug:', error);
        throw error;
    }
};

const getBlogById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        throw error;
    }
}

const createBlog = async (blogData) => {
    try {
        const response = await axios.post(API_URL, blogData, getAuthHeaders());
        return response.data.data;
    } catch (error) {
        console.error('Error creating blog:', error);
        throw error;
    }
};

const updateBlog = async (slug, blogData) => {
    try {
        const response = await axios.put(`${API_URL}${slug}`, blogData, getAuthHeaders());
        return response.data.data;
    } catch (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
};

const deleteBlog = async (slug) => {
    try {
        await axios.delete(`${API_URL}${slug}`, getAuthHeaders());
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
};

const getMyBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}my-blogs`, getAuthHeaders());
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching your blogs:", error);
    throw error;
  }
};

const togglePublishBlog = async (blogId) => {
  try {
    const response = await axios.put(
      `${API_URL}${blogId}/toggle-publish`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling publish status:", error);
    throw error;
  }
};

const sendReaction = async (blogId, emoji) => {
  try {
    const res = await axios.post(API_URL  + `${blogId}/reaction`, { emoji }, getAuthHeaders())
    return res.data.data; 
  
  } catch (error) {
    console.error("Error adding reaction:", error);
    throw error;
  }
}

export { getBlogs,getBlogBySlug, getBlogById, createBlog, updateBlog, deleteBlog, getUserDrafts, getMyBlogs, togglePublishBlog, sendReaction };