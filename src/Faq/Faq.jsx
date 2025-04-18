// FAQ.jsx
import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import hd from "../assets/HDW-07.png";
import "./Faq.css"

const faqs = [
  {
    question: 'What is the purpose of this site?',
    answer: 'This site is built to celebrate our wedding day, share updates, allow guests to RSVP, view the photo gallery, and see the itinerary.',
  },
  {
    question: 'How do I RSVP?',
    answer: 'Head over to the RSVP page by clicking the "RSVP" link in the navbar. Fill in your details and dietary preferences, then submit.',
  },
  {
    question: 'Where can I see the photos?',
    answer: 'Visit the "Photos" page—there you’ll find a random selection of our favorite moments from the gallery each time you refresh.',
  },
  {
    question: 'What is the schedule for the day?',
    answer: 'Check out the "Itinerary" page for a full breakdown of the ceremony, cocktail hour, reception, and after‑party timings.',
  },
  {
    question: 'Who can I contact if I have questions?',
    answer: 'Feel free to email us at our wedding inbox or reach out via the contact form on the RSVP page.',
  },
];

const FAQ = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        pb: '200px', // ensure space for the fixed footer image
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          py: 4,
          px: 2,
          fontFamily: "'EB Garamond', serif",
          color: 'rgb(126,116,115)',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: 'rgb(126,116,115)',
            fontWeight: 'bold',
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          FAQ
        </Typography>

        {faqs.map((item, idx) => (
          <Accordion
            key={idx}
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              borderBottom: '1px solid rgba(126,116,115,0.3)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: 'rgb(126,116,115)', fontSize: '1.5rem' }}
                />
              }
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'rgb(126,116,115)',
                  fontFamily: "'EB Garamond', serif",
                  fontWeight: 500,
                }}
              >
                {item.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ backgroundColor: 'transparent' }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgb(126,116,115)',
                  fontFamily: "'EB Garamond', serif",
                  lineHeight: 1.6,
                }}
              >
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Fixed footer image */}
    
    </Box>
  );
};

export default FAQ;
