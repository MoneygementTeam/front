import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Modal } from "@mui/material";
import styles from "./style/Aptos.module.css";

const ConnectWalletModal = (props) => {
    const { show, onConnect, callback } = props;
    const wallet = useWallet();
    return (
        <Modal
            open={show}
            onClose={() => {}}
            sx={{
                position: "fixed",
                zIndex: 1300,
                width: "50%",
                height: "50%",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                padding: 2,
                borderRadius: 2,
            }}
        >
            <div>
                {wallet?.wallets?.length > 0 ? (
                    wallet.wallets.map((walletType) => {
                        return (
                            <button
                                key={walletType.name}
                                className={styles.walletAdapterOption}
                                onClick={async () => {
                                    onConnect(walletType.name);
                                    await wallet.connect(walletType.name);
                                    console.log("Connect clicked");
                                    callback();
                                }}
                            >
                                <img src={walletType.icon} alt={walletType.name} />
                                <h6 className="mb-0">{walletType.name}</h6>
                            </button>
                        );
                    })
                ) : (
                    <p>No wallets available</p>
                )}
            </div>
        </Modal>
    );
};

export default ConnectWalletModal;
