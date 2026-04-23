import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Fade, Button, ClickAwayListener, Paper, Popper, List, ListItemText,
  ListItemIcon, ListItemButton, Typography, Box, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import LockResetIcon from '@mui/icons-material/LockReset';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import Swal from 'sweetalert2';
import api from 'config/api';

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pwdDialog, setPwdDialog] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const anchorRef = React.useRef(null);
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleToggle = () => setOpen(prev => !prev);
  const handleClose = (e) => {
    if (anchorRef.current?.contains(e.target)) return;
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
    });
    if (!result.isConfirmed) return;

    try {
      await api.post('/auth/logout');
    } catch {}

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    await Swal.fire({
      icon: 'success',
      title: 'Logged Out!',
      text: 'You have been logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 6) {
      Swal.fire({ icon: 'error', title: 'Password must be at least 6 characters', timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      await api.post('/admin/change-password', pwdForm);
      setPwdDialog(false);
      setPwdForm({ currentPassword: '', newPassword: '' });
      await Swal.fire({
        icon: 'success',
        title: 'Password Changed!',
        text: 'Please login again with your new password.',
        timer: 2000,
        showConfirmButton: false,
      });
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not change password',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <Button ref={anchorRef} onClick={handleToggle} color="inherit" sx={{ minWidth: { sm: 50, xs: 35 } }}>
        <AccountCircleTwoToneIcon sx={{ fontSize: '1.5rem' }} />
      </Button>

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper sx={{ borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <List sx={{ width: 220, backgroundColor: theme.palette.background.paper, borderRadius: 2, pb: 0 }}>
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="subtitle2" fontWeight={700}>{adminUser.name || 'Admin'}</Typography>
                    <Typography variant="caption" color="textSecondary">{adminUser.email}</Typography>
                  </Box>

                  <ListItemButton onClick={() => { navigate('/settings'); setOpen(false); }}>
                    <ListItemIcon><SettingsTwoToneIcon /></ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>

                  <ListItemButton onClick={() => { setPwdDialog(true); setOpen(false); }}>
                    <ListItemIcon><LockResetIcon /></ListItemIcon>
                    <ListItemText primary="Change Password" />
                  </ListItemButton>

                  <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><MeetingRoomTwoToneIcon color="error" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Change Password Dialog */}
      <Dialog open={pwdDialog} onClose={() => setPwdDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
        <form onSubmit={handleChangePassword}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              value={pwdForm.currentPassword}
              onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={pwdForm.newPassword}
              onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))}
              required
              fullWidth
              helperText="Minimum 6 characters"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPwdDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ background: '#00C853' }}>
              Change Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ProfileSection;
