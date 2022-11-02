export default function formatWallet(knightId : string) : string {
  return "..." + knightId.slice(75);
}