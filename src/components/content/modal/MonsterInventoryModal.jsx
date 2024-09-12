import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import './MonsterInventoryModal.css';
import CloseButton from '../button/CloseButton';
import MonsterCard from './MonsterCard';

const MonsterInventoryModal = ({ isOpen, onClose, monsterInventoryData }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="modal-container">
        <Typography variant="h4" align="center" style={{ color: 'white' }}>
          Monster Inventory
        </Typography>

        <Box className="inventory-grid">
          {monsterInventoryData.map((monster, index) => (
            <Box key={index} className="inventory-card">
              <MonsterCard monster={monster} cardIndex={index} />
              <Typography variant="subtitle1" className="card-title">
                NFT ID: {monster.nftId}
              </Typography>
            </Box>
          ))}
        </Box>

        <CloseButton onClick={onClose} />
      </Box>
    </Modal>
  );
};

export default MonsterInventoryModal;
