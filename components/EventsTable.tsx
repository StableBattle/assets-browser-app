import { ethers, Event } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TypedEventsTuple } from "../utils/eventsFetcher";
import { 
  isNewWinnerEvent, 
  isRewardClaimedEvent, 
  isTransferBatchEvent, 
  isTransferSingleEvent } from "../utils/eventTypeGuards";
import filterByWallet from "../utils/filterByWallet";
import formatKnightId from "../utils/formatKnightId";
import formatWallet from "../utils/formatWallet";
import formEventsData from "../utils/formEventsData";
import formatTimestamp from "../utils/fromatTimestamp";

const EventsTable = (props: { events: TypedEventsTuple, timestamps: Map<number, number>, wallet?: string }) => {
  
  const data : Array<any> = //"any" is here to prevent type error on rendering RewardClaimed event
    formEventsData(!!props.wallet ? filterByWallet(props.events, props.wallet) : props.events);
  
  return (
    <div>
      <h2>Events: {data.length}</h2>
      <table>
        <thead>
          <tr key={"header"}>
            <th>Block</th>
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
                  <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                  <td>NewWinner</td>
                  <td>{event.args.reward.toNumber() / 1000000}</td>
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
                  <td>{formatTimestamp(props.timestamps.get(event.blockNumber))}</td>
                  <td>RewardClaimed</td>
                  <td>{event.args.reward.toNumber() / 1000000}</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.user}`}>
                      {formatWallet(event.args.user)}
                    </Link>
                  </td>
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