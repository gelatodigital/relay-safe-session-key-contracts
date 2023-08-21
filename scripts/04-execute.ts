import { ethers } from "ethers";

import * as dotenv from "dotenv";
import { sessionKeyModuleAbi } from "./abis/sessionKeyModuleAbi";
import { counterAbi } from "./abis/counterAbi";
import { CallWithERC2771Request, GelatoRelay } from "@gelatonetwork/relay-sdk";

dotenv.config({ path: ".env" });

//import ContractInfo from "../ABI.json";

const ALCHEMY_ID = process.env.ALCHEMY_ID;
const RPC_URL = `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet("0xd36e2d2f891d7ad7c24ec494c8af96f35f288de532b33e89361d9c487a26f661", provider);

const chainId = 5;
const targetAddress = "0xEBF7dc15b153601DdA7594DC7bC42105c1E06844";
const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;


const moduleContract = new ethers.Contract(
  targetAddress,
  sessionKeyModuleAbi,
  provider
);

const gasLimit = "10000000";

async function relayTransaction() {
  // Create a transaction object
  const relay = new GelatoRelay();


  /// whitelist transaction
  const iface = new ethers.utils.Interface(counterAbi);
  const funcSig = iface.getSighash("increment()");
  const data = iface.encodeFunctionData("increment",[])
  const tx = {
    to: "0x87CA985c8F3e9b70bCCc25bb67Ae3e2F6f31F51C",
    data,
    value: 0,
    operation: 0,
  };

  const sessionId = "From 03-create-Session logs"
  const tempPublic= "From 03-create-Session logs"
    // Populate a relay request
    const request: CallWithERC2771Request = {
      chainId,
      target: moduleContract.address,
      data: moduleContract.interface.encodeFunctionData("execute", [sessionId,[tx]]),
      user: tempPublic as string,
    };

  const response = await relay.sponsoredCallERC2771(
    request,
    signer,
    GELATO_RELAY_API_KEY as string
  );

  console.log(`https://relay.gelato.digital/tasks/status/${response.taskId}`);
}
relayTransaction();
