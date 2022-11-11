export default function formatTimestamp(timestamp?: number) : string {
  if(!timestamp) return "Unknown"
  const time = new Date(timestamp * 1000);
  return time.toString().slice(4,11) + time.toString().slice(15,25);
}