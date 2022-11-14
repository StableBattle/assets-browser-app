import useSWR from 'swr'
import fetchEvents from '../utils/eventsFetcher'
import { useState } from 'react';
import EventsTable from '../components/EventsTable';
import WalletsTable from '../components/WalletsTable';

export default function Home() {
  const SBDAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";
  const [showEvents, setShowEvents] = useState(true);

  const { data, error } = useSWR(
    SBDAddress,
    fetchEvents,
    { refreshInterval: 10000 });
  if (error) {
    console.log(error);
    return <div>Failed to load events data</div>;
  }
  if (!data) return <div>Loading events data</div>;

  const onShowEvents = () => setShowEvents(true);
  const onShowWallets = () => setShowEvents(false);

  return (
    <table>
      <tbody>
        <td style={{textAlign: "left"}}>
          <div>
            <input type="submit" value="Events" onClick={onShowEvents} />
            <input type="submit" value="Wallets" onClick={onShowWallets} />
            { 
              showEvents ? 
                <EventsTable events={ data.events } timestamps={ data.timestamps } reverts={data.reverts} /> :
                <WalletsTable events={ data.events } />
            }
          </div>
        </td>
      </tbody>
    </table>
  )
}
