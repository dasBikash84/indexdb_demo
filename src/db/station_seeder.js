import { useIndexedDB } from "react-indexed-db-hook";
import useHttp from "../hooks/use-http";
import React, { useEffect } from "react";

const stationUrl =
  "https://aab5bb75-1d5f-4294-b949-51cdb3ecc201.mock.pstmn.io/srt-station";

const headers = {
  "Accept-Language": "en",
  accept: "*/*",
};

export default function StationSeeder(props) {
  const { add: addDistrict, clear: clearDistrict } = useIndexedDB("district");
  const { add: addStation, clear: clearStation } = useIndexedDB("station");

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {
    fetchTasks(
      {
        url: stationUrl,
        headers: headers,
      },
      (data) => {
        saveStationData(
          data,
          addDistrict,
          addStation,
          clearDistrict,
          clearStation
        );
      }
    );
  }, [stationUrl]);
  return <React.Fragment>{props.children}</React.Fragment>;
}

const saveStationData = async (
  tasksObj,
  addDistrict,
  addStation,
  clearDistrict,
  clearStation
) => {
  const stationItems = tasksObj?.data?.items ?? [];

  console.log(stationItems.length);

  if (stationItems.length === 0) {
    return;
  }
  await clearDistrict();
  await clearStation();

  const allDistricts = [];

  for (const stationItem of stationItems) {
    if (stationItem.district_id != null) {
      const dist = {
        id: stationItem.district_id,
        title: stationItem.district,
        titleBn: stationItem.district_bn,
        to: [],
      };
      if (!allDistricts.find((el) => el.id === dist.id)) {
        allDistricts.push(dist);
      }
    }
  }
  console.log(allDistricts.length);

  const allStations = [];

  for (const stationItem of stationItems) {
    if (stationItem.id != null) {
      const station = {
        id: stationItem.id,
        title: stationItem.title,
        titleBn: stationItem.title_bn,
        shortCode: stationItem.short_code,
        travelModeName: stationItem.travel_mode,
        districtId: stationItem.district_id,
        district: allDistricts.find((el) => el.id === stationItem.district_id),
        to: stationItem.to,
      };

      if (!allStations.find((el) => el.id === station.id)) {
        allStations.push(station);
        try {
          await addStation(station);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  console.log(allStations.length);

  for (const dist of allDistricts) {
    allStations
      .filter((el) => el.districtId === dist.id)
      .forEach((el) => {
        const allTo = [];
        for (const toId of el.to) {
          if (!allTo.includes(toId)) {
            allTo.push(toId);
          }
        }
        dist.to = allTo;
      });
    try {
      await addDistrict(dist);
    } catch (error) {
      console.log(error);
    }
  }
};
