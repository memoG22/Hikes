import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";
import "./App.css";

import NavBarMain from "./NavBarMain";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class App extends Component {
  state = {
    toggle: false
  };

  toggle = () => {
    let toggle = this.state.toggle;
    this.setState({
      toggle: !toggle
    });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <NavBarMain />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
