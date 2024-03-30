import React from "react";
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./db/DBConfig";
import PanelExample from "./db_logger_component";
import StationSeeder from "./station_seeder";

initDB(DBConfig);

function App() {
  return (
    <StationSeeder>
      <PanelExample />
    </StationSeeder>
  );
}

export default App;