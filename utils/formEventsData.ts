import { TypedEventsTuple } from "./eventsFetcher";

export default function formEventsData(events : TypedEventsTuple) {
  return [...events.evtsSingle, ...events.evtsBatch, ...events.evtsWins, ...events.evtsClaims]
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
}