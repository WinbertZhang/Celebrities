import React, { Component } from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';

class HomePage extends Component {
  render() {
    return (
      <div className='mx-auto bg-light-purple h-screen'>
        <div className="absolute left-[-15rem] top-[-17rem] bg-dark-purple w-[100rem] h-[30rem] rotate-[340deg] border-4 border-white" />
        <div className='absolute left[0] top[0] w-[100rem] h-[30rem]' style={{ display: 'flex' }}>
        <Logo />
        <Title />
        </div>
      </div>
    );
  }
}
export default HomePage;
