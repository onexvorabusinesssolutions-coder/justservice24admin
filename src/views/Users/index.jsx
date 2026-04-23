import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Box,
  TextField, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Pagination, Tooltip, Stack, InputAdornment
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import Swal from 'sweetalert2';
import api from 'config/api';
import { IMG_BASE } from 'config/api';

const LIMIT = 15;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (pg = 1, q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: LIMIT });
      if (q) params.append('search', q);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.data?.users || []);
      setTotal(res.data.data?.total || 0);
    } catch { setUsers([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(page, search); }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const openDetail = async (u) => {
    setSelected(u);
    try {
      const res = await api.get(`/admin/users/${u._id}`);
      setUserDetail(res.data.data);
    } catch { setUserDetail({ user: u }); }
  };

  const toggleUser = async (u) => {
    const action = u.isActive ? 'Deactivate' : 'Activate';
    const result = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} ${u.name || u.phone}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: u.isActive ? '#ef4444' : '#00C853',
      confirmButtonText: `Yes, ${action}`,
    });
    if (!result.isConfirmed) return;
    await api.patch(`/admin/users/${u._id}/toggle`);
    Swal.fire({ icon: 'success', title: `User ${action}d!`, timer: 1500, showConfirmButton: false });
    fetchUsers(page, search);
    setSelected(null);
  };

  const deleteUser = async (u) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: `This will permanently delete ${u.name || u.phone}. This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/admin/users/${u._id}`);
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    fetchUsers(page, search);
    setSelected(null);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>User Management</Typography>

      {/* Search */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3, display: 'flex', gap: 1.5 }}>
        <TextField
          size="small"
          placeholder="Search name / phone / email..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          sx={{ minWidth: 320 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
          }}
        />
        <Button type="submit" variant="contained" sx={{ background: '#00C853' }}>Search</Button>
        {search && (
          <Button variant="outlined" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}>
            Clear
          </Button>
        )}
      </Box>

      <Card>
        <CardHeader
          title={<Typography variant="h5">All Users</Typography>}
          subheader={`Total: ${total} users`}
        />
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>#</b></TableCell>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Joined</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center">No users found</TableCell></TableRow>
                ) : users.map((u, i) => (
                  <TableRow key={u._id} hover>
                    <TableCell>{(page - 1) * LIMIT + i + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={u.avatar ? `${IMG_BASE}/${u.avatar}` : ''}
                          sx={{ width: 36, height: 36, bgcolor: '#00C853', fontSize: 14 }}
                        >
                          {u.name?.[0] || u.phone?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{u.name || '—'}</Typography>
                          <Typography variant="caption" color="textSecondary">{u.occupation || ''}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>{u.email || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={u.isActive ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(u.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary" onClick={() => openDetail(u)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={u.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton size="small" color={u.isActive ? 'warning' : 'success'} onClick={() => toggleUser(u)}>
                            {u.isActive ? <BlockOutlinedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton size="small" color="error" onClick={() => deleteUser(u)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selected} onClose={() => { setSelected(null); setUserDetail(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          User Details
          {selected && (
            <Chip
              label={selected.isActive ? 'Active' : 'Inactive'}
              size="small"
              color={selected.isActive ? 'success' : 'error'}
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              {/* Avatar & Basic */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  src={selected.avatar ? `${IMG_BASE}/${selected.avatar}` : ''}
                  sx={{ width: 72, height: 72, bgcolor: '#00C853', fontSize: 28 }}
                >
                  {selected.name?.[0] || selected.phone?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{selected.name || '—'}</Typography>
                  <Typography variant="body2" color="textSecondary">{selected.phone}</Typography>
                  <Typography variant="body2" color="textSecondary">{selected.email || '—'}</Typography>
                </Box>
              </Box>

              {/* Profile Info */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#374151' }}>Profile Info</Typography>
              {[
                ['Address', selected.address],
                ['Occupation', selected.occupation],
                ['Gender', selected.gender],
                ['Date of Birth', selected.dob],
                ['Marital Status', selected.maritalStatus],
                ['Joined', new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
              ].map(([label, val]) => val ? (
                <Box key={label} sx={{ display: 'flex', gap: 1, mb: 0.8 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140, color: '#374151' }}>{label}:</Typography>
                  <Typography variant="body2" color="textSecondary">{val}</Typography>
                </Box>
              ) : null)}

              {/* Businesses */}
              {userDetail?.businesses?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#374151', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BusinessOutlinedIcon fontSize="small" /> Businesses ({userDetail.businesses.length})
                  </Typography>
                  {userDetail.businesses.map(b => (
                    <Box key={b._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid #f0f0f0' }}>
                      <Typography variant="body2">{b.businessName}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="caption" color="textSecondary">{b.city}</Typography>
                        <Chip label={b.status} size="small" color={b.status === 'approved' ? 'success' : b.status === 'pending' ? 'warning' : 'error'} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Referral */}
              {userDetail?.referral && (
                <Box sx={{ mt: 2, background: '#f0fdf4', borderRadius: 2, p: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#15803d', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <RedeemOutlinedIcon fontSize="small" /> Referral Info
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box><Typography variant="caption" color="textSecondary">Total Earned</Typography><Typography variant="subtitle2" fontWeight={700} color="#00C853">₹{userDetail.referral.totalEarned}</Typography></Box>
                    <Box><Typography variant="caption" color="textSecondary">Balance</Typography><Typography variant="subtitle2" fontWeight={700}>₹{userDetail.referral.balance}</Typography></Box>
                    <Box><Typography variant="caption" color="textSecondary">Redeemed</Typography><Typography variant="subtitle2" fontWeight={700} color="#f57c00">₹{userDetail.referral.redeemed}</Typography></Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color={selected?.isActive ? 'warning' : 'success'}
            variant="outlined"
            onClick={() => toggleUser(selected)}
            startIcon={selected?.isActive ? <BlockOutlinedIcon /> : <CheckCircleOutlineIcon />}
          >
            {selected?.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button color="error" variant="outlined" onClick={() => deleteUser(selected)} startIcon={<DeleteOutlineIcon />}>
            Delete
          </Button>
          <Button onClick={() => { setSelected(null); setUserDetail(null); }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
