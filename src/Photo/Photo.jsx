import React from 'react';
import { Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import pic1 from '../assets/Pictab/Pic1.JPG';
import pic2 from '../assets/Pictab/Pic2.JPG';
import pic3 from '../assets/Pictab/Pic3.JPG';
import pic4 from '../assets/Pictab/Pic4.JPG';
import pic5 from '../assets/Pictab/Pic5.JPG';
import pic6 from '../assets/Pictab/Pic6.JPG';
import pic7 from '../assets/Pictab/Pic7.JPG';
import pic8 from '../assets/Pictab/Pic8.JPG';
import pic9 from '../assets/Pictab/Pic9.JPG';
import pic10 from '../assets/Pictab/Pic10.JPG';

const Photo = () => {
  return (
    <Box
      sx={{
        width: '100vw',  // Take the full width of the viewport
        height: '100vh',  // Take the full height of the viewport
        overflowY: 'scroll',  // Enable vertical scrolling
        display: 'flex',
        justifyContent: 'center',  // Center the content horizontally
        alignItems: 'flex-start',  // Align the content to the top
        padding: 2,  // Add some padding for spacing
      }}
    >
      <ImageList
        variant="masonry"  // Use masonry variant for dynamically sized items
        cols={2}  // Set to 2 columns
        gap={16}  // Add some space between the images
        sx={{
          width: '100%',
          height: 'auto',  // Allow height to adjust based on content
        }}
      >
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format 1x`} // Provide 2x resolution
              src={`${item.img}?w=248&fit=crop&auto=format`} // Fallback src
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%',  // Ensure the image takes up the full width of the column
                height: 'auto',  // Maintain the aspect ratio
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

const itemData = [
  {
    img: pic1,
    title: 'Pic1',
  },
  {
    img: pic2,
    title: 'Pic2',
  },
  {
    img: pic3,
    title: 'Pic3',
  },
  {
    img: pic4,
    title: 'Pic4',
  },
  {
    img: pic5,
    title: 'Pic5',
  },
  {
    img: pic6,
    title: 'Pic6',
  },
  {
    img: pic7,
    title: 'Pic7',
  },
  {
    img: pic8,
    title: 'Pic8',
  },
  {
    img: pic9,
    title: 'Pic9',
  },
  {
    img: pic10,
    title: 'Pic10',
  },
];

export default Photo;