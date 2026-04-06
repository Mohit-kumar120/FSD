import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotification, clearNotification } from '../../features/cart/cartSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => dispatch(clearNotification()), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  return (
    <Snackbar
      open={!!notification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={() => dispatch(clearNotification())}
    >
      {notification && (
        <Alert
          severity={notification.type}
          onClose={() => dispatch(clearNotification())}
          sx={{
            borderRadius: '14px',
            background:
              notification.type === 'success' ? 'rgba(16,185,129,0.9)' :
              notification.type === 'error' ? 'rgba(239,68,68,0.9)' :
              notification.type === 'warning' ? 'rgba(245,158,11,0.9)' :
              'rgba(99,102,241,0.9)',
            color: '#fff',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            '& .MuiAlert-icon': { color: '#fff' },
            '& .MuiAlert-action .MuiIconButton-root': { color: '#fff' },
          }}
        >
          {notification.message}
        </Alert>
      )}
    </Snackbar>
  );
};

export default Notification;
