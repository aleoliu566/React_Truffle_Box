import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class PayMoney extends Component {
  state = {
    userSelectprogram: 0,
    programPay: [],
    payed: 0,
    age: null,
    quantity: 0,
  };

  componentDidMount = async () => {
    const program = await this.props.storage.methods.usersProgram(this.props.accounts[0]).call();
    const programPayStructure = await this.props.annuity.methods.returnProgramEtherArray().call();
    // 1100000

    const account = this.props.accounts[0];
    const birth = await this.props.storage.methods.usersBirth(account).call();
    const birthYear = parseInt(birth.slice(0,4));
    const thisYear = new Date().getFullYear();
    const age = thisYear - birthYear;

    const program2 = await this.props.storage.methods.usersProgram(account).call();
    let pay;
    if(age<=45){
      pay = await this.props.annuity.methods.getInsuranceData(program2,45).call();
    }else if(age>=65){
      pay = await this.props.annuity.methods.getInsuranceData(program2,65).call();
    }else{
      pay = await this.props.annuity.methods.getInsuranceData(program2,age).call();
    }
    const quantity = await this.props.storage.methods.usersAmount(account).call();

    this.setState({
      userSelectprogram: program,
      programPay: programPayStructure,
      userNeedTopay: programPayStructure[program],
      age,
      userNeedTopay2: pay,
      quantity: quantity,
    });
  };

  payAnnuity = async() => {
    await this.props.annuity.methods.userPayEtherToCompany(this.props.accounts[0]).send({
      from: this.props.accounts[0],
      value: this.state.userNeedTopay,
    });
  }

  payAnnuity2 = async() => {
    let age = this.state.age;
    if(this.state.age <= 45){
      age = 45;
    } else if(this.state.age >= 65){
      age = 65;
    }
    // console.log(this.state.userNeedTopay2);
    await this.props.annuity.methods.userPayEtherToCompany2(
      this.props.accounts[0],
      age
    ).send({
      from: this.props.accounts[0],
      value: this.state.userNeedTopay2* this.state.quantity,
    });
  }

  render() {
    const version = 2;
    if (this.state.userSelectprogram === 0) {
      return <h1>尚未選擇方案，請先選擇方案，謝謝！</h1>
    }

    if(this.props.accounts[0] === "0xb5E0c34C1215C776fcf17D4244B29A739E42fa09"){
      return (
        <div>
          <h1>要保人付款</h1>
          <p>您的帳號為 {this.props.accounts}</p>
          <p>您選擇的是<strong>方案 {this.state.userSelectprogram}</strong></p>
          <p>您所需要付的費用為 <strong>{this.state.userNeedTopay} 元</strong></p>
          <p>
            付款
            <input type="button" onClick={this.payAnnuity} value="年金給付" />
          </p>
        </div>
      )
    }

    if(version === 2){
      return (
        <div>
          <h1>要保人付款</h1>
          <p>您的帳號為 {this.props.accounts}</p>
          <p>您選擇的是<strong>方案 {this.state.userSelectprogram}</strong>，您的年齡是<strong>{this.state.age}歲</strong></p>
          <p>您購買了 <strong>{this.state.quantity} 份</strong>保險，每一份費用為 {this.state.userNeedTopay2} 元</p>
          <p>您所需要付的費用為 <strong>{this.state.userNeedTopay2*this.state.quantity} 元</strong></p>
          <p>
            付款
            <input type="button" onClick={this.payAnnuity2} value="年金給付" />
          </p>
        </div>
      )
    }

  }
}

export default withRouter(PayMoney);