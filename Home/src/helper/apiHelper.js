import { createContext } from "react";
import axios from "axios";

// Create the AuthContext
export const AuthContext = createContext();

// Set the base URL for your backend API
const API_BASE_URL = "http://localhost:5000/api"; // Adjust to your backend URL

// Configure Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add an Authorization header (optional if using JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken"); // Assuming the token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",  // Ensure correct content type for file upload
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Export your API functions (as you've already done)
export const registerUser = (userData) => api.post("/users/register", userData);
export const loginUser = (credentials) => api.post("/users/login", credentials);
export const getUserProfile = () => api.get("/users/profile");
export const createPost = (postData) => api.post("/posts", postData);
export const getPosts = () => api.get("/posts");
export const updatePost = (postId, content) => api.put(`/posts/${postId}`, { content });
export const deletePost = (postId) => api.delete(`/posts/${postId}`);
export const createComment = (commentData) => api.post("/comments", commentData);
export const getComments = (postId) => api.get(`/comments/${postId}`);
export const updateComment = (commentId, content) => api.put(`/comments/${commentId}`, { content });
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);
export const followUser = (followedId) => api.post("/follow", { followed_id: followedId });
export const unfollowUser = (followedId) => api.post("/unfollow", { followed_id: followedId });
export const likePost = (postId) => api.post("/likes", { post_id: postId });
export const unlikePost = (postId) => api.delete(`/likes/${postId}`);
export const searchPosts = (query) => {
  return api.get(`/posts/search?query=${query}`);
};
export const getOtherUserProfile = (query) => {
  return api.get(`/users/searching?query=${query}`);
};

export const getUserPosts = (username) => {
  return api.get(`/users/${username}`)  // Ensure the username is being passed correctly in the URL
    .then(response => response)  // If successful, return the response data
    .catch(error => {
      console.error('Error fetching user posts:', error);
      throw error;  // Re-throw error to be handled in the component
    });
};

