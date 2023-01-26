import React, { Component } from "react";
import Title from "../components/Title.js";
import Profile from "../components/Profile.js";

class Lobby extends Component{
  render() {
    return (
      <div className='mx-auto bg-light-purple h-screen'>
        <div className='relative top-10 left-10 w-[40rem]'>
          <Title>lobby</Title>
          <div className='bg-dark-purple'>
            Code: ASDF
          </div>
          <div className='rounded-sm bg-dark-purple'>
            <Profile></Profile>
          </div>

        </div>

      </div>
    );
  }
} 
  export default Lobby;