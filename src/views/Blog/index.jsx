import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import api, { IMG_BASE } from 'config/api';

const empty = { title: '', category: '', excerpt: '', content: '', author: 'JustService Team', tags: '', isPublished: false };

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs/admin/all');
      setBlogs(res.data.data || []);
    } catch { setBlogs([]); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setImgFile(null); setOpen(true); };
  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title, category: b.category || '', excerpt: b.excerpt || '', content: b.content || '', author: b.author || '', tags: b.tags?.join(', ') || '', isPublished: b.isPublished });
    setImgFile(null);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imgFile) fd.append('image', imgFile);
    if (editing) {
      await api.put(`/blogs/admin/${editing._id}`, fd);
    } else {
      await api.post('/blogs/admin', fd);
    }
    setOpen(false);
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    await api.delete(`/blogs/admin/${id}`);
    fetchBlogs();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" fontWeight={700}>Blog Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ background: '#00C853' }}>
          Add Blog
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>Blog</b></TableCell>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Author</b></TableCell>
                  <TableCell><b>Views</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center">No blogs yet</TableCell></TableRow>
                ) : blogs.map(b => (
                  <TableRow key={b._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={b.image ? `${IMG_BASE}/${b.image}` : ''} variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#e8f5e9' }}>
                          📝
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ maxWidth: 200 }} noWrap>{b.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{b.category || '—'}</TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell>{b.views || 0}</TableCell>
                    <TableCell>
                      <Chip label={b.isPublished ? 'Published' : 'Draft'} size="small"
                        color={b.isPublished ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(b.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => setPreview(b)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="info" onClick={() => openEdit(b)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => deleteBlog(b._id)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title *" value={form.title} onChange={e => f('title', e.target.value)} required fullWidth />
            <TextField label="Category" value={form.category} onChange={e => f('category', e.target.value)} fullWidth />
            <TextField label="Author" value={form.author} onChange={e => f('author', e.target.value)} fullWidth />
            <TextField label="Excerpt" value={form.excerpt} onChange={e => f('excerpt', e.target.value)} fullWidth multiline rows={2} />
            <TextField label="Content" value={form.content} onChange={e => f('content', e.target.value)} fullWidth multiline rows={5} />
            <TextField label="Tags (comma separated)" value={form.tags} onChange={e => f('tags', e.target.value)} fullWidth placeholder="e.g. business, tips, local" />
            <Box>
              <Typography variant="caption" color="textSecondary">Cover Image</Typography>
              <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} style={{ display: 'block', marginTop: 4 }} />
            </Box>
            <FormControlLabel control={<Switch checked={form.isPublished} onChange={e => f('isPublished', e.target.checked)} color="success" />} label="Publish" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ background: '#00C853' }}>{editing ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{preview?.title}</DialogTitle>
        <DialogContent dividers>
          {preview?.image && <img src={`${IMG_BASE}/${preview.image}`} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />}
          <Typography variant="caption" color="textSecondary">{preview?.category} • {preview?.author} • {preview?.views} views</Typography>
          <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{preview?.content || preview?.excerpt}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
