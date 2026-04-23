import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, ToggleButton,
  ToggleButtonGroup, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import api from 'config/api';

const empty = { title: '', message: '', type: 'all' };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const fetchData = async () => {
    try {
      const res = await api.get('/notifications/admin/all');
      setNotifications(res.data.data || []);
    } catch { setNotifications([]); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    await api.post('/notifications/admin', form);
    setOpen(false);
    setForm(empty);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    await api.delete(`/notifications/admin/${id}`);
    fetchData();
  };

  const totalSent = notifications.reduce((sum, n) => sum + (n.sentCount || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" fontWeight={700}>Notifications</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ background: '#00C853' }}>
          Send Notification
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#00C853', width: 48, height: 48 }}><NotificationsOutlinedIcon /></Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{notifications.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total Sent</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}><PeopleAltOutlinedIcon /></Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{totalSent}</Typography>
              <Typography variant="body2" color="textSecondary">Total Users Reached</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Message</b></TableCell>
                  <TableCell><b>Type</b></TableCell>
                  <TableCell><b>Sent To</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">No notifications sent yet</TableCell></TableRow>
                ) : notifications.map(n => (
                  <TableRow key={n._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#e8f5e9' }}>
                          <NotificationsOutlinedIcon sx={{ fontSize: 16, color: '#00C853' }} />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={600}>{n.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>{n.message}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={n.type === 'all' ? 'All Users' : 'Specific'} size="small"
                        color={n.type === 'all' ? 'success' : 'info'} />
                    </TableCell>
                    <TableCell>
                      <Chip label={`${n.sentCount} users`} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(n.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleDelete(n._id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Send Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <form onSubmit={handleSend}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required fullWidth />
            <TextField label="Message *" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required fullWidth multiline rows={3} />
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Send To</Typography>
              <ToggleButtonGroup value={form.type} exclusive onChange={(_, v) => v && setForm(p => ({ ...p, type: v }))} size="small" fullWidth>
                <ToggleButton value="all">All Users</ToggleButton>
                <ToggleButton value="specific">Specific</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<SendOutlinedIcon />} sx={{ background: '#00C853' }}>Send</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
