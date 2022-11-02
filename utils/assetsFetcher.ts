import { ethers, BigNumber } from "ethers";
import { fetchEvents } from "./eventsFetcher";

export interface walletData {
  address: string;
  knights: BigNumber[];
  wins: number;
  rewards: BigNumber;
}

export async function fetchAssetsSorted(address : string, wallet? : string) : Promise<walletData[]> {
  const { evtsSingle, evtsBatch, evtsWins, evtsClaims } = await fetchEvents(address, wallet);
  let wallets: walletData[] = [];
  for (const evt of evtsSingle) {
    const to = wallets.findIndex(wallet => wallet.address == evt.args.to);
    const from = wallets.findIndex(wallet => wallet.address == evt.args.from);
    if (to == -1 && evt.args.to != ethers.constants.AddressZero) {
      wallets.push({
        address : evt.args.to,
        knights: [evt.args.id],
        wins: 0,
        rewards: BigNumber.from(0)
      })
    }
    if (from != -1) {
      wallets[from].knights.filter(knight => knight != evt.args.id);
    }
    if (to != -1) {
      wallets[to].knights.push(evt.args.id);
    }
  }
  for (const evt of evtsWins) {
    const id = wallets.findIndex(wallet => wallet.address == evt.args.user);
    wallets[id].wins++;
    wallets[id].rewards = wallets[id].rewards.add(evt.args.reward);
  }
  for (const evt of evtsClaims) {
    const id = wallets.findIndex(wallet => wallet.address == evt.args.user);
    wallets[id].rewards = wallets[id].rewards.sub(evt.args.reward);
  }
  return wallets;
}