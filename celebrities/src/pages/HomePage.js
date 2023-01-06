import React, { Component } from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';
import PlayButton from "../components/PlayButton.js";

class HomePage extends Component {
  render() {
    return (
      <div>
        <div className="absolute z-1 left-[-15rem] top-[-17rem] bg-dark-purple w-[100rem] h-[30rem] rotate-[340deg] border-[12px] border-white" />
        <div className='z-1 bg-light-purple h-screen'>
            <div className='flex relative z-10'>
              <div className='relative top-10 left-10'>
                <Logo/>
              </div>

              <Title/>
            </div>
        </div>
      </div>
    );
  }
}
export default HomePage;
