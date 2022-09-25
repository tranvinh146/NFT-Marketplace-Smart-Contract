import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const config: HardhatUserConfig = {
    solidity: "0.8.17",
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
