import { useState } from 'react';

import { searchPosts } from '../helper/apiHelper'; // Importing searchPosts from apiHelper
import '../assets/StyleSheet/Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(''); // To handle errors

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]); // Clear results if query is empty
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await searchPosts(query); // Fetch search results
      setSearchResults(response.data); // Set the search results
    } catch (error) {
      setError('An error occurred while searching posts.');
      console.error('Error searching posts', error);
    } finally {
      setLoading(false); // Set loading to false once the request is done
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update the query on input change
        />
        <button onClick={handleSearch} disabled={loading}>Search</button>
      </div>

      {loading && <div className="loading">Searching...</div>}

      {error && <div className="error">{error}</div>}

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((post, index) => (
            <div key={post.id || post.username || index} className="search-result-item">
              <span className="username">{post.username}</span>
              <p>{post.content}</p> {/* Assuming 'text' is 'content' in your data */}
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
