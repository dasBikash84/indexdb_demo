import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

export default function DestinationPicker() {
  const { getAll:getAllDistrict } = useIndexedDB("district");
  const { getAll:getAllStation } = useIndexedDB("station");



  const [fromDistrict, setFromDistrict] = useState();
  const [fromStation, setFromStation] = useState();
  const [toDistrict, setToDistrict] = useState();
  const [toStation, setToStation] = useState();

  const [districts, setDistricts] = useState([]);
  const [stations, setStations] = useState([]);

  const [fromInput, setFromInput] = useState();
  const [toInput, setToInput] = useState([]);

  useEffect(() => {
    (async () => {
      const allDistricts = await getAllDistrict();
      const allStations = await getAllStation();
      setDistricts(allDistricts);
      setStations(allStations);
      // setFromStation(allStations[0]);
      // setToStation(allStations[10]);
    })();
  }, [getAllDistrict,getAllStation]);

  const fromInputHandler = (event) => {
    setFromInput(event.target.value);
  };

  const toInputHandler = (event) => {
    setToInput(event.target.value);
  };

  const fromSelectHandler = (item,isDistrict) => {
    if(isDistrict){
      setFromDistrict(item);
    }else{
      setFromStation(item);
    }
  };

  const fromText = fromDistrict?.title || fromStation?.title;
  const toText = toDistrict?.title || toStation?.title;


  return (
    <>
      <br></br>
      <label htmlFor='from'> From: </label> 
      <input name="from" value={fromText ?? fromInput} onChange={fromInputHandler}  disabled = {fromText} />      
      {fromText ? `${fromDistrict ? ` District: ${JSON.stringify(fromDistrict)}` : `  Station ${JSON.stringify(fromStation)}`}` : ''}
      <br></br>
      <br></br>
      <label htmlFor='to'> To: </label> 
      <input name="to" value={toText ?? toInput} onChange={toInputHandler}  disabled = {toText}/>
      {toText ? `${toDistrict ? ' District' : ' Station'}` : ''}
      <hr />
      <br></br>
      {fromText ? '' : FromPicker({
        keyWord: fromInput,
        districts: districts,
        stations:stations,
        onSelect:fromSelectHandler
      })}
    </>
  );
}

const FromPicker = ({keyWord,districts,stations,onSelect})=>{
  const tKeyWord = keyWord?.toLowerCase()?.trim();
  const nlDistricts = districts || [];
  const nlStations = stations || [];
  if(!tKeyWord || tKeyWord.length < 2){
    return null;
  }

  const matchingDistricts = nlDistricts.filter(
    e => e.title?.toLowerCase()?.includes(tKeyWord) || e.titleBn?.toLowerCase()?.includes(tKeyWord)
  );
  
  matchingDistricts.forEach(dist => dist.stations =  nlStations.filter(st=> st.districtId === dist.id));
  const matchingDistrictIds = matchingDistricts.map(dist=> dist.id) || [];
  const matchingStations = nlStations.filter(
    st => (st.title?.toLowerCase()?.includes(tKeyWord) || st.titleBn?.toLowerCase()?.includes(tKeyWord)) && !matchingDistrictIds.includes(st.districtId)
  );
  return <div>
    {matchingDistricts.map(e => DistrictPreview({district:e,onSelect}))}
    {matchingStations.map(st => StationPreview(st,onSelect,false))}
  </div> 
};

// DL : district logo
const DistrictPreview = ({district,onSelect})=>{

  const districtView = <button onClick={()=> onSelect(district,true) }>{`DL ${district?.title} - All Station`}</button>;
  const stations = district.stations || [];
  
  return <div key={district?.id}>
    <br></br>
    {districtView}
    {stations.map(st => StationPreview(st,onSelect,true))}
  </div>;
};

// SL : Station logo
const StationPreview = (station,onSelect,isWithDistrict)=>{

  const stationView = <button onClick={()=> onSelect(station,false) }>{`SL ${station?.title} : ${station?.shortCode} `}</button>;
  
  return <div key={station?.id}>
    <br></br>
    <span dangerouslySetInnerHTML={{__html: isWithDistrict ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ''}} />
    {stationView}
  </div>;
};
