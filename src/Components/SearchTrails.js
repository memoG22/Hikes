import React from "react";
import Map from "./Map";
import Styles from "./Trails.module.css";
function SearchTrails() {
  return (
    <React.Fragment>
      <div style={{}} className={Styles.background}>
        <div className="row">
          <div
            className="col md-4"
            style={{
              color: "white",
              textAlign: "center"
            }}
          >
            <h1>Search Trails</h1>
          </div>
        </div>
        <div className="row">
          <div className="col md-4">
            <Map />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default SearchTrails;
