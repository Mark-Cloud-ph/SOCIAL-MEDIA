//Header.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/StyleSheet/Header.css';
import HomeImage from '../assets/Home.png';
import SearchImage from '../assets/Search.png';
import AddImage from '../assets/Add.png';
import ProfileImage from '../assets/Profile.png';
import SettingsImage from '../assets/Setting2.png';
import Logo from '../assets/amihan bird.png';
import Search2 from '../assets/Serach2.png';
const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
        <img alt="Logo" src={Logo} width="60" height="60" />
      </div>
      <div className="icons">
        <img src={HomeImage} alt="Home" className="icon" onClick={() => navigate('/home')} />
        <img src={SearchImage} alt="Search" className="icon" onClick={() => navigate('/search')} />
        <img src={Search2} alt="Search2" className="icon"  onClick={() => navigate('/search-page')}/>
        <img src={AddImage} alt="Add" className="icon"onClick={() => navigate('/newPost')} />
        <img src={ProfileImage} alt="Profile" className="icon" onClick={() => navigate('/edit-profile')}/>
        <img src={SettingsImage} alt="Settings" className="icon"  onClick={() => navigate('/settings')}/>
      </div>
    </header>
  );
};

export default Header;