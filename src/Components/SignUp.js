import React from "react";

class SignUp extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <h1 style={{ color: "white", textAlign: "center" }}>Sign Up</h1>
        </div>
        <div>
          <button
            style={{ size: "", backgroundColor: "FFFFFF", color: "black" }}
            onClick={this.handleSignUp}
          >
            Sign Up
          </button>{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp;
