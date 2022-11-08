import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";

export function isTransferSingleEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent)
  : event is TransferSingleEvent
  { return (event.event === "TransferSingle"); }

export function isTransferBatchEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent)
  : event is TransferBatchEvent
  { return (event.event === "TransferBatch"); }

export function isNewWinnerEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent)
  : event is NewWinnerEvent
  { return (event.event === "NewWinner"); }

export function isRewardClaimedEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent)
  : event is RewardClaimedEvent
  { return (event.event === "RewardClaimed"); }