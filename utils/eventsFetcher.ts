import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { SBD__factory } from "../types/ethers-contracts/factories/SBD__factory";
import { SBD } from "../types/ethers-contracts/SBD";
import { ethers, providers } from "ethers";
import { EtherscanProvider, TransactionResponse, UrlJsonRpcProvider } from "@ethersproject/providers";

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

export interface txRevert extends TransactionResponse {
  logIndex: string,
  functionName: string,
  blockNumber: number
}

export async function getTxHistory(address: string, provider: EtherscanProvider) {
  const params = {
      action: "txlist",
      address: (await provider.resolveName(address)),
      startblock: 0,
      endblock: 99999999,
      sort: "asc"
  };

  const result = await provider.fetch("account", params);

//console.log(result)

  const responses : txRevert[] = result.map((tx: any) => {
      ["contractAddress", "to"].forEach(function(key) {
          if (tx[key] == "") { delete tx[key]; }
      });
      if (tx.creates == null && tx.contractAddress != null) {
          tx.creates = tx.contractAddress;
      }
      let item : any = provider.formatter.transactionResponse(tx);
      item.functionName = !!tx.functionName ? tx.functionName : "";
      item.logIndex = Number(tx.transactionIndex);
      if (tx.timeStamp) { item.timestamp = parseInt(tx.timeStamp); }
      return item as txRevert;
  });

  let blockTimestamps : Map<number, number> = new Map();
  responses.map(
    res => !!res.blockNumber && !!res.timestamp ?
      blockTimestamps.set(res.blockNumber, res.timestamp) :
      {}
  )
  
  const revertedTxs = responses
  .filter(
    responseTx => result.find(
      (resultTx: {hash: string}) => resultTx.hash === responseTx.hash
    )
    .isError === '1'
  )
  return { blockTimestamps, revertedTxs };
}

export default async function fetchEvents(address : string) :
  Promise<{events: TypedEventsTuple, timestamps: Map<number, number>, reverts: txRevert[]}> 
{
  const { contract, provider } = contractSetup(address);
  const { blockTimestamps, revertedTxs } = await getTxHistory(address, provider);
  const evtsSingle : TransferSingleEvent[] =
    (await contract.queryFilter(contract.filters.TransferSingle()));
  const evtsBatch : TransferBatchEvent[] =
    (await contract.queryFilter(contract.filters.TransferBatch()));
  const evtsWins : NewWinnerEvent[] =
    (await contract.queryFilter(contract.filters.NewWinner()));
  const evtsClaims : RewardClaimedEvent[] =
    (await contract.queryFilter(contract.filters.RewardClaimed()));
//console.log(revertedTxs);
  return {
    events: { evtsSingle, evtsBatch, evtsWins, evtsClaims },
    timestamps: blockTimestamps,
    reverts: revertedTxs
  }
}