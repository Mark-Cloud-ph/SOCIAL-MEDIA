
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './assets/StyleSheet/index.css';
import Header from './Components/Header.jsx';
import Home from './Components/Home.jsx';
import Registration from './Components/Registration.jsx';
import Login from './Components/Login.jsx';
import EditProfile from './Components/EditProfile.jsx';
import Search from './Components/Search.jsx';
import NewPost from './Components/NewPost.jsx';
import Settings from './Components/Settings.jsx';
import { AuthContext } from './helper/apiHelper';
import PropTypes from 'prop-types';
import SearchPage from './Components/SearchPage.jsx';
import ProfilePage from './Components/ProfilePage.jsx';
// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({ children }) {
  return localStorage.getItem('jwtToken') ? children : <Navigate to="/" />;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const [authState, setAuthState] = useState({ username: "", id: null, status: false });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuthState({ username: localStorage.getItem('username'), id: localStorage.getItem('userId'), status: true });
    }
  }, []);

  const protectedRoute = (Component) => (
    <ProtectedRoute>
      <Header />
      {Component}
    </ProtectedRoute>
  );

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/home" element={protectedRoute(<Home />)} />
            <Route path="/search" element={protectedRoute(<Search />)} />
            <Route path="/newPost" element={protectedRoute(<NewPost />)} />
            <Route path="/edit-profile" element={protectedRoute(<EditProfile />)} />
            <Route path="/settings" element={protectedRoute(<Settings />)} />
            <Route path="/search-page" element={protectedRoute(<SearchPage />)} />
            <Route path="/users/posts/:user_id" element={protectedRoute(<ProfilePage/>)} />
          </Routes>
        </BrowserRouter>
      </StrictMode>
    </AuthContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
