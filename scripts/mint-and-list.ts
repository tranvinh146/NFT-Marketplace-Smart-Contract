import { ethers, network } from "hardhat";
import { NftMarketplace } from "../typechain-types";
import { BasicNft } from "../typechain-types/contracts/test";
import { moveBlocks } from "../utils/move-blocks";

const PRICE = ethers.utils.parseEther("1");

const mintAndList = async () => {
    const basicNft: BasicNft = await ethers.getContract("BasicNft");
    const nftMarketplace: NftMarketplace = await ethers.getContract("NftMarketplace");

    console.log("Minting...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events![0].args!.tokenId;

    console.log("Approving NFT...");
    const approveTx = await basicNft.approve(nftMarketplace.address, tokenId);
    await approveTx.wait(1);

    console.log("Listing Item...");
    const listTx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
    await listTx.wait(1);
    console.log("Listed");

    if (network.config.chainId == 31337) {
        const blockConfirms = 2;
        const blockTime = 1000;
        await moveBlocks(blockConfirms, blockTime);
    }
};

mintAndList()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
