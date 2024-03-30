import React, { useEffect, useState } from "react";

// import Tasks from './components/Tasks/Tasks';
// import NewTask from './components/NewTask/NewTask';
import useHttp from "./hooks/use-http";

function App() {
  const [tasks, setTasks] = useState([]);

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {

    const headers = {
      "Accept-Language": "en",
      accept: "*/*",
    };

    fetchTasks(
      {
        url: "https://aab5bb75-1d5f-4294-b949-51cdb3ecc201.mock.pstmn.io/srt-station",
        headers: headers,
      },
      transformTasks
    );
  }, [fetchTasks]);

  // const taskAddHandler = (task) => {
  //   setTasks((prevTasks) => prevTasks.concat(task));
  // };

  return (
    <React.Fragment>
      {/* <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      /> */}
    </React.Fragment>
  );
}

export default App;

const transformTasks = (tasksObj) => { 
  const stationItems = tasksObj?.data ?? [];   
  console.log(stationItems.length);
  const allDistricts = [];
  for (const stationItem of stationItems) {
    if (stationItem.district_id != null) {
      /*
      District(
        int id, {
        String? title,
        String? titleBn,
        Set<int> to = const {},
      })
      */
      const dist = {
        id: stationItem.district_id,
        title: stationItem.district,
        titleBn: stationItem.district_bn,
        to:[]
      };
      // try {
      //   await _realm.writeAsync(() {
      //     _realm.add(dist);
      //   });
      // } on Exception catch (_) {
      //   // debugLog(e.toString());
      // }
      if(!allDistricts.find(el => el.id == dist.id)){
        allDistricts.push(dist);
      }
    }
  }
  console.log(allDistricts.length);
  console.log(allDistricts[0]);


  // final allDistricts = _realm.all<District>();
  const allStations = [];

  for (const stationItem of stationItems) {
    if (stationItem.id != null) {
      /*
        Station(
          int id, {
          String? title,
          String? titleBn,
          District? district,
          String? travelModeName,
          String? shortCode,
          Set<int> to = const {},
        })
      */
      const station = {
        id: stationItem.id,
        title: stationItem.title,
        titleBn: stationItem.title_bn,
        shortCode: stationItem.short_code,
        travelModeName: stationItem.travel_mode,
        districtId: stationItem.district_id,
        district: allDistricts.find(el => el.id == stationItem.district_id),
        to: stationItem.to,
      };
      if(!allStations.find(el => el.id == station.id)){
        allStations.push(station);
      }
      // try {
      //   await _realm.writeAsync(() {
      //     _realm.add(station);
      //   });
      // } on Exception catch (_) {
      //   // debugLog(e.toString());
      // }
    }
  }
  console.log(allStations.length);
  console.log(allStations[0]);

  for (const dis of allDistricts) {
    // console.log(dis);
    allStations.filter(el => el.districtId == dis.id).forEach((el)=>{
      // console.log(el);
      const allTo = dis.to ?? [];
      for(const toId of el.to){
        // console.log(toId);
        if (!allTo.includes(toId)) {
          allTo.push(toId);
        }
      }
      // console.log(allTo);
      dis.to = allTo;
    });
  }
  allDistricts.forEach(d => console.log(d.title,d.to));
};

/*



Future<void> saveStationData(List<StationItem>? res) async {
    final stationItems = res ?? [];

    if (stationItems.isEmpty) {
      return;
    }

    await _realm.writeAsync(() {
      _realm.deleteAll<District>();
      _realm.deleteAll<Station>();
    });

    for (final stationItem in stationItems) {
      if (stationItem.districtId != null) {
        final dist = District(
          stationItem.districtId!,
          title: stationItem.district,
          titleBn: stationItem.districtBn,
        );
        try {
          await _realm.writeAsync(() {
            _realm.add(dist);
          });
        } on Exception catch (_) {
          // debugLog(e.toString());
        }
      }
    }

    final allDistricts = _realm.all<District>();

    for (final stationItem in stationItems) {
      if (stationItem.id != null) {
        final station = Station(
          stationItem.id!,
          title: stationItem.title,
          titleBn: stationItem.titleBn,
          shortCode: stationItem.shortCode,
          travelModeName: stationItem.travelMode?.name,
          district: allDistricts
              .findFirst((element) => element.id == stationItem.districtId),
          to: stationItem.to?.toSet() ?? {},
        );

        try {
          await _realm.writeAsync(() {
            _realm.add(station);
          });
        } on Exception catch (_) {
          // debugLog(e.toString());
        }
      }
    }

    for (final dis in allDistricts) {
      for (final station in dis.getBacklinks<Station>('district')) {
        await _realm.writeAsync(() {
          dis.to.addAll(station.to);
        });
      }
    }
  }

*/