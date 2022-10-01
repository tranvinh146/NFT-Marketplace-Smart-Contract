import fs from "fs";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const contractAddressesFile = "../nextjs-moralis-nft-marketplace/constants/networkMapping.json";
const frontendAbiFolderLocation = "../nextjs-moralis-nft-marketplace/constants";

const updateFrontend: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end...");
        await updateContractAddress(hre);
        await updateAbi(hre);
    }
};

async function updateAbi(hre: HardhatRuntimeEnvironment) {
    const { ethers } = hre;

    const nftMarketplace = await ethers.getContract("NftMarketplace");
    fs.writeFileSync(
        `${frontendAbiFolderLocation}/nftMarketplaceAbi.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
    );

    const basicNft = await ethers.getContract("BasicNft");
    fs.writeFileSync(
        `${frontendAbiFolderLocation}/basicNftAbi.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
    );
}

async function updateContractAddress(hre: HardhatRuntimeEnvironment) {
    const { ethers, network } = hre;
    const chainId = network.config.chainId?.toString();
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const contractAddresses = JSON.parse(fs.readFileSync(contractAddressesFile, "utf-8"));
    if (chainId! in contractAddresses) {
        if (!contractAddresses[chainId!]["nftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId!]["nftMarketplace"].push(nftMarketplace.address);
        }
    } else {
        contractAddresses[chainId!] = { nftMarketplace: [nftMarketplace.address] };
    }
    fs.writeFileSync(contractAddressesFile, JSON.stringify(contractAddresses));
}

updateFrontend.tags = ["all", "updatefrontend"];

export default updateFrontend;
