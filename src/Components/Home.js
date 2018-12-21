import React from "react";
import MapExample from "./MapExample";
import Styles from "./Trails.module.css";

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={Styles.background}>
          <h1 style={{ color: "white", textAlign: "center" }}>Home</h1>
        </div>
        {/* <div>
          <MapExample
            street="slauson"
            zip="90232"
            name="whatever"
            city="los angeles"
          />
        </div> */}
      </React.Fragment>
    );
  }
}

export default Home;
