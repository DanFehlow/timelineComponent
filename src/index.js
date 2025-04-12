import React from "react";
import ReactDOM from "react-dom/client";
import Timeline from "./components/Timeline";

function App() {
  return (
    <div>
      {/* <h2>Good luck with your assignment! {"\u2728"}</h2> */}
      <h2 style={{ textAlign: "center" }}>Timeline Component {"\u2728"}</h2>
      <Timeline />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);