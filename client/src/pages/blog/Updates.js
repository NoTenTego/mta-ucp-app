import * as React from "react"
import Timeline from "@mui/lab/Timeline"
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import TimelineDot from "@mui/lab/TimelineDot"
import Typography from "@mui/material/Typography"
import { timelineData } from "../../data/Updates"
import { Stack, useMediaQuery } from "@mui/material"

export default function Updates() {
  const isSmallScreen = useMediaQuery("(max-width:500px)")

  return (
    <Timeline
      {...(isSmallScreen
        ? {
            sx: {
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            },
          }
        : {
            position: "alternate",
          })}>
      {timelineData.map((item, index) => (
        <TimelineItem key={index}>
          {item.time && !isSmallScreen && (
            <TimelineOppositeContent sx={{ m: "auto 0" }} align='right' variant='body2' color='text.secondary'>
              {item.time}
            </TimelineOppositeContent>
          )}
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color={index === 2 ? "primary" : "secondary"}>{item.icon}</TimelineDot>
            {index !== timelineData.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Stack spacing={-0.5}>
              <Typography variant='h6' component='span'>
                {item.title}
              </Typography>
              <Typography variant='subtitle1' component='span' color={"text.secondary"}>
                {item.time}
              </Typography>
            </Stack>
            <Typography mt={1.5}>{item.description}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
