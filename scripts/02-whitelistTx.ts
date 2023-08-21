import { ethers } from "ethers";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe, {
  EthersAdapter,
  getSafeContract,
} from "@safe-global/protocol-kit";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
  RelayTransaction,
} from "@safe-global/safe-core-sdk-types";

import * as dotenv from "dotenv";

import { sessionKeyModuleAbi } from "./abis/sessionKeyModuleAbi";
import { counterAbi } from "./abis/counterAbi";

dotenv.config({ path: ".env" });



const ALCHEMY_ID = process.env.ALCHEMY_ID;
const RPC_URL = `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);

const SAFE_ADDRESS = process.env.SAFE_ADDRESS!;;
const chainId = 5;
const gelatoSafeModuleAddress = "0xEBF7dc15b153601DdA7594DC7bC42105c1E06844";
const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;


const moduleContract = new ethers.Contract(
  gelatoSafeModuleAddress,
  sessionKeyModuleAbi,
  provider
);

const gasLimit = "10000000";

async function relayTransaction() {
  // Create a transaction object
  const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress:SAFE_ADDRESS,
  });



  /// whitelist transaction
  const iface = new ethers.utils.Interface(counterAbi);
  const funcSig = iface.getSighash("increment()");

  const txSpec = {
    to: "0x87CA985c8F3e9b70bCCc25bb67Ae3e2F6f31F51C",
    selector: funcSig,
    hasValue: false,
    operation: 0,
  };

  const safeTransactionDataWhitlist: MetaTransactionData = {
    to: gelatoSafeModuleAddress,
    data: moduleContract.interface.encodeFunctionData("whitelistTransaction", [
      [txSpec],
    ]),
    value: "0",
    operation: OperationType.Call,
  };



  ///// RELAYING TRANSACTIONS
  const options: MetaTransactionOptions = {
    gasLimit,
    isSponsored: true,
  };

  const standardizedSafeTx = await relayKit.createRelayedTransaction(
    safeSDK,
    [safeTransactionDataWhitlist],
    options
  );

  const safeSingletonContract = await getSafeContract({
    ethAdapter: ethAdapter,
    safeVersion: await safeSDK.getContractVersion(),
  });

  const signedSafeTx = await safeSDK.signTransaction(standardizedSafeTx);

  const encodedTx = safeSingletonContract.encode("execTransaction", [
    signedSafeTx.data.to,
    signedSafeTx.data.value,
    signedSafeTx.data.data,
    signedSafeTx.data.operation,
    signedSafeTx.data.safeTxGas,
    signedSafeTx.data.baseGas,
    signedSafeTx.data.gasPrice,
    signedSafeTx.data.gasToken,
    signedSafeTx.data.refundReceiver,
    signedSafeTx.encodedSignatures(),
  ]);

  const relayTransaction: RelayTransaction = {
    target: SAFE_ADDRESS,
    encodedTransaction: encodedTx,
    chainId: chainId,
    options,
  };

  const response = await relayKit.relayTransaction(relayTransaction);
  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  );
}
relayTransaction();
