# Gelato Safe Module Session Key 

This project demonstrates the implementation of a Gelato Safe module to enable Safe signless Ux.

<img src="docs/flow.png" width="400">

The most important files to look at are:

- Gelato Safe Module [GelatoSafeModule.sol](/contracts/GelatoSafeModule.sol)
- Counter Contract [Counter.sol](/contracts/Counter.sol)
- TempKey class used to generate/store the Session Keys [TempKey](/scripts/tempKey.ts)


> **Note**  
> The Gelato Safe module is deployed on Goerli at [0xEBF7dc15b153601DdA7594DC7bC42105c1E06844](https://goerli.etherscan.io/address/0xEBF7dc15b153601DdA7594DC7bC42105c1E06844#code) and the counter contract at [0x87CA985c8F3e9b70bCCc25bb67Ae3e2F6f31F51C](https://goerli.etherscan.io/address/0x87CA985c8F3e9b70bCCc25bb67Ae3e2F6f31F51C)

## Quick Start

Please copy .env.example to .env and add GELATO_RELAY_API_KEY, PK, ALCHEMY_ID and ETHERSCAN_API_KEY  if you want to verify the contracts and your SAFE_ADDRESS

1. Install dependencies
   ```
   yarn install
   ```
2. Compile smart contracts
   ```
   yarn  compile
   ```
   
3. Testing in Goerli Testnet
   
   a) Enable Gelato Safe Module Module
   ```
   npx hardhat runs scripts/01-enableModule.ts
   ```

   b)Whitelist Transaction
   ```
   npx hardhat runs scripts/02-whitelistTx.ts
   ```

   c)Create Session
   ```
   npx hardhat runs scripts/03-createSession.ts
   ```

   d) Execute the transaction
   
   Copy from the previous logs the sessionId and the temPublic in [here](/scripts/04-execute.ts#L62)

   ```
   npx hardhat runs scripts/04-execute.ts
   ```

   e) Multisend (a,b,c) together
   
   ```
   npx hardhat runs scripts/05-multiSend.ts
   ```