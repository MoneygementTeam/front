import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useModalStore } from "../../../store/ModalStore.js";
import { usePlayersStore } from "../../../store/PlayersStore.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grow } from "@mui/material";
import InvestmentResultDisplay from "./InvestmentResultDisplay";

import financialTerms from "../../../assets/financialTerms.json";
import financialCrisisScenarios from "../../../assets/financialCrisisScenarios.json";

import { processApiResponse } from "./utils"; // 위에서 만든 함수를 import
import axios from "axios";

import { API_SERVER } from "../../../client/RequestQueryClient.js";

import { getSession } from "../../../store/SessionStore.js";

import { toast } from "react-toastify";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CONTRACT_ADDRESS, mode, NODE_URL } from "../aptos/Aptos.js";
import { Network } from "@aptos-labs/ts-sdk";
import { createCard } from "../aptos/aptosClient.js";

const api = axios.create({
  baseURL: API_SERVER,
  withCredentials: false, // 필요한 경우 (쿠키를 포함해야 하는 경우)
});

// 자연 테마 정의
const natureTheme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // 초록색
    },
    secondary: {
      main: "#795548", // 나무색
    },
    background: {
      default: "#f1f8e9", // 연한 초록색
      paper: "#ffffff", // 흰색
    },
    text: {
      primary: "#212121", // 검은색
      secondary: "#4caf50", // 초록색
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

// 시나리오 텍스트를 파싱하는 함수
const parseScenario = (scenarioText) => {
  return scenarioText
    .split("\n\n")
    .filter((paragraph) => paragraph.trim() !== "");
};

const CustomModal = ({
  title,
  page,
  investmentOptions,
  Money: initialMoney,
  onInvestmentDecision,
}) => {
  const { setIsQuizModalOpen, isQuizModalOpen, asset } = useModalStore();
  const {playerCompletedQuests, setPlayerCompletedQuests} = usePlayersStore();
  const [currentPage, setCurrentPage] = useState(page);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentStoryPage, setCurrentStoryPage] = useState(0);
  const [investmentPercentage, setInvestmentPercentage] = useState(0);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [money, setMoney] = useState(initialMoney);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isTermPopupOpen, setIsTermPopupOpen] = useState(false);
  const [currentTerm, setCurrentTerm] = useState("");
  const [investmentResult, setInvestmentResult] = useState(null);
  const [scenarioData, setScenarioData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useWallet();

  useEffect(() => {
    const fetchScenarioData = async () => {
      try {
        const response = await api.get("/api/theme/");
        const processedData = processApiResponse(response.data);
        setScenarioData(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching scenario data:", error);
        setIsLoading(false);
      }
    };

    fetchScenarioData();
  }, []);

  const closeModal = () => {
    setIsQuizModalOpen(false);
    setCurrentPage(1);
    setCurrentScenario(null);
    setCurrentStoryPage(0);
    setSelectedInvestment(null);
    setInvestmentPercentage(0);
    setInvestmentResult(null);
  };

  //setIsQuizModalOpen(true);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (newPage === 1) {
      setCurrentScenario(null);
      setCurrentStoryPage(0);
      setSelectedInvestment(null);
      setInvestmentPercentage(0);
    }
  };

  const handleScenarioSelect = (scenario) => {
    setCurrentScenario(scenario);
    setCurrentPage(2);
    setCurrentStoryPage(0);
  };

  const handleStoryNavigation = (direction) => {
    if (!scenarioData[currentScenario]) return;

    const scenarioContent = scenarioData[currentScenario].content;
    const parsedScenario = parseScenario(scenarioContent);

    if (direction === "next") {
      if (currentStoryPage < parsedScenario.length - 1) {
        setCurrentStoryPage(currentStoryPage + 1);
      } else {
        handlePageChange(3);
      }
    } else if (direction === "prev") {
      if (currentStoryPage > 0) {
        setCurrentStoryPage(currentStoryPage - 1);
      } else {
        handlePageChange(1);
      }
    }
  };

  const handleInvestmentSelect = (investment) => {
    setSelectedInvestment(investment);
    handlePageChange(4);
  };

  const handleSliderChange = (event, newValue) => {
    setInvestmentPercentage(newValue);
  };

  const nft_minting = async () => {
    const account_address = wallet.account?.address?.toString();

    console.log("account_address ::" + account_address);
    if (account_address === undefined) {
      await timeout(3000);
      alert("로그인 후 이용해주세요.");
      console.log("account_address undefined");
    }

    const quantity = parseInt(1);
    try {
      const txHash = await wallet.signAndSubmitTransaction({
        sender: account_address,
        data: {
          function: `${CONTRACT_ADDRESS}::minting::mint_nft`,
          typeArguments: [],
          functionArguments: [quantity],
        },
      });
      await createCard({
        userId: JSON.parse(window.localStorage.getItem('userInfo')).userId,
        nftId: txHash.hash,
        cardUrl: txHash.output.changes[11].data.data.token_uri,
      });

      alert("nft 을 획득하였습니다");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInvestmentDecision = () => {
    const investedAmount = Math.round((money * investmentPercentage) / 100);
    if (selectedInvestment === "부동산" && investedAmount < 100000) {
      setAlertMessage("최소 금액이 100000원 입니다!");
      setIsAlertOpen(true);
    } else {
      const returnRateString =
        scenarioData[currentScenario].투자수익률[selectedInvestment];
      const returnRate = parseFloat(returnRateString.replace("%", "")) / 100;
      const resultAmount = Math.round(investedAmount * (1 + returnRate));
      const profit = resultAmount - investedAmount;

      setInvestmentResult({
        investedAmount,
        resultAmount,
        profit,
        returnRate,
      });

      setMoney(money - investedAmount + resultAmount);

      if (selectedInvestment === "부동산" && investedAmount >= 300000) {
          if (!playerCompletedQuests.includes("houseInvestment")) {
              nft_minting();
          }
      }

      handlePageChange(5);
    }
  };

  const handleTermClick = (term) => {
    setCurrentTerm(term);
    setIsTermPopupOpen(true);
  };

  // 금융 용어를 인식하는 함수 (개선된 버전)
  const highlightFinancialTerms = (text) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, "");
      const term = Object.keys(financialTerms).find((term) =>
        cleanWord.startsWith(term)
      );
      if (term) {
        return (
          <span
            key={index}
            style={{
              color: natureTheme.palette.primary.main,
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => handleTermClick(term)}
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 2:
        return currentScenario;
      case 3:
        return "투자 종목 선택";
      case 4:
        return `${selectedInvestment} 투자`;
      case 5:
        return "투자 결과";
      default:
        return title;
    }
  };

  const renderPageContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    switch (currentPage) {
      case 1:
        return (
          <Grid container spacing={2}>
            {Object.entries(scenarioData).map(([key, scenario], index) => (
              <Grid item xs={6} key={index}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleScenarioSelect(key)}
                  sx={{
                    fontSize: "18px",
                    padding: "15px",
                    height: "100px",
                    whiteSpace: "normal",
                    lineHeight: 1.2,
                    backgroundColor: natureTheme.palette.secondary.main,
                    color: natureTheme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: natureTheme.palette.secondary.dark,
                    },
                  }}
                >
                  {scenario.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        if (!scenarioData[currentScenario]) return null;
        const scenarioContent = scenarioData[currentScenario].content;
        const parsedScenario = parseScenario(scenarioContent);
        return (
          <>
            <Box flexGrow={1} overflow="auto" mb={2}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "18pt",
                  color: natureTheme.palette.text.primary,
                }}
              >
                {highlightFinancialTerms(parsedScenario[currentStoryPage])}
              </Typography>
            </Box>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => handleStoryNavigation("prev")}
                  sx={{
                    fontSize: "18px",
                    padding: "10px 20px",
                    backgroundColor: natureTheme.palette.secondary.main,
                    color: natureTheme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: natureTheme.palette.secondary.dark,
                    },
                  }}
                >
                  이전
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => handleStoryNavigation("next")}
                  sx={{
                    fontSize: "18px",
                    padding: "10px 20px",
                    backgroundColor: natureTheme.palette.secondary.main,
                    color: natureTheme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: natureTheme.palette.secondary.dark,
                    },
                  }}
                >
                  {currentStoryPage === parsedScenario.length - 1
                    ? "투자 선택"
                    : "다음"}
                </Button>
              </Grid>
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            <Box flexGrow={1} overflow="auto" mb={2}>
              <Grid container spacing={2}>
                {investmentOptions.map((option, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleInvestmentSelect(option)}
                      sx={{
                        fontSize: "20px",
                        padding: "15px",
                        backgroundColor: natureTheme.palette.primary.main,
                        color: natureTheme.palette.background.paper,
                        "&:hover": {
                          backgroundColor: natureTheme.palette.primary.dark,
                        },
                      }}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Button
              variant="contained"
              onClick={() => handlePageChange(2)}
              sx={{
                fontSize: "18px",
                padding: "10px 20px",
                backgroundColor: natureTheme.palette.secondary.main,
                color: natureTheme.palette.background.paper,
                "&:hover": {
                  backgroundColor: natureTheme.palette.secondary.dark,
                },
              }}
            >
              이전
            </Button>
          </>
        );
      case 4:
        return (
          <>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              mb={2}
            >
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: natureTheme.palette.text.primary,
                }}
              >
                {Math.round(
                  (money * investmentPercentage) / 100
                ).toLocaleString()}{" "}
                원
              </Typography>
              <Slider
                value={investmentPercentage}
                onChange={handleSliderChange}
                aria-labelledby="investment-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100}
                sx={{
                  color: natureTheme.palette.primary.main,
                  "& .MuiSlider-thumb": {
                    backgroundColor: natureTheme.palette.primary.main,
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: natureTheme.palette.primary.light,
                  },
                }}
              />
            </Box>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => handlePageChange(3)}
                  sx={{
                    fontSize: "18px",
                    padding: "10px 20px",
                    backgroundColor: natureTheme.palette.secondary.main,
                    color: natureTheme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: natureTheme.palette.secondary.dark,
                    },
                  }}
                >
                  이전
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleInvestmentDecision}
                  sx={{
                    fontSize: "18px",
                    padding: "10px 20px",
                    backgroundColor: natureTheme.palette.primary.main,
                    color: natureTheme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: natureTheme.palette.primary.dark,
                    },
                  }}
                >
                  투자 결정
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={closeModal}
                  sx={{
                    fontSize: "18px",
                    padding: "10px 20px",
                    backgroundColor: natureTheme.palette.error.main,
                    color: natureTheme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: natureTheme.palette.error.dark,
                    },
                  }}
                >
                  취소
                </Button>
              </Grid>
            </Grid>
          </>
        );
      case 5:
        return (
          <>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              mb={2}
            >
              <InvestmentResultDisplay
                investmentResult={investmentResult}
                investmentPercentage={investmentPercentage}
              />
            </Box>
            <Button
              variant="contained"
              onClick={closeModal}
              sx={{
                fontSize: "18px",
                padding: "10px 20px",
                backgroundColor: natureTheme.palette.primary.main,
                color: natureTheme.palette.background.paper,
                "&:hover": {
                  backgroundColor: natureTheme.palette.primary.dark,
                },
              }}
            >
              닫기
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={natureTheme}>
      <Modal
        open={isQuizModalOpen}
        onClose={closeModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grow in={isQuizModalOpen}>
          <Paper
            elevation={3}
            sx={{
              width: "90%",
              height: "90%",
              maxWidth: "800px",
              maxHeight: "600px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              bgcolor: "background.paper",
              borderRadius: "40px",
              boxShadow: 24,
              // transform 속성 제거
            }}
          >
            <Box bgcolor="primary.main" color="background.paper" p={2}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                {getPageTitle()}
              </Typography>
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              p={3}
              overflow="hidden"
            >
              {renderPageContent()}
            </Box>
          </Paper>
        </Grow>
      </Modal>

      <Dialog
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: natureTheme.palette.background.paper,
            color: natureTheme.palette.text.primary,
          },
        }}
      >
        <DialogTitle>{"알림"}</DialogTitle>
        <DialogContent>
          <DialogContentText color="textPrimary">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsAlertOpen(false)}
            color="primary"
            autoFocus
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isTermPopupOpen}
        onClose={() => setIsTermPopupOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: natureTheme.palette.background.paper,
            color: natureTheme.palette.text.primary,
          },
        }}
      >
        <DialogTitle>{currentTerm}</DialogTitle>
        <DialogContent>
          <DialogContentText color="textPrimary">
            {financialTerms[currentTerm]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsTermPopupOpen(false)}
            color="primary"
            autoFocus
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CustomModal;
