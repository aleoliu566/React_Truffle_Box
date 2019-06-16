import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import rocket from "../img/rocket.png";

class Navbar extends Component {
  render() {
    const style = {
      navbar: {
        backgroundColor: "#212529",
        color: "#fff",
        margin: 0,
        textAlign: "left",
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "60px",
      },
      title: {
        display: "inline-block",
        verticalAlign: "middle",
      },
      icon: {
        width: "30px",
        padding: "8px",
        verticalAlign: "middle",
      },
      address: {
        float: "right",
        position: "absolute",
        top: "18.5px",
        right: "8px",
        border: '1px solid orange',
        borderRadius: '3px',
        padding: '3px',
      }
    }
    return (
      <div style={style.navbar}>
        <img src={rocket} style={style.icon} alt='火箭起飛'/>
        <h3 style={style.title}> Modifiable Smart Contract Demo</h3>
        <span style={style.address}>你目前的位址： {this.props.accounts}</span>
      </div>
    )
  }
}

export default Navbar;