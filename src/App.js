import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as tt from "@tomtom-international/web-sdk-maps";

const App = () => {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const mapLongitude = 28.97696;
  const mapLatitude = 41.00527;

  useEffect(() => {
    let map = tt.map({
      key: "IWrAjYGUmAt4iJmyo92edhU1eOb8QxxO",
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
