import React, { useState } from "react";
import EventsTable from "./EventsTable";
import WalletsTable from "./WalletsTable";
import { TypedEventsTuple } from "../utils/eventsFetcher";

const EventWalletSwitch = (props: { events: TypedEventsTuple, timestamps: Map<number, number>  }) => {
  const [showEvents, setShowEvents] = useState(true);
  const onShowEvents = () => setShowEvents(true);
  const onShowWallets = () => setShowEvents(false);

  return (
    <div>
      <input type="submit" value="Events" onClick={onShowEvents} />
      <input type="submit" value="Wallets" onClick={onShowWallets} />
      { 
        showEvents ? 
        <EventsTable events={ props.events } timestamps={ props.timestamps } /> :
        <WalletsTable events={ props.events } />
      }
    </div>
  )
}

export default EventWalletSwitch;