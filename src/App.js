import "./App.css";
import Map from "./Map";

const App = () => {
  //istanbul için koordinat bilgisi lazım ve entity işaretci desteklemiyor
  const data_set_lagos = [
    { lng: 3.319332056, lat: 6.572997708, name: "Murtala Muhammed Airport" },
    { lng: 3.38499846, lat: 6.5166646, name: "University of Lagos - Unilag" },
    { lng: 3.42166498, lat: 6.416665, name: "Eko Atlantic" },
    { lng: 3.40083173, lat: 6.499998, name: "Third Mainland Bridge" },
    { lng: 3.3666652, lat: 6.4499982, name: "Apapa" },
    { lng: 3.450664864, lat: 6.434831594, name: "Palms Shopping Mall" },
    { lng: 3.3999984, lat: 6.4499982, name: "EAS Airlines Flight 4226" },
    { lng: 3.416831666, lat: 6.442998228, name: "Dodan Barracks" },
  ];

  return (
    <div className="wrapper">
      <main>
        <div className="wrapper_inner">
          <div id="lagos">
            <Map data={data_set_lagos} zoom_level={12} travel_mode="truck" />
          </div>
        </div>
        <div>
          <h1>enerji tasarruf hesaplama</h1>
        </div>
      </main>
      <div>
        <h1>co2 salınım hesaplama</h1>
      </div>
    </div>
  );
};

export default App;
