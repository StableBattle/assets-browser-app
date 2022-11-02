import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";

export function isTransferSingleEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent,
  topics : { TransferSingle?: string; TransferBatch?: string; NewWinner?: string; RewardClaimed?: string; }
  ) : event is TransferSingleEvent
  { return (event.topics[0] === topics.TransferSingle); }

export function isTransferBatchEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent,
  topics : { TransferSingle?: string; TransferBatch?: string; NewWinner?: string; RewardClaimed?: string; }
  ) : event is TransferBatchEvent
  { return (event.topics[0] === topics.TransferBatch); }

export function isNewWinnerEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent,
  topics : { TransferSingle?: string; TransferBatch?: string; NewWinner?: string; RewardClaimed?: string; }
  ) : event is NewWinnerEvent
  { return (event.topics[0] === topics.NewWinner); }

export function isRewardClaimedEvent(
  event : TransferSingleEvent | TransferBatchEvent | NewWinnerEvent | RewardClaimedEvent,
  topics : { TransferSingle?: string; TransferBatch?: string; NewWinner?: string; RewardClaimed?: string; }
  ) : event is RewardClaimedEvent
  { return (event.topics[0] === topics.RewardClaimed); }