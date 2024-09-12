import React from "react";
import { Modal, Box, Typography, List, ListItem } from "@mui/material";

// NFTModal 컴포넌트 정의
const NFTModal = ({ isOpen, onClose, nftItems }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="nft-modal-title"
      aria-describedby="nft-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="nft-modal-title" variant="h6" component="h2" gutterBottom>
          {nftItems.length > 0 ? "Your NFTs" : "No NFTs Found"}
        </Typography>
        <List>
          {nftItems.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default NFTModal;
