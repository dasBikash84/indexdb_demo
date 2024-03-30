import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

export default function DestinationPicker() {
  const { getAll:getAllDistrict } = useIndexedDB("district");
  const { getAll:getAllStation } = useIndexedDB("station");

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
    })();
  }, [getAllDistrict,getAllStation]);

  const fromInputHandler = (event) => {
    setFromInput(event.target.value);
  };

  const toInputHandler = (event) => {
    setToInput(event.target.value);
  };

  return (
    <>
      <br></br>
      <label htmlFor='from'> From:</label> 
      <input name="from" value={fromInput} onChange={fromInputHandler}/>
      
      <br></br>
      <br></br>
      <label>
        To: <input name="myInput" value={toInput} onChange={toInputHandler}/>
      </label>
      <hr />
      From districts: 
      <br></br>
      {/* {districts && districts.map((e) => `${e.id}: ${e.title} | `)} */}
    </>
  );
}

const getMatchingStations = (keyWord,stations)=>{};