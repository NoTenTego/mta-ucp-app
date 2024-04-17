import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const Notification = forwardRef(({ type, title, desc }, ref) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleNotification = (type, title, desc) => {
    if (notifications.length >= 5) {
      setNotifications((prevNotifications) => prevNotifications.slice(1));
    }
  
    const exists = notifications.some((notification) => {
      return notification.desc === desc;
    });
  
    if (exists) {
      return;
    }
  
    const newNotification = {
      id: Date.now(),
      type,
      title,
      desc,
    };
  
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  useImperativeHandle(ref, () => ({
    handleNotification,
  }));

  return (
    <Stack sx={{ position: 'fixed', bottom: '16px', left: '16px', zIndex: '10000' }} spacing={1}>
      {notifications.map((notification) => (
        <Alert key={notification.id} variant='standard' severity={notification.type}>
          <AlertTitle>{notification.title}</AlertTitle>
          {notification.desc}
        </Alert>
      ))}
    </Stack>
  );
});

export default Notification;
