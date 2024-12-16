import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/StyleSheet/Registration.css';
import logo from '../assets/amihan bird.png';

function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      if (response.data.success) {
        alert("Registration successful! Redirecting to login...");
        localStorage.removeItem('jwtToken'); // Clear any leftover token to prevent ProtectedRoute interference
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="logo">
          <img src={logo} alt="ChatterBox Logo" />
          <h1>ChatterBox</h1>
        </div>
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <input
            type="text"
            placeholder="Choose a username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
          />
          <button type="submit" className="signup-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="login">
          Have an Account?{' '}
          <span onClick={() => navigate('/')} style={{ color: 'blue', cursor: 'pointer' }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Registration;
