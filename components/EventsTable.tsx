import { ethers } from "ethers";
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

const EventsTable = (props: { events: TypedEventsTuple, timestamps: Map<number, number> }) => {
  const walletRoute = useRouter().query.wallet as string;

  const data = formEventsData(filterByWallet(props.events, walletRoute));
  const events = data.evtsAll;
  const topics = data.topics;
  
  return (
    <div>
      <h2>Events: {events.length}</h2>
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
        { events.map((event) => {
            if (isTransferSingleEvent(event, topics)) {
              //Mint
              if (event.args.from === ethers.constants.AddressZero) {
                return(
                  <tr>
                    <td>{event.blockNumber}</td>
                    <td>Mint</td>
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
                    <td>{event.blockNumber}</td>
                    <td>Burn</td>
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
                  <td>{event.blockNumber}</td>
                  <td>TransferS</td>
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
            if (isTransferBatchEvent(event, topics)) {
              return(
                <tr>
                  <td>{event.blockNumber}</td>
                  <td>TransferB</td>
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
                          <li key={event.args.ids.findIndex(k => knight === k)}>
                            { formatKnightId(knight) }
                          </li>
                        )
                      }
                    </ul>
                  </td>
                </tr>
              )
            }
            if (isNewWinnerEvent(event, topics)) {
              return(
                <tr>
                  <td>{event.blockNumber}</td>
                  <td>NewWinner</td>
                  <td>{event.args.reward.toString()}</td>
                  <td></td>
                  <td style={{color: "blue"}}>
                    <Link href={`/${event.args.user}`}>
                      {formatWallet(event.args.user)}
                    </Link>
                  </td>
                </tr>
              )
            }
            //The code below not working due to the wierd type error
            /*
            if (isRewardClaimedEvent(event, topics)) {
              return(
                <tr>
                  <td>{event.blockNumber}</td>
                  <td>RewardClaimed</td>
                  <td>{event.args.reward.toString()}</td>
                  <td></td>
                  <td>{event.args.user}</td>
                </tr>
              )
            }
            */
          }
        )}
      </tbody></table>
    </div>
  );
};

export default EventsTable;