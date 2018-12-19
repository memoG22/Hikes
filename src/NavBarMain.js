import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home";
import SignUp from "./Components/SignUp";
import Careers from "./Components/Careers";
import SearchTrails from "./Components/SearchTrails";
import Contact from "./Components/Contact";
import MapExample from "./Components/MapExample";

import Grid from "react-css-grid";

import {
  Col,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class NavBarMain extends Component {
  state = {
    toggle: false
  };

  toggle = () => {
    let toggle = this.state.toggle;
    this.setState({
      toggle: !toggle
    });
  };

  homeClick = () => {
    this.toggle();
  };

  industriesClick = () => {
    this.toggle();
  };

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col md-12">
            <Nav
              style={{
                position: "sticky",
                backgroundColor: "black",
                height: "10vh"
              }}
            >
              <div className="col md-3">
                <NavItem>
                  <Dropdown isOpen={this.state.toggle} toggle={this.toggle}>
                    <DropdownToggle caret />
                    <DropdownMenu>
                      <DropdownItem>
                        <NavLink to="/home">Home</NavLink>
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>
                        <NavLink to="/signup">Sign Up</NavLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </NavItem>
              </div>
              <div className="col md-3">
                <NavItem>
                  <NavLink
                    style={
                      {
                        // marginRight: "400px",
                        // color: "white"
                      }
                    }
                    to="/search/trails"
                  >
                    <h4 style={{}}>Search for Trails</h4>
                  </NavLink>
                </NavItem>
              </div>
              <div className="col md-3">
                <NavItem>
                  <NavLink
                    style={
                      {
                        // marginRight: "500px",
                        // color: "white"
                      }
                    }
                    to="/careers"
                  >
                    <h4 style={{}}>Careers</h4>
                  </NavLink>
                </NavItem>
              </div>

              <div className="col md-3">
                <NavItem>
                  <NavLink
                    style={
                      {
                        // marginRight: "500px",
                        // color: "white"
                      }
                    }
                    to="/contact"
                  >
                    <h4 style={{}}>Contact Us</h4>
                  </NavLink>
                </NavItem>
              </div>
            </Nav>
            <div>
              <Route exact path="/home" component={MapExample} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/search/trails" component={SearchTrails} />
              <Route exact path="/careers" component={Careers} />
              <Route exact path="/contact" component={Contact} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NavBarMain;
