import { useRouter } from 'next/router'
import useSWR from 'swr'
import EventsTable from '../components/EventsTable'
import WalletsTable from '../components/WalletsTable'
import fetchEvents from '../utils/eventsFetcher'

export default function Wallet() {
  const SBDAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";
  const walletRoute = useRouter().query.wallet as string;

  const { data, error } = useSWR(
    {
      address : SBDAddress,
      wallet : walletRoute
    },
    fetchEvents,
    { refreshInterval: 1000 });
  if (error) return <div>Failed to load events data for {walletRoute}</div>;
  if (!data) return <div>Loading events data for {walletRoute}</div>;

  return (
    <div>
      <EventsTable events = { data }/>
      <WalletsTable events = { data }/>
    </div>
  )
}
