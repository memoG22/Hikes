import React from "react";
import { Button, Col, Modal, Row } from "reactstrap";
import PropTypes from "prop-types";
import "./Geo.css";

// Takes the props: name, street, city, state as STRINGS.  Takes the prop zip as a NUMBER.

const google = window.google;

class GeoRouteToAddress extends React.Component {
  state = {
    backdrop: true,
    map: "",
    modal: true,
    directionsService: "",
    directionsDisplay: "",
    userPosition: "",
    travelMode: "DRIVING",
    positionDestination: "",
    zoom: 15,
    showDirections: false,
    markers: []
  };

  containerRef = React.createRef();
  directionsPanelRef = React.createRef();

  mountDiv = div => {
    if (div) {
      this.loadMap();
    }
  };

  reloadMap = () => {
    const map = new google.maps.Map(this.containerRef.current);
    this.setState({ map }, () => {
      this.calculateEndPoint();
    });
  };

  loadMap = () => {
    const { name, street, city, state, zip } = this.props;
    let streetAddress = `${street}, ${city}, ${state}, ${zip}`;
    const label = name;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: streetAddress }, (results, status) => {
      if (status === "OK") {
        const positionDestination = results[0].geometry.location;
        this.setState({ positionDestination }, () => {
          const myMap = {
            center: this.state.positionDestination,
            zoom: this.state.zoom
          };
          const map = new google.maps.Map(this.containerRef.current, myMap);
          this.setState({ map }, () => {
            this.addMarker(positionDestination, label);
          });
        });

        return;
      }
    });
  };

  addMarker = (location, label) => {
    let marker = new google.maps.Marker({
      position: location,
      map: this.state.map,
      title: label
    });
    const markers = [...this.state.markers, marker];
    this.setState({ markers });
  };

  calculateEndPoint = () => {
    const geocoder = new google.maps.Geocoder();
    const { street, city, state, zip } = this.props;
    let streetAddressEnd = `${street},${city},${state},${zip}`;
    geocoder.geocode({ address: streetAddressEnd }, (results, status) => {
      if (status === "OK") {
        const positionDestination = results[0].geometry.location;
        this.setState({ positionDestination }, () => {
          this.findUserPosition();
        });
      } else {
        console.log(status);
      }
    });
  };

  findUserPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.setState({ userPosition }, () => {
        this.calculateAndDrawRoute();
      });
    });
  };

  calculateAndDrawRoute = () => {
    const map = this.state.map;
    const userPosition = this.state.userPosition;
    const positionDestination = this.state.positionDestination;
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService.route(
      {
        origin: userPosition,
        destination: positionDestination,
        travelMode: this.state.travelMode
      },
      function(response, status) {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    directionsDisplay.setMap(map);
    this.setState({ map }, () => {
      directionsDisplay.setPanel(this.directionsPanelRef.current);
    });
  };

  onToggleRoute = () => {
    const modal = this.state.modal;
    this.setState({ modal: !modal });
  };

  onSelectTravelMode = travelMode => {
    document.getElementById("directions-panel").innerHTML = "";
    this.setState({ travelMode, map: [] }, () => {
      this.reloadMap();
    });
  };

  onCloseMainModal = () => {
    this.setState({ travelMode: "DRIVING" }, () => {
      this.onToggleRoute();
    });
  };

  onShowDirections = () => {
    this.setState({ showDirections: true }, () => {
      this.findUserPosition();
    });
  };

  onHideDirections = () => {
    document.getElementById("directions-panel").innerHTML = "";
    this.setState({ showDirections: false }, () => {
      this.setState({ map: [], travelMode: "DRIVING" }, () => {
        this.loadMap();
      });
    });
  };

  onClearMap = () => {
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

  render() {
    return (
      <>
        <a href="#" onClick={this.onToggleRoute}>
          <i className="ft ft-map-pin success " />{" "}
        </a>

        <Modal
          isOpen={this.state.modal}
          toggle={this.onToggleRoute}
          backdrop={this.state.backdrop}
          style={{ width: "1150px", maxWidth: "100vw" }}
        >
          <div className="root" ref={this.mountDiv}>
            <div className="address">
              <Row>
                {" "}
                <Col>
                  {this.state.showDirections && <span> Directions to: </span>}{" "}
                  {this.props.name}
                  {" - "} {this.props.street}
                  {", "}
                  {this.props.city}
                  {", "}
                  {this.props.state}
                  {"  "}
                  {this.props.zip}
                </Col>{" "}
                {!this.state.showDirections && (
                  <Col md="2">
                    <Button
                      outline
                      color="primary"
                      style={{ float: "right" }}
                      onClick={this.onShowDirections}
                    >
                      Directions
                    </Button>
                  </Col>
                )}
              </Row>
            </div>

            <div className="map" ref={this.containerRef} />
            {this.state.showDirections && (
              <>
                <div className="transit-modes">
                  <Button
                    outline
                    color="primary"
                    name="DRIVING"
                    value="DRIVING"
                    onClick={() => this.onSelectTravelMode("DRIVING")}
                    active={this.state.travelMode === "DRIVING"}
                    style={{ width: "60px", marginLeft: "0px" }}
                  >
                    <i className="fa fa-car" />
                  </Button>

                  <Button
                    outline
                    color="primary"
                    name="TRANSIT"
                    value="TRANSIT"
                    onClick={() => this.onSelectTravelMode("TRANSIT")}
                    active={this.state.travelMode === "TRANSIT"}
                    style={{ width: "60px", marginLeft: "7px" }}
                  >
                    <i className="fa fa-bus" />
                  </Button>
                  <Button
                    outline
                    color="primary"
                    name="BICYCLING"
                    value="BICYCLING"
                    onClick={() => this.onSelectTravelMode("BICYCLING")}
                    active={this.state.travelMode === "BICYCLING"}
                    style={{ width: "60px", marginLeft: "7px" }}
                  >
                    <i className="fa fa-bicycle" />
                  </Button>

                  <Button
                    outline
                    color="primary"
                    name="hideDirections"
                    onClick={() => this.onHideDirections()}
                    style={{ width: "60px", marginRight: "0", float: "right" }}
                  >
                    <i className="fa fa-times" />
                  </Button>
                </div>
                <div
                  className="directions"
                  id="directions-panel"
                  style={{ overflowY: "scroll" }}
                  ref={this.directionsPanelRef}
                />
              </>
            )}

            <div className="close-modal-btn">
              <Button
                className="btn btn-primary   "
                onClick={this.onCloseMainModal}
                style={{ width: "100%", display: "block" }}
              >
                <i className="fa fa-times-circle mr-2" />
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

GeoRouteToAddress.propTypes = {
  name: PropTypes.string,
  street: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.string
};

export default GeoRouteToAddress;
