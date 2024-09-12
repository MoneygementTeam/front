export const CONTRACT_ADDRESS =
    "58986c8f6dc06ee743ab57c516ed89489383f2cbf54e2dac62755b6dbfb7dda9";

export const mode = "dev";
export let NODE_URL;

if (mode == "dev") {
    NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
} else if (mode === "test") {
    NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
} else {
    NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
}
