import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Box } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function MultiActionAreaCard({ imageSrc, headerName, description, price }) {
  return (
    <Card elevation={0}>
      <CardActionArea>
        <CardMedia component='img' height={230} image={require('../../assets/images/premium/' + imageSrc + '.webp')} alt='green iguana' />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div' mb={3}>
            {headerName}
          </Typography>
          <Box sx={{ height: 200, overflowY: 'auto' }}>
            {Array.isArray(description) ? (
              description.map((item, index) => (
                <Typography key={index} variant='body2' color='text.secondary' sx={{ padding: '2px', margin: 1 }}>
                  {item}
                  {index !== description.length - 1 && <br />}
                </Typography>
              ))
            ) : (
              <Typography variant='body2' color='text.secondary' sx={{ padding: '2px' }}>
                {description}
              </Typography>
            )}
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography variant='h5' mt={3} color='primary.main' sx={{ fontWeight: '600' }}>
              {price}PP
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
