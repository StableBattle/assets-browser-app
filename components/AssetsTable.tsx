import React, { useState } from "react";
import formatWallet from "../utils/formatWallet";
import { TypedEventsTuple } from "../utils/eventsFetcher";
import formWalletsData from "../utils/formWalletsData";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import formatKnightId from "../utils/formatKnightId";
import formatTimestamp from "../utils/fromatTimestamp";

const AssetsTable = (props: { events: TypedEventsTuple, timestamps: Map<number, number> })  => {
  const [showBurnedKnights, setShowBurnedKnights] = useState(false);
  const onShowBurnedKnights = () => setShowBurnedKnights(!showBurnedKnights);
  const walletRoute = useRouter().query.wallet as string;

  const data = formWalletsData(props.events);
  const wallet = data.find(w => w.address == walletRoute);
  if(!wallet) return(<div>{"Wallet not found :("}</div>)
  const tableHeaders = [
    "Knight",
    "Recieved",
    "From",
    "Lost",
    "To"
  ].slice(0, !showBurnedKnights ? -2 : 100);
  
  return (
    <div>
      <h2>Assets: {wallet.knights.filter(knight => !knight.lossTime).length}</h2>
      <label>
        <input type="checkbox" checked={showBurnedKnights} onChange={onShowBurnedKnights} />
        Show burned and lost characters
      </label>
      <table><tbody>
        <tr key={"header"}>
          { tableHeaders.map(header => <th>{header}</th>) }
        </tr>
        { showBurnedKnights ?
            wallet.knights
            .map(knight => (
              <tr key={knight.toString()}>
                <td>{formatKnightId(knight.id)}</td>
                <td>{formatTimestamp(props.timestamps.get(knight.recieveTime))}</td>
                {
                  knight.reciveFrom === ethers.constants.AddressZero ?
                  <td>Minted</td> :
                  <td style={{color: "blue"}}>
                    <Link href={`/${knight.reciveFrom}`}>
                      {formatWallet(knight.reciveFrom)}
                    </Link>
                  </td>
                }
                {!knight.lossTime ? "" : <td>{formatTimestamp(props.timestamps.get(knight.lossTime))}</td>}
                {
                  !knight.lostTo ? "" :
                    knight.lostTo === ethers.constants.AddressZero ?
                      <td>Burned</td> : 
                      <td style={{color: "blue"}}>
                        <Link href={`/${knight.lostTo}`}>
                          {formatWallet(knight.lostTo)}
                        </Link>
                      </td>
                }
              </tr>
            )) :
            wallet.knights
            .filter(knight => !knight.lossTime)
            .map(knight => (
              <tr key={knight.toString()}>
                <td>{formatKnightId(knight.id)}</td>
                <td>{formatTimestamp(props.timestamps.get(knight.recieveTime))}</td>
                {
                  knight.reciveFrom === ethers.constants.AddressZero ?
                  <td>Minted</td> :
                  <td style={{color: "blue"}}>
                    <Link href={`/${knight.reciveFrom}`}>
                      {formatWallet(knight.reciveFrom)}
                    </Link>
                  </td>
                }
              </tr>
            ))
        }
      </tbody></table>
    </div>
  );
};

export default AssetsTable;