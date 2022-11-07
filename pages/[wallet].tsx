import useSWR from 'swr'
import EventsTable from '../components/EventsTable'
import WalletsTable from '../components/WalletsTable'
import fetchEvents from '../utils/eventsFetcher'

export default function Wallet() {
  const SBDAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";

  const { data, error } = useSWR(
    SBDAddress,
    fetchEvents,
    { refreshInterval: 5000 });
  if (error) {
    console.log(error);
    return <div>Failed to load events data</div>;
  }
  if (!data) return <div>Loading events data</div>;

  return (
    <div>
      <EventsTable events = { data }/>
      <WalletsTable events = { data }/>
    </div>
  )
}
