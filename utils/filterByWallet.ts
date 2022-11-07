import { NewWinnerEvent, RewardClaimedEvent, TransferBatchEvent, TransferSingleEvent } from "../types/ethers-contracts/SBD";

export default function filterByWallet(
  events : {
    evtsSingle: TransferSingleEvent[];
    evtsBatch: TransferBatchEvent[];
    evtsWins: NewWinnerEvent[];
    evtsClaims: RewardClaimedEvent[];
  },
  wallet : string
) {
  const evtsSingle = 
    events.evtsSingle.filter(
      evt => (!wallet || evt.args.to === wallet || evt.args.from === wallet));
  const evtsBatch = 
    events.evtsBatch.filter(
      evt => (!wallet || evt.args.to === wallet || evt.args.from === wallet));
  const evtsWins = 
    events.evtsWins.filter(
      evt => (!wallet || evt.args.user === wallet));
  const evtsClaims = 
    events.evtsClaims.filter(
      evt => (!wallet || evt.args.user === wallet));

  return { evtsSingle, evtsBatch, evtsWins, evtsClaims }
}