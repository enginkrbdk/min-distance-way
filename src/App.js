import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as tt from "@tomtom-international/web-sdk-maps";

const App = () => {
  const mapElement = useRef();
  const [map, setMap] = useState({});

  //istanbul koordinarları
  const [mapLongitude, setLongitude] = useState(28.97696);
  const [mapLatitude, setLatitude] = useState(41.00527);

  useEffect(() => {
    let map = tt.map({
      key: process.env.REACT_APP_TOM_TOM_APP_KEY,
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: 14,
    });

    setMap(map);
  }, []);

  return (
    <div className="app">
      <div ref={mapElement} className="map"></div>
    </div>
  );
};

export default App;
