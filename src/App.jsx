import { RecoilRoot } from "recoil";
import "./App.css";
import { ClientSocketControls } from "./components/utilComponents/ClientSocketControls";
import { Content } from "./components/content/Content";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import CustomModal from "./components/content/modal/Modal";
function App() {
  return (
    <RecoilRoot>
      <Content />
      <ClientSocketControls />

      {/* <CustomModal>
        <Box>
          <Typography variant="h6" component="h2">
            hi
          </Typography>
          <Typography sx={{ mt: 2 }}>it's me</Typography>
        </Box>
      </CustomModal> */}
    </RecoilRoot>
  );
}

export default App;
