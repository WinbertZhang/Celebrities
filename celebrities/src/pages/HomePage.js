import React, { Component } from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';
import PlayButton from "../components/PlayButton.js";
import RuleBox from "../components/RuleBox.js";

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
            <div className='absolute left-[800px] top-[200px] z-10 border-white border-[5px]'>
              <div className='jusitfy-center font-title tracking-tight text-white text-8xl m-8'>
                how to play:
              </div>
              <div className=''>
                <RuleBox><img className='h-20 min-w-[80px]' src={require('../images/1.png')} alt='not found' /></RuleBox>
                <RuleBox><img className='h-20 min-w-[80px]' src={require('../images/1.png')} alt='not found' /></RuleBox>
                <RuleBox><img className='h-20 min-w-[80px]' src={require('../images/1.png')} alt='not found' /></RuleBox>
              </div>
            </div>
            <div className='absolute left-[200px] top-[400px] z-10 border-white border-[5px]'>
              <div className='jusitfy-center font-title tracking-tight text-white text-8xl m-8'>
                Start Game
              </div>
              <div className='flex justify-center'>
                <PlayButton></PlayButton>
              </div>
            </div>

        </div>
      </div>
    );
  }
}
export default HomePage;
