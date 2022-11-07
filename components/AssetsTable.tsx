import React, { useEffect, useState } from "react";
import formatWallet from "../utils/formatWallet";
import { TypedEventsTuple } from "../utils/eventsFetcher";
import formWalletsData from "../utils/formWalletsData";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import formatKnightId from "../utils/formatKnightId";

const AssetsTable = (props: { events: TypedEventsTuple })  => {
  const [showBurnedKnights, setShowBurnedKnights] = useState(false);
  const onShowBurnedKnights = () => setShowBurnedKnights(!showBurnedKnights);
  const walletRoute = useRouter().query.wallet as string;

  const data = formWalletsData(props.events);
  const wallet = data.find(w => w.address == walletRoute);
  if(!wallet) return(<div>{"Wallet not found :("}</div>)
  
  return (
    <div>
      <h2>Assets: {wallet.knights.filter(knight => !knight.lossTime).length}</h2>
      <label>
        <input type="checkbox" checked={showBurnedKnights} onChange={onShowBurnedKnights} />
        Show burned and lost characters
      </label>
      <table><tbody>
        <tr key={"header"}>
          <th>Knight</th>
          <th>Recieved</th>
          <th>From</th>
          <th>Lost</th>
          <th>To</th>
        </tr>
        { wallet.knights
          .filter(knight => !knight.lossTime || (!!knight.lossTime && showBurnedKnights))
          .map(knight => (
            <tr key={knight.toString()}>
              <td>{formatKnightId(knight.id)}</td>
              <td>{knight.recieveTime}</td>
              <td>
                { 
                  knight.reciveFrom === ethers.constants.AddressZero ?
                    "Minted" :
                    <Link href={`/${knight.reciveFrom}`}>
                      {formatWallet(knight.reciveFrom)}
                    </Link>
                }
              </td>
              <td>{!knight.lossTime ? "" : knight.lossTime}</td>
              <td>
                {
                  !knight.lostTo ? "" :
                    knight.lostTo === ethers.constants.AddressZero ?
                      "Burned" : 
                      <Link href={`/${knight.lostTo}`}>
                        {formatWallet(knight.lostTo)}
                      </Link>
                }
                </td>
            </tr>
          ))
        }
      </tbody></table>
    </div>
  );
};

export default AssetsTable;