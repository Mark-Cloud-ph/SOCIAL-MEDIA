import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from React Router
import { getOtherUserProfile } from '../helper/apiHelper'; // Correct function import
import defaultProfilePic from '../assets/default-profile.png';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOtherUserProfile(query); // Search by username
      console.log(response.data); // Log the response
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error fetching user profile', err);
      setError('Error fetching user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user_id) => { // Use user_id to navigate
    if (user_id) {
      navigate(`/users/posts/${user_id}`); // Navigate using user_id
    } else {
      console.error('User ID is undefined');
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
        />
        <button onClick={handleSearch} disabled={loading}>Search</button>
      </div>

      {loading && <div className="loading">Searching...</div>}

      {error && <div className="error">{error}</div>}

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div 
              key={user.user_id} // Use user_id as the unique key
              className="search-result-item" 
              onClick={() => handleUserClick(user.user_id)} // Pass user_id
            >
              <img 
                src={user.profile_pic_url || defaultProfilePic} 
                alt={user.username} 
                className="profile-pic"
              />
              <span className="username">{user.username}</span>
            </div>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  );
};

export default Search;
