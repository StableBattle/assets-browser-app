import useSWR from 'swr'
import fetchEvents from '../utils/eventsFetcher'
import { useState } from 'react';
import EventsTable from '../components/EventsTable';
import WalletsTable from '../components/WalletsTable';
import AssetsTable from '../components/AssetsTable';
import { useRouter } from 'next/router';

export default function Home() {
  const SBDAddress = "0xC0662fAee7C84A03B1e58d60256cafeeb08Ab85d";
  const walletRoute = useRouter().query.wallet as string | undefined;
  const [showEvents, setShowEvents] = useState(true);
  const [showWalletEvents, setShowWalletEvents] = useState(true);

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

  const onShowWalletEvents = () => setShowWalletEvents(true);
  const onShowAssets = () => setShowWalletEvents(false);

  return (
    <table>
      <tbody>
        <td style={{textAlign: "left"}}>
          <div>
            <input type="submit" value="Events" onClick={onShowEvents} />
            <input type="submit" value="Wallets" onClick={onShowWallets} />
            { 
              showEvents ? 
                <EventsTable events={ data.events } timestamps={ data.timestamps } /> :
                <WalletsTable events={ data.events } />
            }
          </div>
        </td>
        <td style={{textAlign: "left", verticalAlign: "top"}}>
          { 
            typeof(walletRoute) === "string" ?
              <div>
                <input type="submit" value="Events" onClick={onShowWalletEvents} />
                <input type="submit" value="Assets" onClick={onShowAssets} />
                { 
                  showWalletEvents ?
                    <EventsTable events={ data.events } timestamps={ data.timestamps } wallet={ walletRoute } /> :
                    <AssetsTable events={ data.events } timestamps={ data.timestamps } />
                }
              </div> :
              <>Oops</>
          }
        </td>
      </tbody>
    </table>
  )
}
