import { ethers } from "ethers";
import { SBD__factory } from "../types/ethers-contracts/factories/SBD__factory";
import { SBD } from "../types/ethers-contracts/SBD";

export default function contractSetup(address : string) : SBD {
  const provider = ethers.providers.getDefaultProvider(
    "goerli", 
    {
      etherscan: "P2PVFYSEXPBA4A9NZP4DBEJV1C53HAK83H",
      infura: "2bbee4e3b0b3410dac5e8e061d56266d"
    }
  );

  const contract : SBD = SBD__factory.connect(address, provider);
  return contract;
}