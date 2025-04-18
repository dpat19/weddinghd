// PhotoUpload.jsx
import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const PhotoUpload = () => {
  const [photoLink, setPhotoLink] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle submission: validate input then store in Firestore.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoLink.trim()) {
      setUploadStatus('Please enter a valid photo link.');
      return;
    }
    setUploadStatus('Uploading link...');
    try {
      // Generate a random value in [0,1]
      const randomNumber = Math.random();
      await addDoc(collection(db, 'photos'), {
        link: photoLink,
        createdAt: new Date(),
        random: randomNumber,
      });
      setUploadStatus('Photo link stored successfully!');
      setPhotoLink(''); // Clear input field
    } catch (error) {
      console.error('Error uploading photo link:', error);
      setUploadStatus('Upload failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Photo Link</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter Google Photos public URL" 
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '8px 16px' }}>
          Upload
        </button>
      </form>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default PhotoUpload;
