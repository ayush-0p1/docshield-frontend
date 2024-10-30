import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Create corresponding CSS for styling

const Header = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token')); // Simple auth check

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>DocShield</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout}>Logout</button></li>
          ) : (
            <>
              <li><Link to="/signup">Signup</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
