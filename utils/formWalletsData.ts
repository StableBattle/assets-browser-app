import { ethers, BigNumber } from "ethers";
import { NewWinnerEvent, RewardClaimedEvent, TransferBatchEvent, TransferSingleEvent } from "../types/ethers-contracts/SBD";
import { isTransferBatchEvent, isTransferSingleEvent } from "./eventTypeGuards";

export interface walletData {
  address: string;
  knights: BigNumber[];
  wins: number;
  rewards: BigNumber;
}

function handleTransfers(
  evtsSingle : TransferSingleEvent[],
  evtsBatch : TransferBatchEvent[]
  ) : walletData[] {
    const topics = {
      TransferSingle :  evtsSingle[0].topics[0],
      TransferBatch : evtsBatch[0].topics[0],
      NewWinner : undefined,
      RewardClaimed: undefined
    }
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
    let wallets : walletData[] = [];
    for (const evt of evtsTransfer) {
      const to = wallets.findIndex(wallet => wallet.address == evt.args.to);
      const from = wallets.findIndex(wallet => wallet.address == evt.args.from);
      //To wallet not registerred and not a burn
      if (to == -1 && evt.args.to != ethers.constants.AddressZero) {
        if(isTransferSingleEvent(evt, topics)) {
          wallets.push({
            address : evt.args.to,
            knights: [evt.args.id],
            wins: 0,
            rewards: BigNumber.from(0)
          })
        }
        if(isTransferBatchEvent(evt, topics)) {
          wallets.push({
            address : evt.args.to,
            knights: evt.args.ids,
            wins: 0,
            rewards: BigNumber.from(0)
          })
        }
      }
      //From wallet registered, cannot be 0 due to first condition
      if (from != -1) {
        if(isTransferSingleEvent(evt, topics)) {
          wallets[from].knights.filter(knight => knight !== evt.args.id);
        }
        if(isTransferBatchEvent(evt, topics)) {
          wallets[from].knights.filter(
            knight => {
              for (const id of evt.args.ids) {
                if (knight === id) {
                  return false;
                }
              }
              return true;
            }
          )
        }
      }
      //To wallet registered, cannot be 0 due to first condition
      if (to != -1) {
        if(isTransferSingleEvent(evt, topics)) {
          wallets[to].knights.push(evt.args.id);
        }
        if(isTransferBatchEvent(evt, topics)) {
          wallets[to].knights.concat(evt.args.ids);
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