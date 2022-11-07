import React from "react";
import formatWallet from "../utils/formatWallet";
import { TypedEventsTuple } from "../utils/eventsFetcher";
import formWalletsData from "../utils/formWalletsData";
import Link from "next/link";
import { useRouter } from "next/router";
import formatKnightId from "../utils/formatKnightId";

const WalletsTable = (props: { events: TypedEventsTuple })  => {
  const walletRoute = useRouter().query.wallet as string;

  const data = formWalletsData(props.events)
    .filter(wallet => !walletRoute || wallet.address === walletRoute);
  
  return (
    <div>
      {
        !walletRoute ?
        <h2>Wallets: {data.length}</h2> :
        <></>
      }
      <table><tbody>
        <tr key={"header"}>
          <th>Wallet</th>
          <th>Staked</th>
          <th>Wins</th>
          <th>Rewards</th>
          <th>Knights</th>
          {/*
          {Object.keys(data.wallets[0]).map((key) => (
            <th>{key}</th>
          ))}
          */}
        </tr>
        {data.map((wallet) => (
          <tr key={wallet.address}>
            <td>
              <Link href={`/${wallet.address}`}>
                {formatWallet(wallet.address)}
              </Link>
            </td>
            <td>{`${wallet.knights.filter(knight => !knight.lossTime).length * 1000} USDT`}</td>
            <td>{wallet.wins.toString()}</td>
            <td>{wallet.rewards.toString()}</td>
            <td>
              <ul>
                { 
                  wallet.knights
                  .filter(knight => !knight.lossTime)
                  .map(knight =>
                    <li key={wallet.knights.findIndex(k => knight === k)}>
                      { formatKnightId(knight.id) }
                    </li>
                  )
                }
              </ul>
            </td>
          </tr>
        ))}
      </tbody></table>
    </div>
  );
};

export default WalletsTable;