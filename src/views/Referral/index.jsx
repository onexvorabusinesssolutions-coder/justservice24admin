import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Grid
} from '@mui/material';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import api from 'config/api';

export default function Referral() {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalEarned: 0, totalRedeemed: 0 });

  useEffect(() => {
    api.get('/referrals/admin/all').then(r => setReferrals(r.data.data || [])).catch(() => setReferrals([]));
    api.get('/referrals/admin/stats').then(r => setStats(r.data.data || {})).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Referrals', value: stats.total, icon: <PeopleAltOutlinedIcon />, color: '#1976d2' },
    { label: 'Total Earned (₹)', value: stats.totalEarned, icon: <AccountBalanceWalletOutlinedIcon />, color: '#00C853' },
    { label: 'Total Redeemed (₹)', value: stats.totalRedeemed, icon: <RedeemOutlinedIcon />, color: '#f57c00' },
  ];

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>Referral & Redeem</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(s => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: s.color, width: 48, height: 48 }}>{s.icon}</Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                  <Typography variant="body2" color="textSecondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Referral Code</b></TableCell>
                  <TableCell><b>Referred Users</b></TableCell>
                  <TableCell><b>Total Earned (₹)</b></TableCell>
                  <TableCell><b>Redeemed (₹)</b></TableCell>
                  <TableCell><b>Balance (₹)</b></TableCell>
                  <TableCell><b>Joined</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {referrals.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center">No referral data found</TableCell></TableRow>
                ) : referrals.map(r => (
                  <TableRow key={r._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#00C853', fontSize: 13 }}>
                          {r.userId?.name?.[0] || r.userId?.phone?.[0] || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{r.userId?.name || '—'}</Typography>
                          <Typography variant="caption" color="textSecondary">{r.userId?.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={r.referralCode} size="small" variant="outlined" /></TableCell>
                    <TableCell>{r.referredUsers?.length || 0}</TableCell>
                    <TableCell sx={{ color: '#00C853', fontWeight: 600 }}>₹{r.totalEarned}</TableCell>
                    <TableCell sx={{ color: '#f57c00', fontWeight: 600 }}>₹{r.redeemed}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{r.balance}</TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(r.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
