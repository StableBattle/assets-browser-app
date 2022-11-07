import { BigNumber } from "ethers";

export default function formatKnightId(knightId : BigNumber) : string {
  return "..." + knightId.toString().slice(75);
}