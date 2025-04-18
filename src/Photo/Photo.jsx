// Photo.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const Photo = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // A helper function to fetch 10 random photos using a two-query approach.
  const fetchRandomPhotos = async () => {
    try {
      const photosRef = collection(db, 'photos');
      // Generate a random value to split the query.
      const randomValue = Math.random();

      // First query: get photos with random >= randomValue
      const q1 = query(
        photosRef,
        where('random', '>=', randomValue),
        orderBy('random'),
        limit(10)
      );
      const snapshot1 = await getDocs(q1);
      let photoList = snapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // If fewer than 10 documents were found, retrieve additional photos with random < randomValue.
      if (photoList.length < 10) {
        const q2 = query(
          photosRef,
          where('random', '<', randomValue),
          orderBy('random'),
          limit(10 - photoList.length)
        );
        const snapshot2 = await getDocs(q2);
        const photoList2 = snapshot2.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        photoList = photoList.concat(photoList2);
      }
      setPhotos(photoList);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPhotos();
  }, []);

  return (
    <Box
      sx={{
        width: '100vw',           // Full viewport width
        height: '100vh',          // Full viewport height
        overflowY: 'scroll',      // Vertical scrolling enabled
        display: 'flex',
        justifyContent: 'center', // Center contents horizontally
        alignItems: 'flex-start', // Align contents to the top
        padding: 2,               // Add some padding
      }}
    >
      {loading ? (
        <p>Loading photos...</p>
      ) : (
        <ImageList
          variant="masonry"
          cols={2}  // 2 columns layout
          gap={16}
          sx={{
            width: '100%',
            height: 'auto',
          }}
        >
          {photos.map((item) => (
            <ImageListItem key={item.id}>
              <img
                // Use the link field from Firestore
                srcSet={`${item.link}?w=248&fit=crop&auto=format 1x`}
                src={`${item.link}?w=248&fit=crop&auto=format`}
                alt={item.title ? item.title : 'Photo'}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default Photo;
