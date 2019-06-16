import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class FinishInsure extends Component {
  gameOver = async() => {
    console.log("hi");
    await this.props.annuity.methods.checkUserNotLive().send({ from: this.props.accounts[0] });;
  }

  render() {
    return (
      <div>
        <h1>結束年金保險合約</h1>
        <p>由於被保人死亡，因此保險公司可以按下下方按鈕結束此年金保險合約</p>
        <input type="button" onClick={this.gameOver} value="年金保險結束" />
      </div>
    )
  }
}

export default withRouter(FinishInsure);