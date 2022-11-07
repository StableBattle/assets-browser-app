import useSWR from 'swr'
import EventWalletSwitch from '../components/EventWalletSwitch'
import fetchEvents from '../utils/eventsFetcher'

export default function Home() {
  const SBDAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";

  const { data, error } = useSWR(
    SBDAddress,
    fetchEvents,
    { refreshInterval: 10000 });
  if (error) {
    console.log(error);
    return <div>Failed to load events data</div>;
  }
  if (!data) return <div>Loading events data</div>;

  return (
    <div>
      <EventWalletSwitch events = { data } />
    </div>
  )
}
