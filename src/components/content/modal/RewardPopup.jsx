import React, { useEffect } from 'react';
import { Modal, Paper, Typography, Box } from '@mui/material';
import { keyframes } from '@mui/system';

const shineAnimation = keyframes`
  0% { box-shadow: 0 0 10px 0px #4caf50; }
  50% { box-shadow: 0 0 20px 10px #4caf50; }
  100% { box-shadow: 0 0 10px 0px #4caf50; }
`;

const RewardPopup = ({ isOpen, onClose, title, subTitle }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="reward-popup-title"
      aria-describedby="reward-popup-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1400,  // CustomModal보다 높은 z-index
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          opacity: 1,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <Typography id="reward-popup-title" variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography id="reward-popup-description" variant="h5" sx={{ mt: 2 }}>
          {subTitle}
        </Typography>
        <Box
          sx={{
            width: 100,
            height: 100,
            margin: '20px auto',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: `${shineAnimation} 2s infinite`,
          }}
        />
      </Paper>
    </Modal>
  );
};

export default RewardPopup;