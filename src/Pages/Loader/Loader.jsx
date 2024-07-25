import { useState } from "react";
import "./Loader.css"
import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
//   let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div className="sweet-loading">
      {/* <button onClick={() => setLoading(!loading)}>Toggle Loader</button> */}
      {/* <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" /> */}
      <BeatLoader
        className="loader"
        color={color}
        // loading={loading}
        cssOverride={override}
        size={32}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;