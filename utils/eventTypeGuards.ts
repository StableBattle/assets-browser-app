import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { txRevert } from "./eventsFetcher";

export function isTransferSingleEvent(
  event : any)
  : event is TransferSingleEvent
  { return (event.event === "TransferSingle"); }

export function isTransferBatchEvent(
  event : any)
  : event is TransferBatchEvent
  { return (event.event === "TransferBatch"); }

export function isNewWinnerEvent(
  event : any)
  : event is NewWinnerEvent
  { return (event.event === "NewWinner"); }

export function isRewardClaimedEvent(
  event : any)
  : event is RewardClaimedEvent
  { return (event.event === "RewardClaimed"); }

export function isTxRevert(
  tx : any)
  : tx is txRevert
  { return (!!tx.functionName); }