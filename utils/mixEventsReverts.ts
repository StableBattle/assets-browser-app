import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { txRevert } from "./eventsFetcher";

export default function mixEventsReverts(
  events: (TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent)[],
  reverts: txRevert[])
{
  return [...events, ...reverts]
  .sort((evt1, evt2) =>
    evt1.blockNumber > evt2.blockNumber ? 1 :
    evt1.blockNumber < evt2.blockNumber ? -1 :
    evt1.logIndex > evt1.logIndex ? 1 :
    evt1.logIndex < evt2.logIndex ? -1 :
    0
  )
  .reverse(); //since we want latest first)
}