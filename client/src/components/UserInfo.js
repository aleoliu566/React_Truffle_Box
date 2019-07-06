import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const JSON_API = 'http://localhost:3001/faceId';

class UserInfo extends Component {
  state = {
    data: null,
  };

  componentDidMount = async () => {
    const data = await fetch(JSON_API).then(
      response => response.json()
    );

    this.setState({
      data,
    });
  }

  render() {
    return (
      <div>
        <h2>年金 - 被保人資料</h2>
        <table>
          <thead>
            <tr>
              <td>姓名</td>
              <td>身分證字號</td>
              <td>位址</td>
              <td>選擇方案</td>
              <td>購買份數</td>
              <td>繳交保費</td>
              <td>狀態</td>
              <td>收到年金</td>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.userData).map( (vals, index)=> {
              const val = this.props.userData[vals];
              const payEnough = (val) => { return val ? <span>V</span> : <span>X</span> }
              const insuredStatus = (val) => {
                return val ? <span>活著</span> : <span>死亡</span>
              }
              const programType = (val, addr) => {
                if(addr === "0xb5E0c34C1215C776fcf17D4244B29A739E42fa09"){
                  return (<span>{val}</span>)
                }
                if(val==1){
                  return (<span>年領</span>)
                } else if (val==2){
                  return (<span>月領</span>)
                }
              }

              const ss = (val, addr) => {
                if(addr === "0xb5E0c34C1215C776fcf17D4244B29A739E42fa09"){
                  return (<span>1</span>)
                }
                return(<span>{val}</span>)
              }

              return (
                <tr key={index}>
                  <td> { this.state.data[vals].name }</td>
                  <td> { val.id } </td>
                  <td> { val.address } </td>
                  <td> { programType(val.program, val.address) } </td>
                  <td> { ss(val.ammount, val.address) }</td>
                  <td> { val.payValue} ({payEnough(val.payEnough)})</td>
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