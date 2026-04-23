import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  Switch, FormControlLabel, Divider, Alert, Avatar
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import api, { IMG_BASE } from 'config/api';

const empty = {
  appName: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  referralBonus: 50,
  minRedeemAmount: 100,
  maintenanceMode: false,
  socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
};

export default function AppSettings() {
  const [form, setForm] = useState(empty);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => {
      const data = r.data.data || {};
      setForm({ ...empty, ...data, socialLinks: { ...empty.socialLinks, ...data.socialLinks } });
      if (data.appLogo) setLogoPreview(`${IMG_BASE}/${data.appLogo}`);
    }).catch(() => {});
  }, []);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const fSocial = (k, v) => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [k]: v } }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      // Flatten socialLinks for FormData
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'socialLinks') {
          Object.entries(v).forEach(([sk, sv]) => fd.append(`socialLinks[${sk}]`, sv));
        } else {
          fd.append(k, v);
        }
      });
      if (logoFile) fd.append('appLogo', logoFile);
      await api.put('/settings/admin', fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>App Settings</Typography>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>✅ Settings saved successfully!</Alert>}

      <form onSubmit={handleSave}>
        <Grid container spacing={3}>

          {/* General */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" fontWeight={600}>General</Typography>

                {/* App Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={logoPreview}
                    variant="rounded"
                    sx={{ width: 64, height: 64, bgcolor: '#e8f5e9' }}
                  >
                    <ImageOutlinedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>App Logo</Typography>
                    <input type="file" accept="image/*" onChange={handleLogoChange} />
                  </Box>
                </Box>

                <Divider />
                <TextField label="App Name" value={form.appName} onChange={e => f('appName', e.target.value)} fullWidth />
                <TextField label="Contact Email" value={form.contactEmail} onChange={e => f('contactEmail', e.target.value)} fullWidth type="email" />
                <TextField label="Contact Phone" value={form.contactPhone} onChange={e => f('contactPhone', e.target.value)} fullWidth />
                <TextField label="Address" value={form.address} onChange={e => f('address', e.target.value)} fullWidth multiline rows={2} />
                <Divider />
                <FormControlLabel
                  control={<Switch checked={!!form.maintenanceMode} onChange={e => f('maintenanceMode', e.target.checked)} color="error" />}
                  label={<Box><Typography variant="body2" fontWeight={600}>Maintenance Mode</Typography><Typography variant="caption" color="textSecondary">App will show maintenance screen to users</Typography></Box>}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Referral + Social */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" fontWeight={600}>Referral Settings</Typography>
                <TextField
                  label="Referral Bonus (₹)"
                  type="number"
                  value={form.referralBonus}
                  onChange={e => f('referralBonus', Number(e.target.value))}
                  fullWidth
                  inputProps={{ min: 0 }}
                  helperText="Bonus given to referrer and new user on signup"
                />
                <TextField
                  label="Min Redeem Amount (₹)"
                  type="number"
                  value={form.minRedeemAmount}
                  onChange={e => f('minRedeemAmount', Number(e.target.value))}
                  fullWidth
                  inputProps={{ min: 0 }}
                  helperText="Minimum balance required to redeem"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" fontWeight={600}>Social Links</Typography>
                {['facebook', 'instagram', 'twitter', 'youtube'].map(s => (
                  <TextField
                    key={s}
                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                    value={form.socialLinks[s]}
                    onChange={e => fSocial(s, e.target.value)}
                    fullWidth
                    placeholder={`https://${s}.com/...`}
                    size="small"
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              disabled={saving}
              sx={{ background: '#00C853', px: 4, py: 1.2 }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
