import { TypedEventsTuple } from "./eventsFetcher";

export default function filterByWallet(
  events : TypedEventsTuple,
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