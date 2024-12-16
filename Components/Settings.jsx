import { useState, useEffect, useContext } from 'react';  
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helper/apiHelper';  // Import AuthContext
import { getUserProfile, updateUserProfile } from '../helper/apiHelper';  // Import the necessary API functions
import '../assets/StyleSheet/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);  // Access only setAuthState from context

  // Local state for profile
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    language: 'English',
    notifications: true,
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile({
          username: response.data.username,
          email: response.data.email,
          language: response.data.language || 'English',
          notifications: response.data.notifications || true,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');  // Remove JWT token from localStorage
    localStorage.removeItem('username');  // Remove username from localStorage (optional)
    localStorage.removeItem('userId');  // Remove userId from localStorage (optional)

    // Clear user state from context
    setAuthState({
      username: "",
      id: null,
      status: false,
    });

    navigate('/');  // Redirect to login page
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updatedProfile = { ...profile };
      await updateUserProfile(updatedProfile);  // Send updated profile to the API
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle password change (you can create a modal or form for password change)
  const handlePasswordChange = () => {
    console.log('Password change requested');
    // Implement password change functionality (could open a modal or redirect to a change password page)
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    setProfile({ ...profile, language: e.target.value });
  };

  // Handle notification toggle
  const handleNotificationToggle = () => {
    setProfile({ ...profile, notifications: !profile.notifications });
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      {/* Profile Section */}
      <div className="profile-section">
        <h2>Profile</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <button onClick={handleProfileUpdate}>Update Profile</button>
      </div>

      {/* Password Section */}
      <div className="password-section">
        <h2>Change Password</h2>
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>

      {/* Language Section */}
      <div className="language-section">
        <h2>Language Preferences</h2>
        <select value={profile.language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          {/* Add more languages */}
        </select>
      </div>

      {/* Notification Section */}
      <div className="notification-section">
        <h2>Notification Settings</h2>
        <label>
          <input
            type="checkbox"
            checked={profile.notifications}
            onChange={handleNotificationToggle}
          />
          Enable Notifications
        </label>
      </div>

      {/* Logout Button */}
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
