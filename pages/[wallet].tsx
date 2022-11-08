import { useRouter } from 'next/router';
import useSWR from 'swr'
import EventAssetSwitch from '../components/EventAssetSwitch';
import fetchEvents from '../utils/eventsFetcher'

export default function Wallet() {
  const SBDAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";
  const walletRoute = useRouter().query.wallet as string;

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
    <>
      <h1>Wallet {walletRoute}</h1>
      <div>
        <EventAssetSwitch events = { data.events } timestamps={ data.timestamps }  />
      </div>
    </>
  )
}
