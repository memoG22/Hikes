import React from "react";
import { Row, Col, Container, Card, Button, CardBody } from "reactstrap";

const google = window.google;

class GeoMessaging extends React.Component {
  state = {
    street: "",
    city: "",
    st8: "",
    zip: "",
    street2: "",
    city2: "",
    st82: "",
    zip2: "",
    name: "",
    lat: 33.9,
    lng: -118.2437,
    lat2: 35.0001,
    lng2: -120.0001,
    distanceFromOne: "",
    zoom: 10,
    locations: [],
    distance: 0,
    map: "",
    radius: 1,
    markers: [],
    locationOneCoords: "",
    positionOne: "",
    latLast: "",
    lngLast: "",
    lines: []
  };

  containerRef = React.createRef();

  componentDidMount = () => {
    this.loadMap();
  };

  loadMap = () => {
    const { lat, lng } = this.state;
    let myLatlng = { lat, lng };
    const myMap = {
      center: myLatlng,
      zoom: this.state.zoom
    };
    const map = new google.maps.Map(this.containerRef.current, myMap); // create map instance and place the map in containerRef
    map.addListener("click", event => {
      this.setState({ locationOneCoords: event.latLng }, () => {
        this.addMarker(event.latLng);
      });
    });
    this.setState({ map });
  };

  addMarker = location => {
    let marker = new google.maps.Marker({
      position: location,
      map: this.state.map,
      animation: google.maps.Animation.DROP
    });
    const latLast = location.lat().toFixed(6);
    const lngLast = location.lng().toFixed(6);
    this.setState({ latLast, lngLast });
    const markers = [...this.state.markers, marker];
    this.setState({ markers }, () => {
      this.calcDistance();
    });

    const line = new google.maps.Polyline({
      path: [location, this.state.positionOne],
      strokeColor: "#00F",
      strokeWeight: 2,
      strokeOpacity: 0.8,
      map: this.state.map
    });

    let lines = this.state.lines;
    lines = [...lines, line];
    this.setState({ lines }, () => {});
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

  onDisplayLocationOne = () => {
    const map = this.state.map;
    const { street, city, zip } = this.state;
    const state = this.state.st8;
    let streetAddress = `${street}, ${city}, ${state},${zip}`;
    const label1 = "Location One";
    const geocoder = new google.maps.Geocoder();
    this.geocodeAddress(map, geocoder, streetAddress, label1);
  };

  // here, call geocode function on geocoder object created earlier.
  geocodeAddress = (map, geocoder, streetAddress, label) => {
    geocoder.geocode({ address: streetAddress }, (results, status) => {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location); // re-set center of map to this new location
        const positionOne = results[0].geometry.location;
        this.setState({ positionOne }, () => {
          // new google.maps.Marker({
          //   // create and place a marker to the new location
          //   map: map,
          //   position: results[0].geometry.location,
          //   title: label,
          //   animation: google.maps.Animation.DROP
          // });
          this.addMarker(positionOne);
        });

        return; // return to terminate
      }
    });
  };

  onClearMap = () => {
    // alert("Clearing " + numberMarkers + " objects and " + numberLines + " lines");
    let markers = this.state.markers;
    let lines = this.state.lines;
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (let i = 0; i < lines.length; i++) {
      lines[i].setMap(null);
    }
    markers = [];
    lines = [];
    this.setState({ markers, lines });
  };

  setBounds = () => {
    let map = this.state.map;
    const markersArray = this.state.markers;
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markersArray.length; i++) {
      bounds.extend(markersArray[i].getPosition());
    }
    map.fitBounds(bounds);
    this.setState({ map });
  };

  onChangeStreet = e => {
    const street = e.target.value;
    this.setState({ street });
  };

  onChangeCity = e => {
    const city = e.target.value;
    this.setState({ city });
  };

  onChangeSt8 = e => {
    const st8 = e.target.value;
    this.setState({ st8 });
  };

  onChangeZip = e => {
    const zip = e.target.value;
    this.setState({ zip });
  };

  onChangeStreet2 = e => {
    const street2 = e.target.value;
    this.setState({ street2 });
  };

  onChangeCity2 = e => {
    const city2 = e.target.value;
    this.setState({ city2 });
  };

  onChangeSt82 = e => {
    const st82 = e.target.value;
    this.setState({ st82 });
  };

  onChangeZip2 = e => {
    const zip2 = e.target.value;
    this.setState({ zip2 });
  };

  onChangeName = e => {
    const name = e.target.value;
    this.setState({ name });
  };

  onChangeRadius = e => {
    const radius = e.targe.value;
    this.setState({ radius });
  };

  render() {
    return (
      <>
        <Container>
          <Row>
            <Col md="6">
              <Card>
                <div
                  style={{ width: "100%", height: "59vh" }}
                  ref={this.containerRef}
                />
                <CardBody />
                <Button
                  className="btn btn-primary mt-2"
                  onClick={this.onClearMap}
                >
                  <i className="fa fa-times-circle mr-2 " />
                  Clear Map
                </Button>
              </Card>
            </Col>

            <Col md="5">
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col>
                          <h5> Location One </h5>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="street">Street: </label>
                        </Col>
                        <Col>
                          <input
                            type="text"
                            name="street"
                            value={this.state.street}
                            onChange={this.onChangeStreet}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="city">City:</label>
                        </Col>
                        <Col>
                          <input
                            type="text"
                            name="city"
                            value={this.state.city}
                            onChange={this.onChangeCity}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="st8">State:</label>
                        </Col>
                        <Col>
                          <input
                            type="text"
                            name="st8"
                            value={this.state.st8}
                            onChange={this.onChangeSt8}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="zip">Zip:</label>
                        </Col>
                        <Col>
                          <input
                            type="number"
                            name="zip"
                            value={this.state.zip}
                            onChange={this.onChangeZip}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="radius">Radius</label>
                        </Col>
                        <Col>
                          <input
                            tpe="number"
                            name="radius"
                            value={this.state.radius}
                            onChange={this.onChangeRadius}
                          />
                        </Col>
                      </Row>{" "}
                    </CardBody>

                    <Button
                      className="btn btn-success mt-2 mb-0"
                      onClick={this.onDisplayLocationOne}
                    >
                      <i className="fa fa-search mr-2" />
                      Display Location One
                    </Button>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col>
                          <h5> Location Two </h5>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="8">Lattitude</Col>
                        <Col>{this.state.latLast}</Col>
                      </Row>
                      <Row>
                        <Col md="8">Longitute</Col>
                        <Col>{this.state.lngLast}</Col>
                      </Row>
                      <Row>
                        <Col md="8">Distance from Location One:</Col>
                        <Col>{this.state.distanceFromOne}</Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default GeoMessaging;
