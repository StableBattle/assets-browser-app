import React, { useState } from "react";
import EventsTable from "./EventsTable";
import AssetsTable from "./AssetsTable";
import { TypedEventsTuple } from "../utils/eventsFetcher";

const SwitchButton = (props: { events: TypedEventsTuple }) => {
  const [showEvents, setShowEvents] = useState(true);
  const onShowEvents = () => setShowEvents(true);
  const onShowAssets= () => setShowEvents(false);

  return (
    <div>
      <input type="submit" value="Events" onClick={onShowEvents} />
      <input type="submit" value="Assets" onClick={onShowAssets} />
      { 
        showEvents ? 
        <EventsTable events={ props.events } /> :
        <AssetsTable events={ props.events } />
      }
    </div>
  )
}

export default SwitchButton;