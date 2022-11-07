import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";

export default function formEventsData(
  events : {
    evtsSingle: TransferSingleEvent[];
    evtsBatch: TransferBatchEvent[];
    evtsWins: NewWinnerEvent[];
    evtsClaims: RewardClaimedEvent[];
  })
{
  const { evtsSingle, evtsBatch, evtsWins, evtsClaims } = events;
  const topics = {
    TransferSingle : !!evtsSingle[0] ? evtsSingle[0].topics[0] : undefined,
    TransferBatch : !!evtsBatch[0] ? evtsBatch[0].topics[0]  : undefined,
    NewWinner : !!evtsWins[0] ? evtsWins[0].topics[0] : undefined,
    RewardClaimed: !!evtsClaims[0] ? evtsClaims[0].topics[0] : undefined
  }
  const evtsAll :
    Array<TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent>
    = [...evtsSingle, ...evtsBatch, ...evtsWins, ...evtsClaims]
    .sort(
      //earliest events first, latest last
      (evt1, evt2) =>
        evt1.blockNumber > evt2.blockNumber ? 1 :
        evt1.blockNumber < evt2.blockNumber ? -1 :
        evt1.logIndex > evt1.logIndex ? 1 :
        evt1.logIndex < evt2.logIndex ? -1 :
        0
      )
    .reverse(); //since we want latest first
  console.log({ topics, evtsAll });
  return { topics, evtsAll };
}