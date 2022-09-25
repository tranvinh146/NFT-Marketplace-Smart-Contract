export interface networkConfigItem {
    name?: string;
    blockConfirmations?: number;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        blockConfirmations: 1,
    },
    4: {
        name: "rinkeby",
        blockConfirmations: 6,
    },
    5: {
        name: "goerli",
        blockConfirmations: 6,
    },
};

export const developmentChains = ["hardhat", "localhost"];
