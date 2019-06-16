import React, { Component } from 'react';
import { Router, Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

class Sidebar extends Component {
  render() {
    const style = {
      sidebar: {
        position: 'fixed',
        top: '60px',
        left: '0px',
        width: '320px',
        height: 'calc( 100vh - 60px )',
        borderRight: '1px solid lightgrey',
        boxSizing: 'border-box',
        textAlign: 'Left',
        padding: '10px',
        backgroundColor: "#F8F8FF",
      },
      userData: {
        padding: 0,
        fontSize: '9pt',
      },
      userDataLi: {
        'listStyleType': 'none',
        'paddingBottom': '10px',
      }
    }
    return (
      <div style={style.sidebar}>
        <div>
          <li><a href="/intro">年金保險合約介紹</a></li>
          <li><a href="/photo">第一步：輸入基本資料</a></li>
          <li><a href="/selectProgram">第二步：選擇保險方案</a></li>
          <li><a href="/payMoney">第三步：付年金費用</a></li>
          <li><a href="/camera">第四步：臉部辨識領取年金</a></li>
          <li><a href="/finishInsure">第五步：年金結束</a></li>

          <hr/>
          <li><a href="/annuity">Annuity</a></li>
          <li><a href="/userInfo">使用者資料</a></li>
        </div>

        <hr/>
        <h3>年金保險合約的狀態</h3>
        <p>保險合約的位址：</p>
        <p style={{fontSize: '9pt'}}>{this.props.annuityContractAddress}</p>
        <p>年金保險合約Ether：{this.props.annuityContractValue} Wei</p>
        <p></p>
        {
        //   <ul style={style.userData}>{
        //       this.props.insuranceUser.map((val, index) => {
        //         return ( <li key={index} style={style.userDataLi}> 
        //                     被保人姓名：{ val.userName } { val.annuityRecieve } <br/>
        //                     { val.userAddress }
        //                  </li>
        //                );
        //       })
        //   }</ul>
        }









        {
          // 用react-router-dom沒有用，有可能是因為web3的關係
        }
        <div style={{display:'none'}}>
          <Router history={createHistory()}>
            <li><Link to="/photo">Photo Input</Link></li>
            <li><Link to="/camera">Video Camera</Link></li>
            <li><Link to="/annuity">Annuity</Link></li>
          </Router>
        </div>
      </div>
    )
  }
}

export default Sidebar;