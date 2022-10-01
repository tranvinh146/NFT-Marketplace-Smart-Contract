import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL || "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
        },
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY || "",
        },
    },
    namedAccounts: {
        deployer: {
            // chainId: nth of accounts
            default: 0,
            1: 1,
        },
        user: {
            // chainId: nth of accounts
            default: 1,
            1: 2,
        },
    },
};

export default config;
