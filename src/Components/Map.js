import React from "react";
import "./trails.css";
import { Container, Row, Col } from "react-grid-system";
import { geolocated } from "react-geolocated";

const google = window.google;

class Map extends React.Component {
  state = {
    pos: {},
    streetStart: "",
    cityStart: "",
    zipStart: "",
    stateStart: "",
    locationStart: "",
    locationEnd: "",
    streetEnd: "",
    cityEnd: "",
    stateEnd: "",
    zipEnd: "",
    lat: "",
    lng: "",
    map: "",
    directionsService: "",
    directionsDisplay: ""
  };

  containerRef = React.createRef();

  componentDidMount() {
    this.loadMap();
    this.onPlotUserLocation();
  }
  componentDidUpdate() {
    this.onPlotUserLocation();
  }
  loadMap = pos => {
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(this.containerRef.current, {
      center: pos,
      zoom: 12
    });
    directionsDisplay.setMap(map);
    this.setState({ map, directionsService, directionsDisplay });
  };

  onPlotUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.setState({
        lat: pos.lat,
        lng: pos.lng,
        pos
      });
      this.loadMap(pos);
    });
  };

  onPlotRoute = async () => {
    const { streetStart, cityStart, stateStart, zipStart } = this.state;
    const { streetEnd, cityEnd, stateEnd, zipEnd } = this.state;
    let streetAddressStart = `${streetStart},${cityStart},${stateStart},${zipStart}`;
    let streetAddressEnd = `${streetEnd},${cityEnd},${stateEnd},${zipEnd}`;
    const locationStart = await this.calculatePoint(streetAddressStart);
    const locationEnd = await this.calculatePoint(streetAddressEnd);
    this.calculateAndDrawRoute(locationStart, locationEnd);
  };

  calculatePoint = streetAddress => {
    try {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: streetAddress }, (results, status) => {
          if (status === "OK") {
            const geoLocal = results[0].geometry.location;
            resolve(geoLocal);
          } else {
            reject(status);
          }
        });
      });
    } catch {
      console.log("error error blah blah ");
    }
  };

  calculateAndDrawRoute = (locationStart, locationEnd) => {
    const directionsService = this.state.directionsService;
    const directionsDisplay = this.state.directionsDisplay;
    directionsService.route(
      {
        origin: locationStart, // replace with locationStart
        destination: locationEnd, // replace with locationEnd
        travelMode: "DRIVING"
      },
      function(response, status) {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            color: "white",
            textAlign: "center"
          }}
        >
          <h1>Search Trails</h1>
        </div>
        <Container>
          <Col>
            <div
              style={{
                color: "white",
                marginLeft: "70%"
              }}
            >
              <h2>Search trails near you</h2>

              <input
                style={{ marginTop: "5%" }}
                type="text"
                name="cityEnd"
                placeholder="To"
                onChange={this.onChange}
              />
              <input
                type="text"
                name="cityStart"
                placeholder="From"
                onChange={this.onChange}
              />
              <br />
              <button type="button" onClick={this.onPlotRoute}>
                {" "}
                Search{" "}
              </button>
              <div
                style={{ width: "170%", height: "60vh" }}
                ref={this.containerRef}
              />
            </div>
          </Col>
        </Container>
      </React.Fragment>
    );
  }
}
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  }
})(Map);
