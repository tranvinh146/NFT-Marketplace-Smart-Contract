import { ethers, network } from "hardhat";
import { NftMarketplace } from "../typechain-types";
import { BasicNft } from "../typechain-types/contracts/test";
import { moveBlocks } from "../utils/move-blocks";

const PRICE = ethers.utils.parseEther("1");

const mint = async () => {
    const basicNft: BasicNft = await ethers.getContract("BasicNft");

    console.log("Minting...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events![0].args!.tokenId;
    console.log(`Minted tokenId: ${tokenId} at address: ${basicNft.address}`);

    if (network.config.chainId == 31337) {
        const blockConfirms = 2;
        const blockTime = 1000;
        await moveBlocks(blockConfirms, blockTime);
    }
};

mint()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
