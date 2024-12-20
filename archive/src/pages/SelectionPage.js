import React, { Component } from "react";
import SelectionBox from '../components/SelectionBox.js';

class SelectionPage extends Component{
  render() {
    return (
      <div className='mx-auto bg-dark-purple h-screen'>
        <div className="">
          <SelectionBox />
        </div>
      </div>
    );
  }
} 
  export default SelectionPage;