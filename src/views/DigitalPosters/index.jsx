import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Grid, Card, CardContent, Chip, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import api, { IMG_BASE } from 'config/api';

const BASE = IMG_BASE;

const CATEGORIES = [
  { key: 'Festival',       label: 'Festival',        emoji: '🎉', bg: 'linear-gradient(135deg,#ff6b35,#f7931e)' },
  { key: 'Business',       label: 'Business',         emoji: '💼', bg: 'linear-gradient(135deg,#0284c7,#0ea5e9)' },
  { key: 'Motivational',   label: 'Motivational',     emoji: '💪', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
  { key: 'Social Worker',  label: 'Social Workers',   emoji: '🤝', bg: 'linear-gradient(135deg,#059669,#10b981)' },
  { key: 'Trending',       label: 'Trending',         emoji: '🔥', bg: 'linear-gradient(135deg,#dc2626,#ef4444)' },
  { key: 'Greetings',      label: 'Greetings',        emoji: '👋', bg: 'linear-gradient(135deg,#d97706,#fbbf24)' },
  { key: 'Suvichar',       label: 'Suvichar',         emoji: '🙏', bg: 'linear-gradient(135deg,#be185d,#ec4899)' },
];

export default function DigitalPosters() {
  const [posters, setPosters] = useState([]);
  const [uploadCat, setUploadCat] = useState(null); // which category dialog is open
  const [form, setForm] = useState({ date: '', label: '' });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get('/digital-posters/admin/all');
      setPosters(res.data.data || []);
    } catch { setPosters([]); }
  };

  useEffect(() => { fetchData(); }, []);

  const openUpload = (cat) => {
    setUploadCat(cat);
    setForm({ date: '', label: '' });
    setImgFile(null);
    setImgPreview(null);
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imgFile) { Swal.fire({ icon: 'warning', title: 'Please select an image', timer: 1500, showConfirmButton: false }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('category', uploadCat.key);
      fd.append('label', form.label);
      fd.append('date', form.date);
      fd.append('image', imgFile);
      await api.post('/digital-posters/admin', fd);
      Swal.fire({ icon: 'success', title: 'Poster Uploaded!', timer: 1500, showConfirmButton: false });
      setUploadCat(null);
      fetchData();
    } catch {
      Swal.fire({ icon: 'error', title: 'Upload failed', timer: 1500, showConfirmButton: false });
    }
    setSaving(false);
  };

  const deletePoster = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Poster?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/digital-posters/admin/${id}`);
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false });
    fetchData();
  };

  const postersByCategory = (key) => posters.filter(p => p.category === key);

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>Digital Posters</Typography>

      <Grid container spacing={3}>
        {CATEGORIES.map(cat => {
          const catPosters = postersByCategory(cat.key);
          return (
            <Grid item xs={12} key={cat.key}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                {/* Category Header */}
                <Box sx={{ background: cat.bg, px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography fontSize={28}>{cat.emoji}</Typography>
                    <Box>
                      <Typography variant="h5" fontWeight={700} color="#fff">{cat.label}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>{catPosters.length} poster{catPosters.length !== 1 ? 's' : ''}</Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => openUpload(cat)}
                    sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', '&:hover': { background: 'rgba(255,255,255,0.35)' }, fontWeight: 600 }}
                  >
                    Upload
                  </Button>
                </Box>

                {/* Posters Grid */}
                <CardContent sx={{ p: 2 }}>
                  {catPosters.length === 0 ? (
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography color="textSecondary" variant="body2">No posters yet. Click Upload to add one.</Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {catPosters.map(p => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={p._id}>
                          <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative', '&:hover .del-btn': { opacity: 1 } }}>
                            <Box sx={{ height: 140, background: cat.bg, position: 'relative' }}>
                              <img
                                src={`${IMG_BASE}/${p.image?.replace(/\\/g, '/')}`}
                                alt={p.label}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <IconButton
                                className="del-btn"
                                size="small"
                                onClick={() => deletePoster(p._id)}
                                sx={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', opacity: 0, transition: 'opacity 0.2s', '&:hover': { background: '#ef4444' } }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box sx={{ p: 1, background: '#fff' }}>
                              <Typography variant="caption" fontWeight={700} display="block" noWrap>{p.label}</Typography>
                              {p.date && (
                                <Chip label={p.date} size="small" sx={{ fontSize: 10, height: 18, mt: 0.3, background: cat.bg, color: '#fff' }} />
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={!!uploadCat} onClose={() => setUploadCat(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          {uploadCat?.emoji} Upload {uploadCat?.label} Poster
        </DialogTitle>
        <form onSubmit={handleUpload}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            <TextField
              label="Date (e.g. 17 April)"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              fullWidth
              placeholder="17 April"
              required
            />

            <TextField
              label="Name / Event (e.g. World Hemophilia Day)"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              fullWidth
              placeholder="World Hemophilia Day"
              required
            />

            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Poster Image *</Typography>
              <input type="file" accept="image/*" onChange={handleImgChange} style={{ display: 'block' }} />
              {imgPreview && (
                <Box component="img" src={imgPreview} alt="preview"
                  sx={{ width: '100%', borderRadius: 2, mt: 1.5, maxHeight: 180, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
              )}
            </Box>

            {form.date && form.label && (
              <Box sx={{ background: '#f8fafc', borderRadius: 2, p: 1.5, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" color="textSecondary">Preview label:</Typography>
                <Typography variant="subtitle2" fontWeight={700}>{form.date} • {form.label}</Typography>
              </Box>
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadCat(null)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}
              sx={{ background: uploadCat?.bg || '#00C853', color: '#fff' }}>
              {saving ? 'Uploading...' : 'Upload Poster'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
