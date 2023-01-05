import React, { Component } from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';

class HomePage extends Component {
  render() {
    return (
      <div className='mx-auto bg-dark-purple h-screen'>
        <div className="absolute left-[-10rem] top-[-15rem] bg-light-purple w-[100rem] h-[30rem] rotate-[340deg]" />
        <div className='absolute left[0] top[0] w-[100rem] h-[30rem]'>
          <Title />
        </div>
      </div>
    );
  }
}
export default HomePage;
