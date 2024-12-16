/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';  // Correct for named export
import { getUserProfile, getPosts, getComments, createComment, likePost, unlikePost, createPost } from '../helper/apiHelper';
import '../assets/StyleSheet/Home.css';
import defaultProfilePic from '../assets/default-profile.png';

const Home = () => {
  const { username, profile_pic_url, setUsername, setProfilePicUrl } = useUserStore(); // Access updated Zustand state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postComments, setPostComments] = useState({});
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState(null); // Added error state to handle errors
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        // After fetching the user profile, update the Zustand store
        setUsername(response.data.username);  // Set username in the Zustand store
        setProfilePicUrl(response.data.profile_pic_url || defaultProfilePic);  // Set profile picture URL
      } catch (error) {
        console.error("Error fetching user profile", error);
        setError("Error fetching profile");  // Set error message in case of failure
      }
    };
  
    fetchUserProfile();
  }, [setUsername, setProfilePicUrl]);  // Only run once when component mounts
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts", error);
        setError("Error fetching posts"); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const response = await getComments(postId);
      setPostComments(prevComments => ({
        ...prevComments,
        [postId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleLike = async (postId, liked) => {
    try {
      if (liked) {
        await unlikePost(postId); // Unlike the post
      } else {
        await likePost(postId); // Like the post
      }

      setPosts(posts.map(post => post.post_id === postId
        ? { 
            ...post, 
            liked: !liked, 
            likes_count: liked ? post.likes_count - 1 : post.likes_count + 1
          }
        : post
      ));
    } catch (error) {
      console.error("Error handling like", error);
    }
  };

  const handleComment = (postId) => {
    const content = prompt('Enter your comment:');
    if (content) {
      createComment({ post_id: postId, content })
        .then(response => {
          setPosts(posts.map(post => post.post_id === postId
            ? { 
                ...post, 
                comments_count: post.comments_count + 1, 
                comments_list: post.comments_list ? [...post.comments_list, response.data] : [response.data] 
              }
            : post
          ));
          setPostComments(prevComments => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), response.data],
          }));
        })
        .catch(error => {
          console.error('Error submitting comment', error);
        });
    }
  };

  const togglePost = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
    }
  };
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const handleNewPost = async () => {
    if (newPostContent.trim()) {
      try {
        const response = await createPost({ content: newPostContent });
        setPosts([response.data, ...posts]);
        setNewPostContent(''); // Reset the new post content after submission
      } catch (error) {
        console.error('Error creating new post', error);
        setError("Error creating post"); // Set error message
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      {/* Your profile and "What's on your mind?" section */}
      <div className="new-post-section">
        <div className="post-header">
          <img
            src={profile_pic_url || defaultProfilePic}
            alt="Profile"
            className="profile-pic"
          />
          <span className="username">{username}</span>
        </div>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="new-post-textarea"
        />
        <button onClick={handleNewPost} className="post-button">
          Post
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Display posts */}
      {posts.map(post => (
        <div key={post.post_id} className="post">
          <div className="post-header">
            <img
              src={post.profile_pic_url || defaultProfilePic}
              alt="Profile"
              className="profile-pic"
            />
            <span className="username">{post.username}</span>
          </div>
          <p className="post-content">{post.content}</p>
          <div className="post-actions">
            <button className="like-button" onClick={() => handleLike(post.post_id, post.liked)}>
              {post.liked ? "Unlike" : "Like"} ({post.likes_count})
            </button>
            <button className="comment-button" onClick={() => handleComment(post.post_id)}>
              Comment ({post.comments_count})
            </button>
            <button className="expand-button" onClick={() => togglePost(post.post_id)}>
              {expandedPostId === post.post_id ? "Hide Comments" : "View Comments"}
            </button>
          </div>
          {expandedPostId === post.post_id && (
            <div className="comments-section">
              <h4>Comments:</h4>
              {postComments[post.post_id]?.length > 0 ? (
                <ul>
                  {postComments[post.post_id].map((comment) => (
                    <li key={comment.comment_id} className="comment"> {/* Use comment_id as the key */}
                      <span>{comment.username}: </span>{comment.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
              <button onClick={() => handleComment(post.post_id)} className="add-comment-button">
                Add a Comment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
