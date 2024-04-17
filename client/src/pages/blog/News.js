import React from "react"
import Typography from "@mui/material/Typography"
import { Card, CardContent, useMediaQuery } from "@mui/material"
import Masonry from "@mui/lab/Masonry"
import { newsArray } from "../../data/News"

function News() {
  const isMediumScreen = useMediaQuery("(max-width:750px)")

  return (
    <Masonry columns={isMediumScreen ? 1 : 2} spacing={3}>
      {newsArray.map((news, index) => (
        <Card key={index} elevation={0}>
          <CardContent>
            <Typography variant='body1'>{news.title}</Typography>
            <Typography variant='body1' color='text.secondary'>
              {news.date}
            </Typography>
            <Typography variant='body1' mt={2}>
              {news.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  )
}

export default News
