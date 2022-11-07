import { BigNumber } from "ethers";
import formatKnightId from "./formatKnightId";

export default function printKnights(knights : BigNumber[]) {
  let result : string = "";
  for (const knight of knights) {
    result += formatKnightId(knight) + "\n"
  }
  return result;
}