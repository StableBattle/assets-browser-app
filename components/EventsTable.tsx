import { ethers } from "ethers";
import Link from "next/link";
import React from "react";
import { 
  NewWinnerEvent, 
  RewardClaimedEvent, 
  TransferBatchEvent, 
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { isNewWinnerEvent, isTransferBatchEvent, isTransferSingleEvent } from "../utils/eventTypeGuards";
import formatWallet from "../utils/formatWallet";
import formEventsData from "../utils/formEventsData";

const EventsTable = (props: { events: {
  evtsSingle: TransferSingleEvent[];
  evtsBatch: TransferBatchEvent[];
  evtsWins: NewWinnerEvent[];
  evtsClaims: RewardClaimedEvent[];
}; }) => {
  const data = formEventsData(props.events);
  const events = data.evtsAll;
  const topics = data.topics;
  
  return (
    <div>
      <h1>Events found: {events.length}</h1>
      <h2>Events</h2>
        <tr key={"header"}>
          <th>Block</th>
          <th>Type</th>
          <th>Value USDT</th>
          <th>Wallet From</th>
          <th>Wallet To</th>
          <th>Knight</th>
        </tr>
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
                    <td>
                      <Link href={`/${event.args.to}`}>
                        {formatWallet(event.args.to)}
                      </Link>
                    </td>
                    <td>{event.args.id.toString()}</td>
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
                    <td>
                      <Link href={`/${event.args.from}`}>
                        {formatWallet(event.args.from)}
                      </Link>
                    </td>
                    <td></td>
                    <td>{event.args.id.toString()}</td>
                  </tr>
                )
              }
              //Transfer
              return(
                <tr>
                  <td>{event.blockNumber}</td>
                  <td>TransferS</td>
                  <td></td>
                  <td>
                    <Link href={`/${event.args.from}`}>
                      {formatWallet(event.args.from)}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/${event.args.to}`}>
                      {formatWallet(event.args.to)}
                    </Link>
                  </td>
                  <td>{event.args.id.toString()}</td>
                </tr>
              )
            }
            if (isTransferBatchEvent(event, topics)) {
              return(
                <tr>
                  <td>{event.blockNumber}</td>
                  <td>TransferB</td>
                  <td>Not Supported yet</td>
                  <td>
                    <Link href={`/${event.args.from}`}>
                      {formatWallet(event.args.from)}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/${event.args.to}`}>
                      {formatWallet(event.args.to)}
                    </Link>
                  </td>
                  <td>Not Supported yet</td>
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
                  <td>
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
                  <td>NewWinner</td>
                  <td>{event.args.reward.toString()}</td>
                  <td></td>
                  <td>{event.args.user}</td>
                </tr>
              )
            }
            */
          }
        )}
    </div>
  );
};

export default EventsTable;