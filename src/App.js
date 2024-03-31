import React, { useEffect, useState } from "react";
import { initDB, useIndexedDB } from "react-indexed-db-hook";
import { DBConfig } from "./db/DBConfig";
import DestinationPicker from "./destination_picker";
import StationSeeder from "./db/station_seeder";

initDB(DBConfig);

function App() {
  const { getAll: getAllDistrict } = useIndexedDB("district");
  const [hasStationData, setHasStationData] = useState();

  const onDataLoad = ()=>{
    setHasStationData(true);
  };

  useEffect(() => {
    (async () => {
      const allDistricts = await getAllDistrict();
      if (allDistricts.length > 0) {
        setHasStationData(true);
      }
    })();
  }, [getAllDistrict]);

  return (
    <StationSeeder onDataLoad={onDataLoad}>
      {hasStationData && <DestinationPicker />}
    </StationSeeder>
  );
}

export default App;