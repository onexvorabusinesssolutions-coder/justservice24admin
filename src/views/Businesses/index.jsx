import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Box,
  TextField, Select, MenuItem, FormControl, InputLabel, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Avatar, Grid, Divider, Tabs, Tab
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Swal from 'sweetalert2';
import api, { IMG_BASE } from 'config/api';

const statusColor = { pending: 'warning', approved: 'success', rejected: 'error' };

const InfoRow = ({ label, value }) => value ? (
  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140, color: '#374151' }}>{label}:</Typography>
    <Typography variant="body2" color="textSecondary">{value}</Typography>
  </Box>
) : null;

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = filter ? `/businesses/admin/all?status=${filter}` : '/businesses/admin/all';
      const res = await api.get(url);
      setBusinesses(res.data.data?.businesses || []);
    } catch { setBusinesses([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.patch(`/businesses/admin/${id}/status`, { status });
    fetchData();
    setSelected(null);
  };

  const deleteBusiness = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Business?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/businesses/admin/${id}`);
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    fetchData();
  };

  const openEdit = (b) => {
    setEditData({
      _id: b._id,
      businessName: b.businessName || '',
      personName: b.personName || '',
      phone: b.phone || '',
      whatsapp: b.whatsapp || '',
      email: b.email || '',
      category: b.category || '',
      subCategory: b.subCategory || '',
      city: b.city || '',
      state: b.state || '',
      address: b.address || '',
      description: b.description || '',
      website: b.website || '',
      tagline: b.tagline || '',
      status: b.status || 'pending',
    });
  };

  const saveEdit = async () => {
    try {
      await api.patch(`/businesses/admin/${editData._id}/status`, { status: editData.status });
      await api.put(`/businesses/${editData._id}`, editData);
      Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
      setEditData(null);
      fetchData();
    } catch {
      Swal.fire({ icon: 'error', title: 'Update failed', timer: 1500, showConfirmButton: false });
    }
  };

  const filtered = businesses.filter(b =>
    b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    b.phone?.includes(search) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  const imgUrl = (path) => path ? `${IMG_BASE}/${path.replace(/\\/g, '/')}` : null;

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>Business Management</Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search business / phone / category..." value={search}
          onChange={e => setSearch(e.target.value)} sx={{ minWidth: 280 }} />
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
        <CardHeader title={<Typography variant="h5">All Businesses ({filtered.length})</Typography>} />
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>Business</b></TableCell>
                  <TableCell><b>Owner</b></TableCell>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Sub Category</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>City</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} align="center">
                    {loading ? 'Loading...' : 'No businesses found'}
                  </TableCell></TableRow>
                ) : filtered.map(b => (
                  <TableRow key={b._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={imgUrl(b.logo)} sx={{ width: 38, height: 38, bgcolor: '#00C853', fontSize: 14 }}>
                          {b.businessName?.[0]}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={600}>{b.businessName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{b.personName || b.userId?.name || '—'}</Typography>
                        <Typography variant="caption" color="textSecondary">{b.userId?.phone || b.userId?.email || ''}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {b.category || b.categories?.[0] || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {b.subCategory || (b.subCategories && Object.values(b.subCategories)?.[0]?.[0]) || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2">{b.phone}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{b.city}</Typography></TableCell>
                    <TableCell><Chip label={b.status} color={statusColor[b.status]} size="small" /></TableCell>
                    <TableCell><Typography variant="caption">{new Date(b.createdAt).toLocaleDateString('en-IN')}</Typography></TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" title="View" onClick={() => { setSelected(b); setTab(0); }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="warning" title="Edit" onClick={() => openEdit(b)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      {b.status === 'pending' && <>
                        <IconButton size="small" color="success" title="Approve" onClick={() => updateStatus(b._id, 'approved')}>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" title="Reject" onClick={() => updateStatus(b._id, 'rejected')}>
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </>}
                      <IconButton size="small" color="error" title="Delete" onClick={() => deleteBusiness(b._id)}>
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

      {/* ── View Detail Dialog ── */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Business Details
          <Chip label={selected?.status} color={statusColor[selected?.status]} size="small" sx={{ ml: 2 }} />
        </DialogTitle>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: '1px solid #f0f0f0' }}>
          <Tab label="Basic Info" />
          <Tab label="Images" />
          <Tab label="Services & Products" />
          <Tab label="Owner Info" />
        </Tabs>
        <DialogContent dividers>
          {selected && tab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                <Avatar src={imgUrl(selected.logo)} sx={{ width: 90, height: 90, mx: 'auto', mb: 1, bgcolor: '#00C853', fontSize: 28 }}>
                  {selected.businessName?.[0]}
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700}>{selected.businessName}</Typography>
                <Typography variant="caption" color="textSecondary">{selected.tagline}</Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <InfoRow label="Business Name" value={selected.businessName} />
                <InfoRow label="Business Type" value={selected.businessType} />
                <InfoRow label="Category" value={selected.category || selected.categories?.[0]} />
                <InfoRow label="Sub Category" value={selected.subCategory || (selected.subCategories && Object.values(selected.subCategories)?.[0]?.[0])} />
                {selected.categories?.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140 }}>All Categories:</Typography>
                    {selected.categories.map(c => <Chip key={c} label={c} size="small" />)}
                  </Box>
                )}
                <InfoRow label="Phone" value={selected.phone} />
                <InfoRow label="WhatsApp" value={selected.whatsapp} />
                <InfoRow label="Email" value={selected.email} />
                <InfoRow label="Website" value={selected.website} />
                <Divider sx={{ my: 1 }} />
                <InfoRow label="Address" value={selected.address} />
                <InfoRow label="City" value={selected.city} />
                <InfoRow label="District" value={selected.district} />
                <InfoRow label="State" value={selected.state} />
                <InfoRow label="Pincode" value={selected.pincode} />
                <Divider sx={{ my: 1 }} />
                <InfoRow label="Description" value={selected.description} />
                <InfoRow label="Established" value={selected.established} />
                <InfoRow label="Rating" value={selected.rating ? `${selected.rating} ⭐ (${selected.reviews} reviews)` : null} />
                <InfoRow label="Total Clicks" value={selected.totalClicks} />
              </Grid>
            </Grid>
          )}

          {selected && tab === 1 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Business Images</Typography>
              {(!selected.images || selected.images.length === 0)
                ? <Typography color="textSecondary" variant="body2">No images uploaded</Typography>
                : <Grid container spacing={1.5}>
                    {selected.images.map((img, i) => (
                      <Grid item xs={6} sm={4} key={i}>
                        <Box component="img" src={imgUrl(img)} alt={`img-${i}`}
                          sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 2, border: '1px solid #e2e8f0' }} />
                      </Grid>
                    ))}
                  </Grid>
              }
              {selected.brochure && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Brochure</Typography>
                  <Box component="img" src={imgUrl(selected.brochure)}
                    sx={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 2, border: '1px solid #e2e8f0' }} />
                </Box>
              )}
            </Box>
          )}

          {selected && tab === 2 && (
            <Box>
              {selected.services?.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Services</Typography>
                  <Table size="small" sx={{ mb: 3 }}>
                    <TableHead><TableRow sx={{ background: '#f8fafc' }}>
                      <TableCell><b>Service</b></TableCell>
                      <TableCell><b>Price</b></TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {selected.services.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
              {selected.products?.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Products</Typography>
                  <Grid container spacing={1.5}>
                    {selected.products.map((p, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5, display: 'flex', gap: 1.5 }}>
                          {p.image && <Box component="img" src={imgUrl(p.image)} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }} />}
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>{p.name}</Typography>
                            <Typography variant="caption" color="textSecondary">₹{p.price} {p.discount && `• ${p.discount}% off`}</Typography>
                            <Typography variant="caption" display="block" color="textSecondary">{p.description}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {(!selected.services?.length && !selected.products?.length) && (
                <Typography color="textSecondary" variant="body2">No services or products added</Typography>
              )}
            </Box>
          )}

          {selected && tab === 3 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Owner / User Info</Typography>
              <InfoRow label="Owner Name" value={selected.personName || selected.userId?.name} />
              <InfoRow label="User Phone" value={selected.userId?.phone} />
              <InfoRow label="User Email" value={selected.userId?.email} />
              <InfoRow label="Payment Modes" value={selected.paymentModes?.join(', ')} />
              <InfoRow label="Delivery Enabled" value={selected.logistryEnabled ? 'Yes' : 'No'} />
              <InfoRow label="Delivery Range" value={selected.deliveryRange} />
              <InfoRow label="Profile Complete" value={selected.profilePct ? `${selected.profilePct}%` : null} />
              <InfoRow label="Verified" value={selected.verified ? 'Yes ✅' : 'No'} />
            </Box>
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
          <Button variant="outlined" color="warning" onClick={() => { openEdit(selected); setSelected(null); }}>Edit</Button>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editData} onClose={() => setEditData(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Business</DialogTitle>
        <DialogContent dividers>
          {editData && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {[
                ['businessName', 'Business Name'],
                ['personName', 'Owner Name'],
                ['phone', 'Phone'],
                ['whatsapp', 'WhatsApp'],
                ['email', 'Email'],
                ['category', 'Category'],
                ['subCategory', 'Sub Category'],
                ['city', 'City'],
                ['state', 'State'],
                ['address', 'Address'],
                ['website', 'Website'],
                ['tagline', 'Tagline'],
                ['description', 'Description'],
              ].map(([key, label]) => (
                <Grid item xs={12} sm={key === 'description' || key === 'address' ? 12 : 6} key={key}>
                  <TextField fullWidth size="small" label={label} value={editData[key]}
                    onChange={e => setEditData(p => ({ ...p, [key]: e.target.value }))}
                    multiline={key === 'description' || key === 'address'} rows={key === 'description' ? 3 : 1} />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={editData.status} label="Status" onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={saveEdit}>Save Changes</Button>
          <Button onClick={() => setEditData(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
