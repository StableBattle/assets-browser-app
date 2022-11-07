import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { SBD__factory } from "../types/ethers-contracts/factories/SBD__factory";
import { SBD } from "../types/ethers-contracts/SBD";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default async function fetchEvents(address : string) {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "u1LsOL2DBC0PEV91z2RV2lXpxdiwPAnq");
//const etherscanProvider = new ethers.providers.EtherscanProvider("goerli", "P2PVFYSEXPBA4A9NZP4DBEJV1C53HAK83H")
  const SDBAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";

  const contract : SBD = SBD__factory.connect(address, alchemyProvider);

  const evtsSingle : TransferSingleEvent[] =
    (await contract.queryFilter(contract.filters.TransferSingle()));
  const evtsBatch : TransferBatchEvent[] =
    (await contract.queryFilter(contract.filters.TransferBatch()));
  const evtsWins : NewWinnerEvent[] =
    (await contract.queryFilter(contract.filters.NewWinner()));
  const evtsClaims : RewardClaimedEvent[] =
    (await contract.queryFilter(contract.filters.RewardClaimed()));
  return { evtsSingle, evtsBatch, evtsWins, evtsClaims }
}
