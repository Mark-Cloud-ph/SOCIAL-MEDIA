import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, getUserProfile } from '../helper/apiHelper';
import { useUserStore } from '../store/useUserStore';  // Import the store correctly
import '../assets/StyleSheet/EditProfile.css';

const EditProfile = () => {
    const { setProfilePicUrl } = useUserStore();  // Access Zustand to update the profile picture globally
    const [userData, setUserData] = useState({
        username: '',
        bio: '',
        profile_pic_url: ''  // This will be the URL from the backend after file upload
    });

    const [file, setFile] = useState(null);  // To store the uploaded file
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);  // State for success message
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data on component mount
        getUserProfile()
            .then((response) => {
                setUserData({
                    username: response.data.username,
                    bio: response.data.bio || '',
                    profile_pic_url: response.data.profile_pic_url || '',
                });
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load user data');
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Set the file when selected
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('bio', userData.bio);
        if (file) {
            formData.append('profile_pic_url', file);  // Add the file to the form data
        }

        updateUserProfile(formData)
            .then((response) => {
                setProfilePicUrl(response.data.profile_pic_url);  // Update global profile picture
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            })
            .catch(() => {
                setError('Failed to update profile');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>

            {/* Success or error messages */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profile_pic_url">Profile Picture</label>
                    <input
                        type="file"
                        id="profile_pic_url"
                        name="profile_pic_url"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" className="submit-button">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
