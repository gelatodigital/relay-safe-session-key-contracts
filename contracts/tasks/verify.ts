import { task } from "hardhat/config";

export const verify = task("etherscan-verify", "verify").setAction(
  async ({}, hre) => {
    await hre.run("verify:verify", {
      address: "0xEBF7dc15b153601DdA7594DC7bC42105c1E06844",
      constructorArguments: [
        "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"
      ],
    });
  }
);
