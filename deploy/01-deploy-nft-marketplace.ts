import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const nftMarketplaceDeploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, network, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const deployer = (await getNamedAccounts()).deployer;
    const chainId = networkConfig[network.config.chainId!];

    const args: any = [];

    log("-------------------------------------------");
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: chainId.blockConfirmations || 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(nftMarketplace.address, args);
    }
    log("-------------------------------------------");
};

nftMarketplaceDeploy.tags = ["all", "nftmarketplace"];

export default nftMarketplaceDeploy;
