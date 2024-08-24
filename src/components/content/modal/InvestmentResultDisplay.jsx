import React from 'react';
import { Typography, Box } from '@mui/material';

const InvestmentResultDisplay = ({ investmentResult, investmentPercentage }) => {
  const { investedAmount, resultAmount, profit, returnRate } = investmentResult;
  
  const getProfitColor = (profit) => {
    return profit > 0 ? 'success.main' : profit < 0 ? 'error.main' : 'text.primary';
  };

  const getInvestmentComment = (percentage) => {
    if (percentage >= 50) return "공격적인 투자였습니다.";
    if (percentage >= 20) return "적절한 투자규모입니다.";
    return "소극적인 투자군요.";
  };

  const getProfitComment = (returnRate) => {
    if (returnRate >= 0.5) return "축하합니다. 큰 수익을 얻었습니다!";
    if (returnRate > 0) return "좋습니다. 수익을 얻었네요.";
    if (returnRate === 0) return "다행이네요. 원금을 지켜냈습니다.";
    if (returnRate > -0.3) return "저런, 다음에 복구해 봅시다.";
    return "경제 공부가 더 필요할 것 같습니다.";
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "20px" }}>
        투자 결과
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "10px" }}>
        투자 금액: {investedAmount.toLocaleString()}원
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "10px" }}>
        수익률: {(returnRate * 100).toFixed(2)}%
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "10px" }}>
        최종 금액: {resultAmount.toLocaleString()}원
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ 
          textAlign: "center", 
          marginBottom: "20px",
          color: getProfitColor(profit)
        }}
      >
        손익: {profit > 0 ? '+' : ''}{profit.toLocaleString()}원
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center", marginBottom: "10px" }}>
        {getInvestmentComment(investmentPercentage)}
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        {getProfitComment(returnRate)}
      </Typography>
    </Box>
  );
};

export default InvestmentResultDisplay;