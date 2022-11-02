export default function formatWallet(wallet : string) : string {
  return wallet.slice(0,5) + "..." + wallet.slice(37);
}