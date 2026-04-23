import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Box,
  TextField, Select, MenuItem, FormControl, InputLabel, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Avatar, Grid, Pagination
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import api, { IMG_BASE } from 'config/api';

const statusColor = { pending: 'warning', approved: 'success', rejected: 'error' };
const LIMIT = 15;

const InfoRow = ({ label, value }) => value ? (
  <Box sx={{ display: 'flex', gap: 1, mb: 0.8 }}>
    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140, color: '#374151' }}>{label}:</Typography>
    <Typography variant="body2" color="textSecondary">{value}</Typography>
  </Box>
) : null;

export default function AdSets() {
  const [adsets, setAdsets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: LIMIT });
      if (filter) params.append('status', filter);
      const res = await api.get(`/adsets/admin/all?${params}`);
      setAdsets(res.data.data?.adsets || []);
      setTotal(res.data.data?.total || 0);
    } catch { setAdsets([]); }
    setLoading(false);
  };

  useEffect(() => { setPage(1); fetchData(1); }, [filter]);
  useEffect(() => { fetchData(page); }, [page]);

  const updateStatus = async (id, status) => {
    await api.patch(`/adsets/admin/${id}/status`, { status });
    Swal.fire({ icon: 'success', title: `Ad ${status}!`, timer: 1500, showConfirmButton: false });
    fetchData(page);
    setSelected(null);
  };

  const deleteAd = async (id) => {
    const result = await Swal.fire({
      title: 'Delete AdSet?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/adsets/admin/${id}`);
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    fetchData(page);
    setSelected(null);
  };

  const filtered = adsets.filter(a =>
    a.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    a.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>AdSet Management</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search business / name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filter} label="Status" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardHeader
          title={<Typography variant="h5">All AdSets</Typography>}
          subheader={`Total: ${total}`}
        />
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>Ad Image</b></TableCell>
                  <TableCell><b>Business</b></TableCell>
                  <TableCell><b>Placement</b></TableCell>
                  <TableCell><b>Duration</b></TableCell>
                  <TableCell><b>Amount</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center">No adsets found</TableCell></TableRow>
                ) : filtered.map(a => (
                  <TableRow key={a._id} hover>
                    <TableCell>
                      {a.image
                        ? <Box component="img" src={`${IMG_BASE}/${a.image}`} alt="ad"
                            sx={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 1, border: '1px solid #e2e8f0' }} />
                        : <Avatar variant="rounded" sx={{ width: 56, height: 40, bgcolor: '#e8f5e9', fontSize: 20 }}>📢</Avatar>
                      }
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>{a.businessName}</Typography>
                      <Typography variant="caption" color="textSecondary">{a.fullName} • {a.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={a.adPlacement || '—'} size="small" color="primary" variant="outlined" />
                      {a.bannerPosition && <Typography variant="caption" display="block" color="textSecondary">{a.bannerPosition}</Typography>}
                      {a.category && <Typography variant="caption" display="block" color="textSecondary">{a.category}</Typography>}
                    </TableCell>
                    <TableCell><Typography variant="body2">{a.duration || '—'}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="#00C853">
                        {a.amount ? `₹${a.amount}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={a.status} color={statusColor[a.status]} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(a.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => setSelected(a)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      {a.status === 'pending' && <>
                        <IconButton size="small" color="success" title="Approve" onClick={() => updateStatus(a._id, 'approved')}>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" title="Reject" onClick={() => updateStatus(a._id, 'rejected')}>
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </>}
                      <IconButton size="small" color="error" onClick={() => deleteAd(a._id)}>
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

      {/* Detail Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          AdSet Details
          {selected && <Chip label={selected.status} color={statusColor[selected.status]} size="small" sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Grid container spacing={2}>
              {selected.image && (
                <Grid item xs={12}>
                  <Box component="img" src={`${IMG_BASE}/${selected.image}`} alt="ad"
                    sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 2, border: '1px solid #e2e8f0' }} />
                </Grid>
              )}
              <Grid item xs={12}>
                <InfoRow label="Business Name" value={selected.businessName} />
                <InfoRow label="Contact Name" value={selected.fullName} />
                <InfoRow label="Phone" value={selected.phone} />
                <InfoRow label="Email" value={selected.email} />
                <InfoRow label="Ad Placement" value={selected.adPlacement} />
                <InfoRow label="Banner Position" value={selected.bannerPosition} />
                <InfoRow label="Category" value={selected.category} />
                <InfoRow label="Sub Category" value={selected.subCategory} />
                <InfoRow label="Duration" value={selected.duration} />
                <InfoRow label="Amount" value={selected.amount ? `₹${selected.amount}` : null} />
                <InfoRow label="Payment ID" value={selected.paymentId} />
                <InfoRow label="Order ID" value={selected.orderId} />
                <InfoRow label="Payment Status" value={selected.paymentStatus} />
                <InfoRow label="Start Date" value={selected.startDate ? new Date(selected.startDate).toLocaleDateString('en-IN') : null} />
                <InfoRow label="End Date" value={selected.endDate ? new Date(selected.endDate).toLocaleDateString('en-IN') : null} />
                <InfoRow label="Submitted By" value={selected.userId?.name} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selected?.status === 'pending' && <>
            <Button color="success" variant="contained" onClick={() => updateStatus(selected._id, 'approved')}>✓ Approve</Button>
            <Button color="error" variant="outlined" onClick={() => updateStatus(selected._id, 'rejected')}>✕ Reject</Button>
          </>}
          {selected?.status === 'approved' && (
            <Button color="error" variant="outlined" onClick={() => updateStatus(selected._id, 'rejected')}>Reject</Button>
          )}
          {selected?.status === 'rejected' && (
            <Button color="success" variant="contained" onClick={() => updateStatus(selected._id, 'approved')}>Re-Approve</Button>
          )}
          <Button color="error" variant="outlined" onClick={() => deleteAd(selected._id)} startIcon={<DeleteOutlineIcon />}>Delete</Button>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
