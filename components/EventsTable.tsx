import { ethers } from "ethers";
import Link from "next/link";
import React from "react";
import { txRevert, TypedEventsTuple } from "../utils/eventsFetcher";
import { 
  isNewWinnerEvent, 
  isRewardClaimedEvent, 
  isTransferBatchEvent, 
  isTransferSingleEvent, 
  isTxRevert} from "../utils/eventTypeGuards";
import filterEventsByWallet from "../utils/filterEventsByWallet";
import formatKnightId from "../utils/formatKnightId";
import formatWallet from "../utils/formatWallet";
import sortEventsData from "../utils/sortEventsData";
import formatTimestamp from "../utils/fromatTimestamp";
import mixEventsReverts from "../utils/mixEventsReverts";

const EventsTable = (
  props: {
    events: TypedEventsTuple,
    timestamps: Map<number, number>,
    reverts: txRevert[]
    wallet?: string
  }
) => {
  const filteredEvents = filterEventsByWallet(props.events, props.wallet);
  const filteredReverts = !props.wallet ? props.reverts : 
    props.reverts.filter(({ from }) => from === props.wallet);
  const events = sortEventsData(filteredEvents);
  const data : Array<any> = //"any" is here to prevent a type error on rendering RewardClaimed events
    mixEventsReverts(events, filteredReverts);
  
  return (
    <div>
      <h2>Events and Reverts: {data.length}</h2>
      <table>
        <thead>
          <tr key={"header"}>
            <th>ICO</th>
            <th>DateTime</th>
            <th>Type</th>
            <th>Value USDT</th>
            <th>Wallet From</th>
            <th>Wallet To</th>
            <th>Knight</th>
          </tr>
        </thead>
        <tbody>
        { data.map((event) => {
            if (isTransferSingleEvent(event)) {
              //Mint
              if (event.args.from === ethers.constants.AddressZero) {
                return(
                  <tr>
                    <td style={{color: "green"}}>OK</td>
                    <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                    <td>KnightMinted</td>
                    <td>1000</td>
                    <td></td>
                    <td style={{color: "blue"}}>
                      <Link href={`/${event.args.to}`}>
                        {formatWallet(event.args.to)}
                      </Link>
                    </td>
                    <td>{formatKnightId(event.args.id)}</td>
                  </tr>
                )
              }
              //Burn
              if (event.args.to === ethers.constants.AddressZero) {
                return(
                  <tr>
                    <td style={{color: "green"}}>OK</td>
                    <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                    <td>KnightBurned</td>
                    <td>-1000</td>
                    <td style={{color: "blue"}}>
                      <Link href={`/${event.args.from}`}>
                        {formatWallet(event.args.from)}
                      </Link>
                    </td>
                    <td></td>
                    <td>{formatKnightId(event.args.id)}</td>
                  </tr>
                )
              }
              //Transfer
              return(
                <tr>
                  <td style={{color: "green"}}>OK</td>
                  <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                  <td>TransferSingle</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.from}`}>
                      {formatWallet(event.args.from)}
                    </Link>
                  </td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.to}`}>
                      {formatWallet(event.args.to)}
                    </Link>
                  </td>
                  <td>{formatKnightId(event.args.id)}</td>
                </tr>
              )
            }
            if (isTransferBatchEvent(event)) {
              return(
                <tr>
                  <td style={{color: "green"}}>OK</td>
                  <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                  <td>TransferBatch</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.from}`}>
                      {formatWallet(event.args.from)}
                    </Link>
                  </td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.to}`}>
                      {formatWallet(event.args.to)}
                    </Link>
                  </td>
                  <td>
                    <ul>
                      { event.args.ids.map(knight =>
                          <li style={{listStyleType: "none"}} key={event.args.ids.findIndex(k => knight === k)}>
                            { formatKnightId(knight) }
                          </li>
                        )
                      }
                    </ul>
                  </td>
                </tr>
              )
            }
            if (isNewWinnerEvent(event)) {
              return(
                <tr>
                  <td style={{color: "green"}}>OK</td>
                  <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                  <td>NewWinner</td>
                  <td>{event.args.reward.toNumber() / 1e6}</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.user}`}>
                      {formatWallet(event.args.user)}
                    </Link>
                  </td>
                </tr>
              )
            }
            if (isRewardClaimedEvent(event)) {
              return(
                <tr>
                  <td style={{color: "green"}}>OK</td>
                  <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                  <td>RewardClaimed</td>
                  <td>-{event.args.reward.toNumber() / 1e6}</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.user}`}>
                      {formatWallet(event.args.user)}
                    </Link>
                  </td>
                </tr>
              )
            }
            if(isTxRevert(event)) {
              return(
                <tr>
                  <td style={{color: "red"}}>X</td>
                  <td>{formatTimestamp(event.timestamp)}</td>
                  <td>{event.functionName}</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.from}`}>
                      {formatWallet(event.from)}
                    </Link>
                  </td>
                  <td>SBD</td>
                </tr>
              )
            }
          }
        )}
      </tbody></table>
    </div>
  );
};

export default EventsTable;