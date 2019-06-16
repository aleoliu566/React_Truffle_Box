import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class UserInfo extends Component {
  render() {
    return (
      <div>
        <h2>年金-使用者資料</h2>
        <table>
          <thead>
            <tr>
              <td>被保人姓名</td>
              <td>使用者位址</td>
              <td>選擇方案</td>
              <td>付款</td>
              <td>被保人狀態</td>
              <td>被保人收到年金</td>
            </tr>
          </thead>
          <tbody>
            {this.props.insuranceUser.map((val, index) => {
              const payEnough = (val) => {
                return val ? <span>V</span> : <span>X</span>
              }
              const insuredStatus = (val) => {
                return val ? <span>活著</span> : <span>死亡</span>
              }
              
              return (
                <tr key={index}>
                  <td>{val.userName}</td>
                  <td> { val.userAddress } </td>
                  <td> { parseInt(val.program) + 1 } </td>
                  <td> { val.payEther} ({payEnough(val.payEnough)})</td>
                  <td> { insuredStatus(val.live) }</td>
                  <td> { val.annuityRecieve }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default withRouter(UserInfo);