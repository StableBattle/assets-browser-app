import React from "react";
import useSWR from "swr";
import formatWallet from "../utils/formatWallet";
import getEventsEthers from "../utils/getEventsEthers";

const EventsTable = () => {
  const { data, error } = useSWR(
    "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d",
    getEventsEthers,
    { refreshInterval: 1000 });
  if (error) return <div>"Failed to load data"</div>;
  if (!data) return <div>"Loading"</div>;
  
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
            <td>{formatWallet(wallet.address)}</td>
            <td>{`${wallet.knights.length * 1000} USDT`}</td>
            <td>{wallet.rewards.toString()}</td>
            <td>{wallet.knights.length.toString()}</td>
            <td>{wallet.wins.toString()}</td>
          </tr>
        ))}
    </div>
  );
};

export default EventsTable;