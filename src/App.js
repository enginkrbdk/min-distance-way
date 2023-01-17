import "./App.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { useEffect, useRef, useState } from "react";

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
      zoom: 15,
      stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    });

    setMap(map);

    const addMarker = () => {
      const popupOffset = { bottom: [0, -25] };
      const element = document.createElement("div");
      element.className = "marker";
      const popup = new tt.Popup({ offset: popupOffset }).setHTML(
        "Şu an buradasın!"
      );
      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat([mapLongitude, mapLatitude])
        .addTo(map);

      marker.on("dragend", () => {
        const getPosition = marker.getLngLat();
        setLatitude(getPosition.lat);
        setLongitude(getPosition.lng);
      });

      marker.setPopup(popup).togglePopup();
    };

    addMarker();
    return () => map.remove();
  }, [mapLongitude, mapLatitude]);

  return (
    <>
      {map && (
        <div className="app">
          <div ref={mapElement} className="map" />
          <div className="search-bar">
            <h1></h1>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
