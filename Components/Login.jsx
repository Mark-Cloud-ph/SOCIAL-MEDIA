import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../helper/apiHelper'; // Importing the login function from your API helpers
import '../assets/StyleSheet/Login.css';
import Logo from '../assets/amihan bird.png';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');  // Clear any previous errors

    try {
      // Call the loginUser function that sends the login credentials to the backend
      const response = await loginUser({ email, password });

      // Store JWT token in localStorage
      localStorage.setItem('jwtToken', response.data.token);

      // Navigate to the home page after successful login
      navigate('/home');
    } catch {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="login-container">
      < div className='form-box'>
      <img alt="Logo" src={Logo} width="130" height="130" style={{ borderRadius: '75%' }} />

      <h1>Login to ChatterBox</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="input-field"
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate('/register')} className="signup-button">Sign Up</button>
      </div>
    </div>
  );
}

export default Login;
