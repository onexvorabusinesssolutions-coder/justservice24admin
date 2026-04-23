import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Pagination
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Swal from 'sweetalert2';
import api, { IMG_BASE } from 'config/api';

const LIMIT = 15;

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pg = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/admin/all?page=${pg}&limit=${LIMIT}`);
      setConversations(res.data.data?.conversations || []);
      setTotal(res.data.data?.total || 0);
    } catch { setConversations([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(page); }, [page]);

  const openConversation = async (conv) => {
    try {
      const res = await api.get(`/chat/${conv._id}`);
      setSelected(res.data.data);
    } catch { setSelected(conv); }
  };

  const deleteConversation = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Conversation?',
      text: 'This will permanently delete this conversation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/chat/admin/${id}`);
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    setSelected(null);
    fetchData(page);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>Chat Management</Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>Business</b></TableCell>
                  <TableCell><b>Buyer</b></TableCell>
                  <TableCell><b>Seller</b></TableCell>
                  <TableCell><b>Product</b></TableCell>
                  <TableCell><b>Last Message</b></TableCell>
                  <TableCell><b>Last Activity</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
                ) : conversations.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center">No conversations yet</TableCell></TableRow>
                ) : conversations.map(c => (
                  <TableRow key={c._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={c.businessId?.logo ? `${IMG_BASE}/${c.businessId.logo}` : ''}
                          sx={{ width: 32, height: 32, bgcolor: '#00C853', fontSize: 13 }}
                        >
                          {c.businessId?.businessName?.[0] || 'B'}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{c.businessId?.businessName || '—'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#1976d2', fontSize: 12 }}>
                          {c.buyerId?.name?.[0] || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{c.buyerId?.name || '—'}</Typography>
                          <Typography variant="caption" color="textSecondary">{c.buyerId?.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#f57c00', fontSize: 12 }}>
                          {c.sellerId?.name?.[0] || 'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{c.sellerId?.name || '—'}</Typography>
                          <Typography variant="caption" color="textSecondary">{c.sellerId?.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {c.productName && c.productName.trim() ? c.productName : <span style={{color:'#94a3b8'}}>General Enquiry</span>}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{c.lastMessage}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(c.lastAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => openConversation(c)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => deleteConversation(c._id)}>
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

      {/* Conversation Detail Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatBubbleOutlineIcon /> Conversation Details
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Participants</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    avatar={<Avatar>{selected.buyerId?.name?.[0]}</Avatar>}
                    label={`Buyer: ${selected.buyerId?.name || '—'}`}
                    color="primary"
                  />
                  <Chip
                    avatar={<Avatar>{selected.sellerId?.name?.[0]}</Avatar>}
                    label={`Seller: ${selected.sellerId?.name || '—'}`}
                    color="secondary"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  Business: <Typography component="span" variant="body2" color="textSecondary">{selected.businessId?.businessName || '—'}</Typography>
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Product: <Typography component="span" variant="body2" color="textSecondary">{selected.productName || '—'}</Typography>
                </Typography>
              </Box>

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Messages ({selected.messages?.length || 0})
              </Typography>
              <Box sx={{ maxHeight: 320, overflowY: 'auto', background: '#f8fafc', borderRadius: 2, p: 1.5 }}>
                {!selected.messages?.length ? (
                  <Typography variant="body2" color="textSecondary" align="center">No messages</Typography>
                ) : selected.messages.map((msg, i) => {
                  const isBuyer = msg.senderId?.toString() === (selected.buyerId?._id || selected.buyerId)?.toString();
                  return (
                    <Box key={i} sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', alignItems: isBuyer ? 'flex-start' : 'flex-end' }}>
                      <Box sx={{ background: isBuyer ? '#e3f2fd' : '#f0fdf4', borderRadius: 2, px: 1.5, py: 1, maxWidth: '75%' }}>
                        <Typography variant="caption" fontWeight={700} color={isBuyer ? '#1976d2' : '#00C853'}>
                          {isBuyer ? (selected.buyerId?.name || 'Buyer') : (selected.sellerId?.name || 'Seller')}
                        </Typography>
                        <Typography variant="body2">{msg.text}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.3 }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={() => deleteConversation(selected._id)} startIcon={<DeleteOutlineIcon />}>
            Delete
          </Button>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
