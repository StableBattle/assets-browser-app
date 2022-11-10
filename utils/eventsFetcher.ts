import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { SBD__factory } from "../types/ethers-contracts/factories/SBD__factory";
import { SBD } from "../types/ethers-contracts/SBD";
import { ethers, providers } from "ethers";
import { UrlJsonRpcProvider } from "@ethersproject/providers";

export interface TypedEventsTuple {
  evtsSingle: TransferSingleEvent[];
  evtsBatch: TransferBatchEvent[];
  evtsWins: NewWinnerEvent[];
  evtsClaims: RewardClaimedEvent[];
}

export function contractSetup(address: string) : {contract: SBD, provider: UrlJsonRpcProvider } {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "u1LsOL2DBC0PEV91z2RV2lXpxdiwPAnq");
  const etherscanProvider = new ethers.providers.EtherscanProvider("goerli", process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY);
  const infuraProvider = new ethers.providers.InfuraProvider("goerli", process.env.NEXT_PUBLIC_INFURA_API_KEY);

  const contract : SBD = SBD__factory.connect(address, alchemyProvider);
  return {
    contract : contract,
    provider : alchemyProvider
  };
}

export default async function fetchEvents(address : string) :
  Promise<{events: TypedEventsTuple, timestamps: Map<number, number>}> 
{
  const { contract, provider } = contractSetup(address);
  const evtsSingle : TransferSingleEvent[] =
    (await contract.queryFilter(contract.filters.TransferSingle()));
  const evtsBatch : TransferBatchEvent[] =
    (await contract.queryFilter(contract.filters.TransferBatch()));
  const evtsWins : NewWinnerEvent[] =
    (await contract.queryFilter(contract.filters.NewWinner()));
  const evtsClaims : RewardClaimedEvent[] =
    (await contract.queryFilter(contract.filters.RewardClaimed()));
  const blockNumbers = [...evtsSingle, ...evtsBatch, ...evtsWins, ...evtsClaims].map(
    event => event.blockNumber
  )
  let blockTimestamps: Map<number, number> = new Map();
  for (const event of [...evtsSingle, ...evtsBatch, ...evtsWins, ...evtsClaims]) {
    //Takes to long without cashing
  //blockTimestamps.set(event.blockNumber, (await provider.getBlock(event.blockNumber)).timestamp)
  }
  return { 
    events: { evtsSingle, evtsBatch, evtsWins, evtsClaims },
    timestamps: blockTimestamps
  }
}