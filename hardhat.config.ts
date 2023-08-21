import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";



import { resolve} from 'path';
import * as glob from 'glob';

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });


const PK = process.env.PK;
const ALCHEMY_ID = process.env.ALCHEMY_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

glob.sync('./tasks/**/*.ts').forEach(function (file: any) {
  require(resolve(file));
});

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  defaultNetwork:"goerli",
  networks: {
  
    hardhat: {
      forking: {
        url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_ID}`,
      },
      chainId: 5,
    },
    goerli: {
      accounts: PK ? [PK] : [],
      chainId: 5,
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "",
    },
  },
};

export default config;
