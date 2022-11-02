import React from "react";
import formatWallet from "../utils/formatWallet";
import { 
  NewWinnerEvent, 
  RewardClaimedEvent, 
  TransferBatchEvent, 
  TransferSingleEvent } from "../types/ethers-contracts/SBD";
import formWalletsData from "../utils/formWalletsData";
import Link from "next/link";

const WalletsTable = (props: { events: {
  evtsSingle: TransferSingleEvent[];
  evtsBatch: TransferBatchEvent[];
  evtsWins: NewWinnerEvent[];
  evtsClaims: RewardClaimedEvent[];
}; }) => {

  const data = formWalletsData(props.events);
  
  return (
    <div>
      <h1>Wallets found: {data.length}</h1>
      <h2>Wallets Info</h2>
        <tr key={"header"}>
          <th>Wallet</th>
          <th>Staked</th>
          <th>Rewards</th>
          <th>Knights</th>
          <th>Wons</th>
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
            <td>{`${wallet.knights.length * 1000} USDT`}</td>
            <td>{wallet.rewards.toString()}</td>
            <td>{wallet.knights.length.toString()}</td>
            <td>{wallet.wins.toString()}</td>
          </tr>
        ))}
    </div>
  );
};

export default WalletsTable;