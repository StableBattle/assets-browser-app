import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { SBD__factory } from "../types/ethers-contracts/factories/SBD__factory";
import { SBD } from "../types/ethers-contracts/SBD";
import { ethers, providers } from "ethers";
import { EtherscanProvider, UrlJsonRpcProvider } from "@ethersproject/providers";

export interface TypedEventsTuple {
  evtsSingle: TransferSingleEvent[];
  evtsBatch: TransferBatchEvent[];
  evtsWins: NewWinnerEvent[];
  evtsClaims: RewardClaimedEvent[];
}

export function contractSetup(address: string) : {contract: SBD, provider: EtherscanProvider } {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "u1LsOL2DBC0PEV91z2RV2lXpxdiwPAnq");
  const etherscanProvider = new ethers.providers.EtherscanProvider("goerli", "P2PVFYSEXPBA4A9NZP4DBEJV1C53HAK83H");
  const infuraProvider = new ethers.providers.InfuraProvider("goerli", process.env.NEXT_PUBLIC_INFURA_API_KEY);

  const contract : SBD = SBD__factory.connect(address, etherscanProvider);
  return {
    contract : contract,
    provider : etherscanProvider
  };
}

export default async function fetchEvents(address : string) :
  Promise<{events: TypedEventsTuple, timestamps: Map<number, number>}> 
{
  const { contract, provider } = contractSetup(address);
  const txHistory = await provider.getHistory(address);
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
    const timestamp = txHistory[txHistory.findIndex(tx => tx.blockNumber === event.blockNumber)].timestamp
    !!timestamp ?
      blockTimestamps.set(event.blockNumber, timestamp) :
      console.log(`No timestamp for block ${event.blockNumber}`);
  }
  return { 
    events: { evtsSingle, evtsBatch, evtsWins, evtsClaims },
    timestamps: blockTimestamps
  }
}