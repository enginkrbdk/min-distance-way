import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttservices from "@tomtom-international/web-sdk-services";
import tt from "@tomtom-international/web-sdk-maps";
import { fromSeconds } from "from-seconds";
import { useEffect, useState, useRef } from "react";

function Map({ data, zoom_level, travel_mode }) {
  const mapElement = useRef();
  const [map, setMap] = useState(null);
  const [waypoints] = useState(data);
  //istanbul koordinarları
  const [mapLongitude, setLongitude] = useState(3.319332056);
  const [mapLatitude, setLatitude] = useState(6.572997708);
  const api_key = process.env.REACT_APP_TOM_TOM_APP_KEY;

  function create_marker(location) {
    const marker_el = document.createElement("div");
    if (location.name == "Murtala Muhammed Airport") {
      marker_el.id = "marker";
    } else {
      marker_el.id = travel_mode;
    }

    const popup = new tt.Popup({ offset: 20 }).setText(location.name);
    const marker = new tt.Marker({ element: marker_el, anchor: "bottom" })
      .setLngLat([location.lng, location.lat])
      .setPopup(popup)
      .addTo(map);

    return marker;
  }
  let URL = `https://api.tomtom.com/routing/waypointoptimization/1?key=${api_key}`;
  const optimize_routes = () => {
    const data = {
      waypoints: waypoints.map((location) => {
        return {
          point: {
            latitude: location.lat,
            longitude: location.lng,
          },
        };
      }),
      options: {
        travelMode: travel_mode,
        vehicleMaxSpeed: 0,
        vehicleCommercial: true,
        vehicleLoadType: ["otherHazmatGeneral"],
        traffic: "live",
        departAt: "now",
        outputExtensions: ["travelTimes", "routeLengths"],
        waypointConstraints: {
          originIndex: 0,
          destinationIndex: 0,
        },
      },
    };
    fetch(URL, {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        const optimized_locations = data.summary.legSummaries.map((summary) => {
          return { ...waypoints[summary.originIndex], ...summary };
        });
        optimized_locations.forEach((location, index) => {
          const start_time = new Date(location.departureTime).toLocaleString();
          const arrival_time = new Date(location.arrivalTime).toLocaleString();
          const distance_in_seconds = fromSeconds(
            location.travelTimeInSeconds
          ).toHours();
          const start_at = location.originIndex;
          const end_at = location.destinationIndex;
          const popup = new tt.Popup({ offset: 50 }).setHTML(
            `<div class="popup">
            <h1>Location ${index}</h1>
            <br />
            <p>Current Point: ${waypoints[start_at].name}</p>
            <p>Departure Time: ${start_time}</p>
            <p>Next Stop: ${waypoints[end_at].name}</p>
            <p>Arrival Time:  ${arrival_time}<p>
            <p>Distance To next stop:  ${location.lengthInMeters / 1000}(km)</p>
            <p>Estimated Time To next stop:  ${
              distance_in_seconds.hours
            } Hours, ${distance_in_seconds.minutes} Minutes</p>
            </div> `
          );
          create_marker(location).setPopup(popup);
        });
        create_route(optimized_locations); // call the create_route function
      });
  };
  const create_route = (locations) => {
    ttservices.services
      .calculateRoute({
        key: api_key,
        locations,
      })
      .then((routeData) => {
        const features = routeData.toGeoJson().features;
        features.forEach((feature, index) => {
          map.addLayer({
            id: "route" + index,
            type: "line",
            source: {
              type: "geojson",
              data: feature,
            },
            paint: {
              "line-color": `red`,
              "line-opacity": 0.8,
              "line-width": 6,
              "line-dasharray": [1, 0, 1, 0],
            },
          });
        });
      });
  };
  useEffect(() => {
    let map = tt.map({
      key: api_key,
      container: mapElement.current,
      center: [mapLongitude, mapLatitude], // Murtala Muhammed Airport
      zoom: zoom_level,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());

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

      // marker.on("dragend", () => {
      //   const getPosition = marker.getLngLat();
      //   setLatitude(getPosition.lat);
      //   setLongitude(getPosition.lng);

      //   //merkezi kaydırdıkça rastgele 5 nokta oluştur
      // });

      marker.setPopup(popup).togglePopup();
    };

    addMarker();

    setMap(map);
    return () => map.remove();
  }, []);
  useEffect(() => {
    if (map) {
      map.on("load", () => {
        waypoints.forEach((location) => {
          create_marker(location);
        });
      });
    }
  }, [map]);
  return (
    <div className="map_wrapper">
      <button
        className="btn"
        disabled={map == null ? true : false}
        onClick={optimize_routes}
      >
        Optimum Rotayı Oluştur
      </button>
      <div ref={mapElement} className="mapDiv" />
    </div>
  );
}
export default Map;
