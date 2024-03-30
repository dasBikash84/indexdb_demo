import React from "react";
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./db/DBConfig";
import DestinationPicker from "./destination_picker";
import StationSeeder from "./db/station_seeder";

initDB(DBConfig);

function App() {
  return (
    <StationSeeder>
      <DestinationPicker />
    </StationSeeder>
  );
}

export default App;