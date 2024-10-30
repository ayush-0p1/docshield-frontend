import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css'; // Import the UploadForm CSS

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [cryptoKey, setCryptoKey] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCryptoKey(res.data.cryptoKey);
      setMessage('File uploaded successfully!');
    } catch (error) {
      setMessage(error.response?.data || 'File upload failed.');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h2>Upload Document</h2>
      {message && <p>{message}</p>}
      <input type="file" name="document" required onChange={handleFileChange} />
      <button type="submit">Upload Now</button>
      {cryptoKey && (
        <div>
          <h3>Cryptographic Key:</h3>
          <p>{cryptoKey}</p>
        </div>
      )}
    </form>
  );
};

export default UploadForm;
