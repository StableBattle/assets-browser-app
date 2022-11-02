import { 
  NewWinnerEvent,
  RewardClaimedEvent,
  TransferBatchEvent,
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import contractSetup from "./contractSetup";

export default async function fetchEvents(address : string, wallet? : string) {
  const SBD = contractSetup(address);

  const evtsSingle : TransferSingleEvent[] =
    (await SBD.queryFilter(SBD.filters.TransferSingle()))
    .filter(evt => (!wallet || evt.args.to === wallet || evt.args.from === wallet));
  const evtsBatch : TransferBatchEvent[] =
    (await SBD.queryFilter(SBD.filters.TransferBatch()))
    .filter(evt => (!wallet || evt.args.to === wallet || evt.args.from === wallet));
  const evtsWins : NewWinnerEvent[] =
    (await SBD.queryFilter(SBD.filters.NewWinner()))
    .filter(evt => (!wallet || evt.args.user === wallet));
  const evtsClaims : RewardClaimedEvent[] =
    (await SBD.queryFilter(SBD.filters.RewardClaimed()))
    .filter(evt => (!wallet || evt.args.user === wallet));
  return { evtsSingle, evtsBatch, evtsWins, evtsClaims }
}
