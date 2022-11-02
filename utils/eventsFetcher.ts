import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import contractSetup from "./contractSetup";

function walletFilter(evt : any, wallet?: string) : boolean {
  if (evt.args.to === wallet || 
      evt.args.from === wallet || 
      evt.args.user === wallet) { 
    return true;
  } else {
    return false;
  }
}

export async function fetchEvents(address : string, wallet? : string)
{
  const SBD = contractSetup(address);

  const evtsSingle : TransferSingleEvent[] =
    (await SBD.queryFilter(SBD.filters.TransferSingle()))
    .filter(evt => walletFilter(evt, wallet));
  const evtsBatch : TransferBatchEvent[] =
    (await SBD.queryFilter(SBD.filters.TransferBatch()))
    .filter(evt => walletFilter(evt, wallet));
  const evtsWins : NewWinnerEvent[] =
    (await SBD.queryFilter(SBD.filters.NewWinner()))
    .filter(evt => walletFilter(evt, wallet));
  const evtsClaims : RewardClaimedEvent[] =
    (await SBD.queryFilter(SBD.filters.RewardClaimed()))
    .filter(evt => walletFilter(evt, wallet));
  return {
    evtsSingle,
    evtsBatch,
    evtsWins,
    evtsClaims
  }
}

export default async function fetchEventsSorted(address : string, wallet? : string) : 
Promise<Array<TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent>>
{
  const { evtsSingle, evtsBatch, evtsWins, evtsClaims } = await fetchEvents(address, wallet);
  const evtsAll : 
    Array<TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent>
    = [...evtsSingle, ...evtsBatch, ...evtsWins, ...evtsClaims]
    .sort(
      (evt1, evt2) =>
        evt1.blockNumber > evt2.blockNumber ? 1 :
        evt1.blockNumber < evt2.blockNumber ? -1 :
        evt1.logIndex > evt1.logIndex ? 1 :
        evt1.logIndex < evt2.logIndex ? -1 :
        0
      )
  return evtsAll;
}