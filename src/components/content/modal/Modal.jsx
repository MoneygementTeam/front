import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { useRecoilState } from "recoil";
import { IsModalOpenAtom } from "../../../store/ModalAtom";

const CustomModal = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenAtom);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  setIsModalOpen(true);

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Paper
        elevation={2}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          zIndex: 99999,
          maxWidth: "100%",
          maxHeight: "90%",
          overflowY: "auto",
        }}
      >
        {children}
      </Paper>
    </Modal>
  );
};

export default CustomModal;
