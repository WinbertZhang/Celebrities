import React, { Component } from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';

class HomePage extends Component {
  render() {
    return (
        <div className="mx-auto">
          <Logo />
          <Title />
        </div>
    );
  }
}
export default HomePage;
