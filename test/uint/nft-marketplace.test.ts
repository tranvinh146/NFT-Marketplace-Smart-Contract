import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { NftMarketplace } from "../../typechain-types";
import { BasicNft } from "../../typechain-types/contracts/test";

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Marketplace Unit Test", async () => {
          let basicNft: BasicNft;
          let nftMarketplace: NftMarketplace;
          let deployer: string;
          let user: string;
          const TOKEN_ID = 0;
          const PRICE = ethers.utils.parseEther("1");

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              user = (await getNamedAccounts()).user;

              await deployments.fixture(["all"]);

              basicNft = await ethers.getContract("BasicNft", deployer);
              nftMarketplace = await ethers.getContract("NftMarketplace", deployer);

              await basicNft.mintNft();
          });

          describe("Basic NFT", () => {
              it("should initialize correctly", async () => {
                  const tokenCounter = await basicNft.getTokenCounter();
                  const expectedTokenCounter = 1;
                  const tokenURI = await basicNft.tokenURI(TOKEN_ID);
                  const expectedTokenURI =
                      "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
                  assert.equal(tokenCounter.toNumber(), expectedTokenCounter);
                  assert.equal(tokenURI, expectedTokenURI);
              });
          });

          describe("listItem", () => {
              it("revert if price is equal zero", async () => {
                  const zeroPrice = 0;
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, zeroPrice)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__PriceMustBeAboveZero"
                  );
              });

              it("revert if marketplace is not approved", async () => {
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NotApprovedForMarketplace"
                  );
              });

              it("should list item on marketplace", async () => {
                  await basicNft.approve(nftMarketplace.address, TOKEN_ID);
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);

                  assert.equal(listing.price.toString(), PRICE.toString());
                  assert.equal(listing.seller, deployer);
              });

              it("should emit event when listing item on marketplace", async () => {
                  await basicNft.approve(nftMarketplace.address, TOKEN_ID);
                  await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE))
                      .to.be.emit(nftMarketplace, "ItemListed")
                      .withArgs(deployer, basicNft.address, TOKEN_ID, PRICE);
              });
          });

          describe("buyItem", () => {
              beforeEach(async () => {
                  await basicNft.approve(nftMarketplace.address, TOKEN_ID);
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
              });

              it("revert if NFT is not listed", async () => {
                  await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID + 1))
                      .to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotListed")
                      .withArgs(basicNft.address, TOKEN_ID + 1);
              });

              it("revert if deposit is less than price", async () => {
                  await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID))
                      .to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__PriceNotMet")
                      .withArgs(basicNft.address, TOKEN_ID, PRICE);
              });

              it("should increase proceeds of seller", async () => {
                  nftMarketplace.connect(user);
                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE });
                  const proceedsOfSeller = await nftMarketplace.getProceeds(deployer);
                  assert.equal(proceedsOfSeller.toString(), PRICE.toString());
              });

              it("should delete item's listing", async () => {
                  nftMarketplace.connect(user);
                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE });
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
                  assert.equal(listing.price.toNumber(), 0);
              });

              it("should emit event when buy item successfully", async () => {
                  await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE }))
                      .to.be.emit(nftMarketplace, "ItemBought")
                      .withArgs(deployer, basicNft.address, TOKEN_ID, PRICE);
              });
          });
      });
