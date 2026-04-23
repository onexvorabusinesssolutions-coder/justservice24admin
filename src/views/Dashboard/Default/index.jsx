import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid, Card, CardContent, Typography, Box, Divider, CardHeader, Chip, Avatar
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { gridSpacing } from 'config.js';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReportCard from './ReportCard';
import api from 'config/api';

const COLORS = ['#00C853', '#0284c7', '#f59e0b', '#ef4444', '#7c3aed'];
const statusColor = { pending: 'warning', approved: 'success', rejected: 'error', open: 'error', resolved: 'success' };

export default function Default() {
  const theme = useTheme();
  const [stats, setStats] = useState({});
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data || {})).catch(() => {});
    api.get('/admin/dashboard').then(r => setDashboard(r.data.data || {})).catch(() => {});
  }, []);

  const businessPieData = [
    { name: 'Approved', value: stats.approvedBusinesses || 0 },
    { name: 'Pending', value: stats.pendingBusinesses || 0 },
    { name: 'Rejected', value: stats.rejectedBusinesses || 0 },
  ].filter(d => d.value > 0);

  const usersBarData = [
    { name: 'Total', value: stats.totalUsers || 0 },
    { name: 'Active', value: stats.activeUsers || 0 },
    { name: 'Inactive', value: (stats.totalUsers || 0) - (stats.activeUsers || 0) },
  ];

  const adsetBarData = [
    { name: 'Total', value: stats.totalAdsets || 0 },
    { name: 'Active', value: stats.activeAdsets || 0 },
    { name: 'Pending', value: stats.pendingAdsets || 0 },
  ];

  const platformData = [
    { name: 'Users', value: stats.totalUsers || 0 },
    { name: 'Businesses', value: stats.totalBusinesses || 0 },
    { name: 'AdSets', value: stats.totalAdsets || 0 },
    { name: 'Categories', value: stats.totalCategories || 0 },
    { name: 'Tickets', value: stats.openTickets || 0 },
  ];

  return (
    <Grid container spacing={gridSpacing}>

      {/* Stats Cards Row 1 */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={String(stats.totalUsers || 0)}
              secondary="Total Users"
              color={theme.palette.primary.main}
              footerData={`${stats.activeUsers || 0} active`}
              iconPrimary={PeopleAltOutlinedIcon}
              iconFooter={PeopleAltOutlinedIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={String(stats.totalBusinesses || 0)}
              secondary="Total Businesses"
              color={theme.palette.secondary.main}
              footerData={`${stats.pendingBusinesses || 0} pending`}
              iconPrimary={BusinessOutlinedIcon}
              iconFooter={HourglassEmptyIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={String(stats.activeAdsets || 0)}
              secondary="Active AdSets"
              color={theme.palette.warning.main}
              footerData={`${stats.pendingAdsets || 0} pending`}
              iconPrimary={CampaignOutlinedIcon}
              iconFooter={HourglassEmptyIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={`₹${stats.totalRevenue || 0}`}
              secondary="Total Revenue"
              color={theme.palette.success.main}
              footerData="From approved ads"
              iconPrimary={CurrencyRupeeIcon}
              iconFooter={CurrencyRupeeIcon}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Stats Cards Row 2 */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {[
            { label: 'Open Tickets', value: stats.openTickets || 0, color: '#ef4444', icon: SupportAgentOutlinedIcon },
            { label: 'Approved Businesses', value: stats.approvedBusinesses || 0, color: '#00C853', icon: BusinessOutlinedIcon },
            { label: 'Rejected Businesses', value: stats.rejectedBusinesses || 0, color: '#f59e0b', icon: BusinessOutlinedIcon },
            { label: 'Total Categories', value: stats.totalCategories || 0, color: '#0284c7', icon: CampaignOutlinedIcon },
          ].map(s => (
            <Grid item lg={3} sm={6} xs={12} key={s.label}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                  <Avatar sx={{ bgcolor: s.color, width: 48, height: 48 }}>
                    <s.icon sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                    <Typography variant="body2" color="textSecondary">{s.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Recent Businesses */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={<Typography variant="h5">Recent Businesses</Typography>} />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {!dashboard.recentBusinesses?.length ? (
              <Typography color="textSecondary" variant="body2" sx={{ p: 2 }}>No businesses yet</Typography>
            ) : dashboard.recentBusinesses.map(b => (
              <Box key={b._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{b.businessName}</Typography>
                  <Typography variant="caption" color="textSecondary">{b.city} • {new Date(b.createdAt).toLocaleDateString('en-IN')}</Typography>
                </Box>
                <Chip label={b.status} color={statusColor[b.status]} size="small" />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Support Tickets */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={<Typography variant="h5">Recent Support Tickets</Typography>} />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {!dashboard.recentTickets?.length ? (
              <Typography color="textSecondary" variant="body2" sx={{ p: 2 }}>No tickets yet</Typography>
            ) : dashboard.recentTickets.map(t => (
              <Box key={t._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{t.subject || 'Support Request'}</Typography>
                  <Typography variant="caption" color="textSecondary">{new Date(t.createdAt).toLocaleDateString('en-IN')}</Typography>
                </Box>
                <Chip label={t.status} color={statusColor[t.status]} size="small" />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Users */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={<Typography variant="h5">Recent Users</Typography>} />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {!dashboard.recentUsers?.length ? (
              <Typography color="textSecondary" variant="body2" sx={{ p: 2 }}>No users yet</Typography>
            ) : dashboard.recentUsers.map(u => (
              <Box key={u._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#00C853', fontSize: 13 }}>
                    {u.name?.[0] || u.phone?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{u.name || '—'}</Typography>
                    <Typography variant="caption" color="textSecondary">{u.phone}</Typography>
                  </Box>
                </Box>
                <Chip label={u.isActive ? 'Active' : 'Inactive'} color={u.isActive ? 'success' : 'error'} size="small" />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent AdSets */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={<Typography variant="h5">Recent AdSets</Typography>} />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {!dashboard.recentAdsets?.length ? (
              <Typography color="textSecondary" variant="body2" sx={{ p: 2 }}>No adsets yet</Typography>
            ) : dashboard.recentAdsets.map(a => (
              <Box key={a._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{a.businessName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {a.adPlacement} • {a.amount ? `₹${a.amount}` : '—'}
                  </Typography>
                </Box>
                <Chip label={a.status} color={statusColor[a.status]} size="small" />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Business Status Pie */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title={<Typography variant="h5">Business Status</Typography>} />
          <Divider />
          <CardContent>
            {businessPieData.length === 0 ? (
              <Typography color="textSecondary" variant="body2" sx={{ textAlign: 'center', py: 4 }}>No data yet</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={businessPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}>
                    {businessPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Users Bar */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title={<Typography variant="h5">Users Overview</Typography>} />
          <Divider />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={usersBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {usersBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* AdSet Bar */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title={<Typography variant="h5">AdSet Overview</Typography>} />
          <Divider />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={adsetBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {adsetBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Platform Overview Area */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Typography variant="h5">Platform Overview</Typography>} />
          <Divider />
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={platformData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={2.5}
                  fill="url(#colorVal)" dot={{ r: 5, fill: '#0284c7' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}
