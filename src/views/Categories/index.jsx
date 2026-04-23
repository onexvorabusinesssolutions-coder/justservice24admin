import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Chip, Collapse, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem,
  FormControl, InputLabel, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import api, { IMG_BASE } from 'config/api';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddSub, setShowAddSub] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '', type: 'business' });
  const [subForm, setSubForm] = useState({ name: '', icon: '' });
  const [imgFile, setImgFile] = useState(null);
  const [subImgFile, setSubImgFile] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/categories/admin/all');
      setCats(res.data.data || []);
    } catch { setCats([]); }
  };

  useEffect(() => { fetchData(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imgFile) fd.append('image', imgFile);
    await api.post('/categories/admin', fd);
    setShowAdd(false); setForm({ name: '', icon: '', type: 'business' }); setImgFile(null);
    fetchData();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/categories/admin/${id}`);
    fetchData();
  };

  const addSubCategory = async (e, catId) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', subForm.name); fd.append('icon', subForm.icon);
    if (subImgFile) fd.append('image', subImgFile);
    await api.post(`/categories/admin/${catId}/subcategory`, fd);
    setShowAddSub(null); setSubForm({ name: '', icon: '' }); setSubImgFile(null);
    fetchData();
  };

  const deleteSubCategory = async (catId, subId) => {
    if (!window.confirm('Delete subcategory?')) return;
    await api.delete(`/categories/admin/${catId}/subcategory/${subId}`);
    fetchData();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" fontWeight={700}>Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAdd(true)}
          sx={{ background: '#00C853' }}>Add Category</Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Type</b></TableCell>
                  <TableCell><b>Subcategories</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cats.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center">No categories yet. Add one!</TableCell></TableRow>
                ) : cats.map(cat => (
                  <React.Fragment key={cat._id}>
                    <TableRow hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {cat.image
                            ? <Avatar src={`${IMG_BASE}/${cat.image}`} sx={{ width: 36, height: 36 }} />
                            : <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8f5e9', fontSize: 20 }}>{cat.icon || '📁'}</Avatar>
                          }
                          <Typography fontWeight={600}>{cat.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={cat.type} size="small" color={cat.type === 'business' ? 'primary' : 'secondary'} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`${cat.subCategories?.length || 0} subcats`} size="small" />
                          <IconButton size="small" onClick={() => setExpanded(expanded === cat._id ? null : cat._id)}>
                            {expanded === cat._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<AddIcon />} onClick={() => setShowAddSub(cat._id)}
                          sx={{ mr: 1, color: '#00C853' }}>Add Sub</Button>
                        <IconButton size="small" color="error" onClick={() => deleteCategory(cat._id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ p: 0, border: 0 }}>
                        <Collapse in={expanded === cat._id}>
                          <Box sx={{ background: '#f8fafc', px: 4, py: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Subcategories</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {cat.subCategories?.length === 0 && <Typography variant="caption" color="textSecondary">No subcategories</Typography>}
                              {cat.subCategories?.map(sub => (
                                <Chip key={sub._id}
                                  avatar={sub.image ? <Avatar src={`${IMG_BASE}/${sub.image}`} /> : <Avatar>{sub.icon || '•'}</Avatar>}
                                  label={sub.name}
                                  onDelete={() => deleteSubCategory(cat._id, sub._id)}
                                  sx={{ fontSize: 13 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAdd} onClose={() => setShowAdd(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <form onSubmit={addCategory}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Category Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required fullWidth />
            <TextField label="Icon (emoji)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} fullWidth placeholder="e.g. 🏪" />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="caption" color="textSecondary">Category Image (optional)</Typography>
              <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ background: '#00C853' }}>Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add SubCategory Dialog */}
      <Dialog open={!!showAddSub} onClose={() => setShowAddSub(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Subcategory</DialogTitle>
        <form onSubmit={e => addSubCategory(e, showAddSub)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Subcategory Name *" value={subForm.name} onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))} required fullWidth />
            <TextField label="Icon (emoji)" value={subForm.icon} onChange={e => setSubForm(f => ({ ...f, icon: e.target.value }))} fullWidth placeholder="e.g. 🛒" />
            <Box>
              <Typography variant="caption" color="textSecondary">Subcategory Image (optional)</Typography>
              <input type="file" accept="image/*" onChange={e => setSubImgFile(e.target.files[0])} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddSub(null)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ background: '#00C853' }}>Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
