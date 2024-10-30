import React from 'react';
import './Home.css'; // Import the Home CSS

const Home = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div>
      <h1>Welcome to DocShield</h1>
      <div className="split-container">
        <div className="split left">
          <h2>Upload Document</h2>
          <p>Securely upload your documents for verification and storage.</p>
          <a href="/upload" className="button">Upload Now</a>
        </div>
        <div className="split right">
          <h2>Check Authenticity</h2>
          <p>Verify the authenticity of your documents with our trusted service.</p>
          <a href="/verify" className="button">Check Now</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
