import React from "react";
import Title from '../components/Title.js';
import Logo from '../components/Logo.js';
import PlayButton from "../components/PlayButton.js";
import RuleBox from "../components/RuleBox.js";
import OptionsButton from "../components/OptionsButton.js";
function HomePage(props) {
  return (
    <div>
      <div className="absolute z-1 left-[-15rem] top-[-17rem] bg-dark-purple w-[100rem] h-[25rem] rotate-[340deg] border-[12px] border-white drop-shadow-xl" />
      <div className='z-1 bg-light-purple h-screen'>
        <div className='flex relative z-10 drop-shadow-xl'>
          <div className='relative top-10 left-10 drop-shadow-xl'>
            <Logo />
          </div>
          <div className='relative top-10 left-10 drop-shadow-xl'>
            <Title>celebrities</Title>
          </div>

        </div>
        <div className='absolute left-[800px] top-[50px] z-10'>
          <div className='w-3/4 justify-center font-title tracking-tight text-text-purple text-center text-6xl m-8 drop-shadow-xl'>
            how to play:
          </div>
          <div className='bg-dark-purple w-[35rem] rounded-3xl drop-shadow-xl'>
            <RuleBox><img className='h-20 min-w-[80px] m-8 drop-shadow-xl' src={require('../images/icon1.png')} alt='not found' /></RuleBox>
            <RuleBox><img className='h-20 min-w-[80px] m-8 drop-shadow-xl' src={require('../images/icon3.png')} alt='not found' /></RuleBox>
            <RuleBox><img className='h-20 min-w-[80px] m-8 drop-shadow-xl' src={require('../images/icon2.png')} alt='not found' /></RuleBox>
          </div>
        </div>
        <div className='bg-dark-purple absolute left-[160px] top-[400px] z-10 rounded-3xl drop-shadow-xl'>
          <div className='text-center font-title tracking-tight text-white text-6xl my-4 drop-shadow-xl'>
            start game:
          </div>
          <div onClick={() => props.handleButtonClick('lobby')} className='flex justify-center drop-shadow-xl hover:scale-105'>
            <PlayButton></PlayButton>
          </div>
          <div className='flex justify-center drop-shadow-xl'>
            <OptionsButton buttonText="Join Game"><img className='h-5 my-5 drop-shadow-xl' src={require('../images/icon5.png')} alt='not found' /></OptionsButton>
            <OptionsButton buttonText="Login"><img className='h-5 my-5 drop-shadow-xl' src={require('../images/icon4.png')} alt='not found' /></OptionsButton>
            <OptionsButton buttonText="Find Group"><img className='h-5 my-5 drop-shadow-xl' src={require('../images/icon1.png')} alt='not found' /></OptionsButton>
          </div>
        </div>

      </div>
    </div>
  );
}
export default HomePage;
