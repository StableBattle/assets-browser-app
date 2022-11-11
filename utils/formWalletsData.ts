import { ethers, BigNumber } from "ethers";
import { NewWinnerEvent, RewardClaimedEvent, TransferBatchEvent, TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { isTransferBatchEvent, isTransferSingleEvent } from "./eventTypeGuards";

export interface knightData {
  id: BigNumber;
  recieveTime: number;
  reciveFrom: string;
  lossTime?: number;
  lostTo?: string;
}

export interface walletData {
  address: string;
  knights: knightData[];
  wins: number;
  rewards: BigNumber;
}

function handleTransfers(
  evtsSingle : TransferSingleEvent[],
  evtsBatch : TransferBatchEvent[]
  ) : walletData[] {
    //Combine and sort Transfer events
    const evtsTransfer = [...evtsSingle, ...evtsBatch]
    .sort(
      //earliest events first, latest last
      (evt1, evt2) =>
        evt1.blockNumber > evt2.blockNumber ? 1 :
        evt1.blockNumber < evt2.blockNumber ? -1 :
        evt1.logIndex > evt1.logIndex ? 1 :
        evt1.logIndex < evt2.logIndex ? -1 :
        0
      )
    //Form wallet data
    let wallets : walletData[] = [];
    for (const evt of evtsTransfer) {
      const to = wallets.findIndex(wallet => wallet.address == evt.args.to);
      const from = wallets.findIndex(wallet => wallet.address == evt.args.from);
      //"To" wallet not registerred and not a burn
      if (to == -1 && evt.args.to != ethers.constants.AddressZero) {
        if(isTransferSingleEvent(evt)) {
          wallets.push({
            address : evt.args.to,
            knights: [{
              id : evt.args.id,
              recieveTime: evt.blockNumber,
              reciveFrom: evt.args.from
            }],
            wins: 0,
            rewards: BigNumber.from(0)
          })
        }
        if(isTransferBatchEvent(evt)) {
          wallets.push({
            address : evt.args.to,
            knights: evt.args.ids.map(knightId => ({
              id : knightId,
              recieveTime: evt.blockNumber,
              reciveFrom: evt.args.from
            })),
            wins: 0,
            rewards: BigNumber.from(0)
          })
        }
      }
      //"From" wallet registered, cannot be 0 due to first condition
      if (from != -1) {
        if(isTransferSingleEvent(evt)) {
          //Find index of the knight in question and edit it
          const knightInData = wallets[from].knights.findIndex(knight => knight.id.eq(evt.args.id));
          wallets[from].knights[knightInData] = {
            id: wallets[from].knights[knightInData].id,
            recieveTime: wallets[from].knights[knightInData].recieveTime,
            reciveFrom: wallets[from].knights[knightInData].reciveFrom,
            lossTime: evt.blockNumber,
            lostTo: evt.args.to
          }
        }
        if(isTransferBatchEvent(evt)) {
          for(const knightId of evt.args.ids) {
            const knightInData = wallets[from].knights.findIndex(knight => knight.id.eq(knightId));
            wallets[from].knights[knightInData] = {
              id: wallets[from].knights[knightInData].id,
              recieveTime: wallets[from].knights[knightInData].recieveTime,
              reciveFrom: wallets[from].knights[knightInData].reciveFrom,
              lossTime: evt.blockNumber,
              lostTo: evt.args.to
            }
          }
        }
      }
      //"To" wallet registered, cannot be 0 due to first condition
      if (to != -1) {
        if(isTransferSingleEvent(evt)) {
          wallets[to].knights.push({
            id : evt.args.id,
            recieveTime: evt.blockNumber,
            reciveFrom: evt.args.from
          })
        }
        if(isTransferBatchEvent(evt)) {
          for (const knightId of evt.args.ids) {
            wallets[to].knights.push({
              id : knightId,
              recieveTime: evt.blockNumber,
              reciveFrom: evt.args.from
            })
          }
        }
      }
    }
    return wallets;
}

export default function formWalletsData(
  events : {
    evtsSingle: TransferSingleEvent[];
    evtsBatch: TransferBatchEvent[];
    evtsWins: NewWinnerEvent[];
    evtsClaims: RewardClaimedEvent[];
  }) 
  : walletData[]
{
  const { evtsSingle, evtsBatch, evtsWins, evtsClaims } = events;
  let wallets: walletData[] = handleTransfers(evtsSingle, evtsBatch);
  //Handle NewWinner
  for (const evt of evtsWins) {
    const id = wallets.findIndex(wallet => wallet.address == evt.args.user);
    wallets[id].wins++;
    wallets[id].rewards = wallets[id].rewards.add(evt.args.reward);
  }
  //Handle RewardsClaimed
  for (const evt of evtsClaims) {
    const id = wallets.findIndex(wallet => wallet.address == evt.args.user);
    wallets[id].rewards = wallets[id].rewards.sub(evt.args.reward);
  }
  return wallets;
}