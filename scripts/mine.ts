import { moveBlocks } from "../utils/move-blocks";

const mineBlock = async () => {
    const blocks = 2;
    const sleepAmount = 1000; // ms
    await moveBlocks(blocks, sleepAmount);
};

mineBlock()
    .then(() => (process.exitCode = 0))
    .catch((e) => {
        console.log(e);
        process.exitCode = 1;
    });
