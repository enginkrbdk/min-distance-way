import "./App.css";

import Map from "./Map";
const App = () => {
  return (
    <div className="wrapper">
      <main>
        <div className="wrapper_inner">
          <div id="lagos">
            <Map zoom_level={12} travel_mode="truck" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
