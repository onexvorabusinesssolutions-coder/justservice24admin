import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Badge, Button, ClickAwayListener, Fade, Paper, Popper,
  List, ListItemButton, ListItemText, ListSubheader, Typography,
  Box, Chip, IconButton
} from '@mui/material';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PerfectScrollbar from 'react-perfect-scrollbar';
import api from 'config/api';

const NotificationSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const anchorRef = React.useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/admin/all');
      const data = res.data.data || [];
      setNotifications(data.slice(0, 20));
      setUnread(data.filter(n => !n.isRead).length);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => setOpen(prev => !prev);
  const handleClose = (e) => {
    if (anchorRef.current?.contains(e.target)) return;
    setOpen(false);
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const deleteNotif = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/admin/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  const typeColor = {
    new_user: '#00C853',
    new_business: '#1976d2',
    business_approved: '#00C853',
    business_rejected: '#ef4444',
    new_message: '#7c3aed',
    new_review: '#f57c00',
    admin_broadcast: '#0284c7',
  };

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={handleToggle}
        color="inherit"
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        aria-label="Notifications"
      >
        <Badge badgeContent={unread > 0 ? unread : null} color="error" max={99}>
          <NotificationsNoneTwoToneIcon sx={{ fontSize: '1.5rem' }} />
        </Badge>
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
                <List
                  sx={{
                    width: 360,
                    maxWidth: '100vw',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    pb: 0,
                    overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Notifications {unread > 0 && <Chip label={unread} size="small" color="error" sx={{ ml: 1, height: 20, fontSize: 11 }} />}
                    </Typography>
                    {unread > 0 && (
                      <IconButton size="small" onClick={markAllRead} title="Mark all read">
                        <DoneAllIcon fontSize="small" sx={{ color: '#00C853' }} />
                      </IconButton>
                    )}
                  </Box>

                  <PerfectScrollbar style={{ height: 360, overflowX: 'hidden' }}>
                    {notifications.length === 0 ? (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="textSecondary" variant="body2">No notifications</Typography>
                      </Box>
                    ) : (
                      <>
                        {notifications.some(n => !n.isRead) && (
                          <ListSubheader disableSticky sx={{ lineHeight: '28px', fontSize: 11, color: '#6b7280' }}>
                            NEW
                          </ListSubheader>
                        )}
                        {notifications.map(n => (
                          <ListItemButton
                            key={n._id}
                            alignItems="flex-start"
                            sx={{
                              py: 1.2,
                              px: 2,
                              background: n.isRead ? 'transparent' : '#f0fdf4',
                              borderLeft: n.isRead ? 'none' : `3px solid ${typeColor[n.type] || '#00C853'}`,
                              '&:hover': { background: '#f8fafc' },
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle2" fontWeight={n.isRead ? 500 : 700} noWrap sx={{ maxWidth: 240 }}>
                                  {n.icon} {n.title}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.3 }} noWrap>
                                {n.message}
                              </Typography>
                            </Box>
                          </ListItemButton>
                        ))}
                      </>
                    )}
                  </PerfectScrollbar>

                  {/* Footer */}
                  <Box sx={{ borderTop: '1px solid #f0f0f0', py: 1, textAlign: 'center' }}>
                    <Button size="small" sx={{ color: '#00C853', fontSize: 12 }} onClick={() => { setOpen(false); window.location.href = '/notifications'; }}>
                      View All Notifications
                    </Button>
                  </Box>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
