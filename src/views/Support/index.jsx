import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, TextField, Select,
  MenuItem, FormControl, InputLabel, Avatar, Pagination
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import api from 'config/api';

const statusColor = { open: 'error', 'in-progress': 'warning', resolved: 'success' };
const LIMIT = 15;

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(false);

  const fetchTickets = async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: LIMIT });
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/support/admin/all?${params}`);
      const data = res.data.data;
      // backend returns array or paginated object
      if (Array.isArray(data)) {
        setTickets(data);
        setTotal(data.length);
      } else {
        setTickets(data?.tickets || []);
        setTotal(data?.total || 0);
      }
    } catch { setTickets([]); }
    setLoading(false);
  };

  useEffect(() => { setPage(1); fetchTickets(1); }, [statusFilter]);
  useEffect(() => { fetchTickets(page); }, [page]);

  const openTicket = (t) => { setSelected(t); setReply(t.reply || ''); setStatus(t.status); };

  const handleUpdate = async () => {
    try {
      await api.patch(`/support/admin/${selected._id}`, { status, reply });
      Swal.fire({ icon: 'success', title: 'Ticket Updated!', timer: 1500, showConfirmButton: false });
      setSelected(null);
      fetchTickets(page);
    } catch {
      Swal.fire({ icon: 'error', title: 'Update failed', timer: 1500, showConfirmButton: false });
    }
  };

  const deleteTicket = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Ticket?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/support/admin/${id}`);
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    fetchTickets(page);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>Support Tickets</Typography>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select value={statusFilter} label="Filter by Status" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Subject</b></TableCell>
                  <TableCell><b>Message</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">No support tickets</TableCell></TableRow>
                ) : tickets.map(t => (
                  <TableRow key={t._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: 13 }}>
                          {(t.name || t.userId?.name || '?')[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{t.name || t.userId?.name || '—'}</Typography>
                          <Typography variant="caption" color="textSecondary">{t.phone || t.userId?.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{t.subject || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{t.message}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={t.status} size="small" color={statusColor[t.status] || 'default'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(t.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => openTicket(t)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => deleteTicket(t._id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Ticket Details
          {selected && <Chip label={selected.status} size="small" color={statusColor[selected.status]} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selected && (
            <>
              <Box sx={{ background: '#f8fafc', borderRadius: 2, p: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80 }}>From:</Typography>
                  <Typography variant="body2">{selected.name || selected.userId?.name || '—'} • {selected.phone || selected.userId?.phone || selected.email || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80 }}>Subject:</Typography>
                  <Typography variant="body2">{selected.subject || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80 }}>Message:</Typography>
                  <Typography variant="body2">{selected.message}</Typography>
                </Box>
              </Box>

              {selected.reply && (
                <Box sx={{ background: '#f0fdf4', borderRadius: 2, p: 1.5, border: '1px solid #bbf7d0' }}>
                  <Typography variant="caption" fontWeight={700} color="#15803d">Previous Reply:</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{selected.reply}</Typography>
                </Box>
              )}

              <FormControl fullWidth size="small">
                <InputLabel>Update Status</InputLabel>
                <Select value={status} label="Update Status" onChange={e => setStatus(e.target.value)}>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Reply to User"
                value={reply}
                onChange={e => setReply(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Type your reply here... (will be emailed to user)"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} sx={{ background: '#00C853' }}>
            Update & Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
