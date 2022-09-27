import { ethers, network } from "hardhat";
import { BasicNft, NftMarketplace } from "../typechain-types";
import { moveBlocks } from "../utils/move-blocks";

const cancelItem = async () => {
    const basicNft: BasicNft = await ethers.getContract("BasicNft");
    const nftMarketplace: NftMarketplace = await ethers.getContract("NftMarketplace");
    const tokenCounter = await basicNft.getTokenCounter();

    console.log("Canceling Item...");
    const tx = await nftMarketplace.cancelItem(basicNft.address, tokenCounter.sub(1), {
        gasLimit: 100000,
    });
    await tx.wait(1);
    console.log("Canceled Item");

    if (network.config.chainId == 31337) {
        const blockConfirms = 2;
        const blockTime = 1000;
        await moveBlocks(blockConfirms, blockTime);
    }
};

cancelItem()
    .then(() => {
        process.exitCode = 0;
    })
    .catch((e: any) => {
        console.error(e);
        process.exitCode = 1;
    });
