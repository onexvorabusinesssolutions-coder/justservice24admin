import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import logo from 'assets/images/justservice-logo.png';

const NavCard = () => (
  <Card sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', m: 2 }}>
    <CardContent>
      <Stack alignItems="center" spacing={1.5}>
        <CardMedia
          component="img"
          image={logo}
          sx={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 2 }}
        />
        <Stack alignItems="center" spacing={0.5}>
          <Typography variant="h5" fontWeight={700} color="#16a34a">
            JustService24
          </Typography>
          <Typography variant="caption" color="textSecondary" textAlign="center">
            Admin Dashboard
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default NavCard;
