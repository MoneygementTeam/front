export const CONTRACT_ADDRESS =
    "729bc1f0ccadc8d641c62097a053f8a9c88268239a18d0d58d45bf3b15205e95";

export const mode = "dev";
export let NODE_URL;

if (mode == "dev") {
    NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
} else if (mode === "test") {
    NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
} else {
    NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
}
