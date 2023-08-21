import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";


const func: DeployFunction = async () => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const gelatSafeModule = await deploy("GelatoSafeModule", {
    from: deployer,
    args: ["0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"],
  });

  const gelatSafeModulAddress = gelatSafeModule.address;

  console.log(gelatSafeModulAddress);
};

func.tags = ["GelatoSafeModule"];

export default func;
