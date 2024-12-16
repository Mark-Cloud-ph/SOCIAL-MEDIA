// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { createPost } from '../helper/apiHelper';  // Importing the createPost function from apiHelper
import '../assets/StyleSheet/NewPost.css';

const NewPost = () => {
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Handle content change in textarea
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content) {
            setMessage('Content cannot be empty');
            setIsError(true);
            return;
        }

        try {
            // Make the API request to create the post using the createPost function from apiHelper
            const response = await createPost({ content });

            // Show success message
            setMessage(response.data.message);
            setIsError(false);
            setContent(''); // Clear the content after successful post creation
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to create post');
            setIsError(true);
        }
    };

    return (
        <div className="new-post-container">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="What's on your mind?"
                    rows="4"
                    cols="50"
                />
                <br />
                <button type="submit">Post</button>
            </form>
            {message && (
                <div className={isError ? 'error-message' : 'success-message'}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default NewPost;
