import React, { useState, useEffect } from "react";
import { Modal, Paper, Typography, Button, List, Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 400,
  maxHeight: "80%",
  overflow: "hidden",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  backgroundColor: "transparent",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-100%",
    left: "-100%",
    right: "-100%",
    bottom: "-100%",
    background: `
      radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%),
      repeating-conic-gradient(
        from 0deg,
        rgba(255, 0, 0, 0.8) 0deg 10deg,
        rgba(255, 165, 0, 0.8) 10deg 20deg,
        rgba(255, 255, 0, 0.8) 20deg 30deg,
        rgba(0, 128, 0, 0.8) 30deg 40deg,
        rgba(0, 0, 255, 0.8) 40deg 50deg,
        rgba(75, 0, 130, 0.8) 50deg 60deg
      )
    `,
    backgroundSize: "200% 200%",
    animation: `${spin} 20s linear infinite`,
    opacity: 0.7,
    zIndex: -1,
  },
}));

const ContentContainer = styled(Box)({
  position: "relative",
  zIndex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: "10px",
  padding: "16px",
  color: "white",
});

const RankItem = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 128, 0.6)",
  color: "white",
  borderRadius: "10px",
  margin: "8px 0",
  padding: "12px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
}));

const RankCircle = styled(Box)(({ theme }) => ({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  backgroundColor: "white",
  color: "navy",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: "12px",
  fontWeight: "bold",
}));

const RankingModal = ({ isOpen, onClose, rankingData, userRank }) => {
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    const updateDisplayCount = () => {
      const height = window.innerHeight;
      setDisplayCount(height < 600 ? 3 : 5);
    };

    updateDisplayCount();
    window.addEventListener("resize", updateDisplayCount);
    return () => window.removeEventListener("resize", updateDisplayCount);
  }, []);

  const topRanks = rankingData.slice(0, displayCount);
  const showUserRank = userRank > displayCount;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <StyledPaper>
        <ContentContainer>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            style={{ color: "white" }}
          >
            랭킹
          </Typography>
          <List>
            {topRanks.map((item) => (
              <RankItem key={item.rank}>
                <RankCircle>{item.rank}</RankCircle>
                <Box>
                  <Typography variant="subtitle1">{item.nickname}</Typography>
                  <Typography variant="body2">
                    {item.amount.toLocaleString()}원
                  </Typography>
                </Box>
              </RankItem>
            ))}
          </List>
          {showUserRank && (
            <RankItem>
              <RankCircle>{userRank}</RankCircle>
              <Box>
                <Typography variant="subtitle1">
                  {rankingData[userRank - 1].nickname} (나)
                </Typography>
                <Typography variant="body2">
                  {rankingData[userRank - 1].amount.toLocaleString()}원
                </Typography>
              </Box>
            </RankItem>
          )}
          <Button
            variant="contained"
            onClick={onClose}
            style={{
              marginTop: 16,
              backgroundColor: "rgba(0, 0, 128, 0.8)",
              color: "white",
            }}
          >
            닫기
          </Button>
        </ContentContainer>
      </StyledPaper>
    </Modal>
  );
};

export default RankingModal;
