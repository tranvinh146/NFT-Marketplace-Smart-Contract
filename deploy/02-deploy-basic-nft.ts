import verify from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

const basicNftDeploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, network, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId!;

    const args: any = [];

    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(basicNft.address, args);
    }
    log("-------------------------------------------");
};

basicNftDeploy.tags = ["all", "basicnft"];

export default basicNftDeploy;
