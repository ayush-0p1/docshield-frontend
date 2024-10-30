import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css'; // Import the UploadForm CSS

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      await axios.post('/api/user/signup', formData);
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data || 'Signup failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {message && <p>{message}</p>}
      <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
      <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;
