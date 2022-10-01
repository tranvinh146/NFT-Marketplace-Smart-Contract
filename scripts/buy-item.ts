import { ethers, network } from "hardhat";
import { BasicNft, NftMarketplace } from "../typechain-types";
import { moveBlocks } from "../utils/move-blocks";

const buyItem = async () => {
    const basicNft: BasicNft = await ethers.getContract("BasicNft");
    const nftMarketplace: NftMarketplace = await ethers.getContract("NftMarketplace");
    const tokenId = (await basicNft.getTokenCounter()).sub(1);
    const tokenUri = await basicNft.tokenURI(0);
    console.log(tokenUri);
    // console.log("Buying Item...");
    // const listing = await nftMarketplace.getListing(basicNft.address, tokenId);
    // const tx = await nftMarketplace.buyItem(basicNft.address, tokenId, {
    //     value: listing.price,
    //     gasLimit: 100000,
    // });
    // await tx.wait(1);
    // console.log("Bought Item");

    // if (network.config.chainId == 31337) {
    //     const blockConfirms = 2;
    //     const blockTime = 1000;
    //     await moveBlocks(blockConfirms, blockTime);
    // }
};

buyItem()
    .then(() => (process.exitCode = 0))
    .catch((e: any) => {
        console.error(e);
        process.exitCode = 1;
    });
