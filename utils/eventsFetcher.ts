import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { SBD__factory } from "../types/ethers-contracts/factories/SBD__factory";
import { SBD } from "../types/ethers-contracts/SBD";
import { ethers } from "ethers";
export default async function fetchEvents(address : string) {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
  const etherscanProvider = new ethers.providers.EtherscanProvider("goerli", process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY);
  const infuraProvider = new ethers.providers.InfuraProvider("goerli", process.env.NEXT_PUBLIC_INFURA_API_KEY);

  const contract : SBD = SBD__factory.connect(address, etherscanProvider);

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
