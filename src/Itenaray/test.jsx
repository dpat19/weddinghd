<Timeline position="alternate">
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0", color: "rgb(126,116,115)" }}
              align="right"
              variant="body2"
            >
              {weddingEvent.startTime} - {weddingEvent.endTime}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                sx={{
                  bgcolor: "rgb(126,116,115)",
                }}
              >
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="body2" className="itinerary-event-detail">
                <RiMapPin2Line className="icon" /> {weddingEvent.location}
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              9:30 am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="body2" className="itinerary-event-detail">
                Meal Time: {weddingEvent.mealTime || "N/A"}
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
                {weddingEvent.dressCode || "Standard"}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Typography >
                Dress Code
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>