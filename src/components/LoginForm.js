import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; // Import the UploadForm CSS

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/user/login', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data || 'Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
