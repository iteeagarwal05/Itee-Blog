import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/comments/";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

const createComment = async (commentData) => {
  console.log(commentData);
    // const token = localStorage.getItem("token");
    const response = await axios.post(API_URL + "create", commentData, getAuthHeaders());
    return response.data;
};

const getCommentsByBlogs = async (blogId) => {
    const response = await axios.get(API_URL + blogId);
    return response.data;
}

const deleteComment = async (commentId) => {
    console.log(commentId)
    const response = await axios.delete(API_URL + commentId, getAuthHeaders());
    return response.data;
}

export { createComment, getCommentsByBlogs, deleteComment }