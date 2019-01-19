import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Main'
import Room from './Room'

class App extends Component {
  render() {
    return (
     <div>
        <Main/>
        <Room/>
  </div>
    );
  }
}

export default App;
