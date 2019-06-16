import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import Navbar from './Navbar';


export default class Home extends Component {
  render() {
    return(
      <div>
        <Navbar accounts= {this.props.accounts}/>
      </div>
    );
  }
}

// return (
//   <div>
//     <p>不知道怎麼移掉</p>
//     <li><Link to="/photo">Photo Input</Link></li>
//     <li><Link to="/camera">Video Camera</Link></li>
//     <li><Link to="/annuity">Annuity</Link></li>
//     <li><Link to="/test">Test</Link></li>
//   </div>
// );