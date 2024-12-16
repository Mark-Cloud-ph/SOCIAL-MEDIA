// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserPosts } from '../helper/apiHelper';  // Import the function to fetch posts
import '../assets/StyleSheet/Profile.css';

const ProfilePage = () => {
  const { user_id } = useParams();  // Get the user_id from the URL parameters
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user_id) {
        setError("User ID is missing in the URL.");
        setLoading(false);
        return;
      }
      try {
        const response = await getUserPosts(user_id);
        console.log(response);  // Check if the data is correct
        setPosts(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Error fetching posts.');
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {error && <div className="error">{error}</div>}
      <h2>User&apos;s Posts</h2>
      {posts.length === 0 ? (
        <div>No posts found</div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePage;
