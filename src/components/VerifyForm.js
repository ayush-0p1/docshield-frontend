import React, { useState } from 'react';
import axios from 'axios';
import './VerifyForm.css'; // Import the VerifyForm CSS

const VerifyForm = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to verify.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await axios.post('/api/upload/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
    } catch (error) {
      setMessage(error.response?.data || 'Verification failed.');
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verify Your Document</h2>
      {message && <p>{message}</p>}
      <input type="file" name="document" required onChange={handleFileChange} />
      <button type="submit">Verify Now</button>
      {result && (
        <div className={`verification-result ${result.success ? 'success' : 'failure'}`}>
          <h3>{result.message}</h3>
        </div>
      )}
    </form>
  );
};

export default VerifyForm;
