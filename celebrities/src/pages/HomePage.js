import React, { Component } from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';

class HomePage extends Component {
  render() {
    return (
      <div className=''>
        <div className="mx-auto bg-dark-purple">
          <Logo />
          <Title />
        </div>
      </div>
    );
  }
}
export default HomePage;
