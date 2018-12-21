import React from "react";
import "./trails.css";
import { geolocated } from "react-geolocated";
import axios from "axios";

const google = window.google;

class Map extends React.Component {
  state = {
    pos: {},
    streetStart: "",
    cityStart: "los angeles",
    zipStart: "",
    stateStart: "",
    locationStart: "",
    locationEnd: "",
    streetEnd: "",
    cityEnd: "pasadena",
    stateEnd: "",
    zipEnd: "",
    lat: "",
    lng: "",
    map: "",
    directionsService: "",
    directionsDisplay: "",
    distanceFromOne: ""
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
    this.getDistance();
  };

  calculatePoint = streetAddress => {
    try {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: streetAddress }, (results, status) => {
          // console.log(results);

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

  getDistance = () => {
    axios
      .get(
        "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" +
          this.state.cityStart +
          "& destinations=" +
          this.state.cityEnd +
          "&key=AIzaSyCUaQ1kZ14Pxb0rYNKBVspzxURR-DrEbuI"
      )
      .then(response => {
        console.log(response);
      });
  };

  calcDistance = () => {
    let coordsStart = this.state.positionOne;
    let index = this.state.markers.length - 1;
    let coordsEnd = this.state.markers[index].position;
    let distanceFromOne = (
      google.maps.geometry.spherical.computeDistanceBetween(
        coordsStart,
        coordsEnd
      ) / 1000
    ).toFixed(2);

    this.setState({ distanceFromOne }, () => {
      if (this.state.markers.length > 1) {
        this.setBounds();
      }
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col md-4" style={{ color: "white", maxWidth: "60%" }}>
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
              className="col md-4"
              style={{ height: "60vh" }}
              ref={this.containerRef}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  }
})(Map);
