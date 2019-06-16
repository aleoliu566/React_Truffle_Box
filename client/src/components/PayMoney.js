import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class PayMoney extends Component {
  state = {
    programPay: [],
    payed: 0,
  };

  componentDidMount = async () => {
    const programPayStructure = await this.props.annuity.methods.returnProgramEtherArray().call();
    const data = await this.props.annuity.methods.usersData(this.props.accounts[0]).call();
    const payedEther = data.payEther;
    this.setState({
      programPay: programPayStructure,
      payed: payedEther,
    });
  };

  payAnnuity = async() => {
    let payValue;
    for( let i=0; i<this.props.insuranceUser.length; i++){
      if(this.props.insuranceUser[i].userAddress === this.props.accounts){
        let program = this.props.insuranceUser[i].program;
        payValue = this.state.programPay[program-1];
        break;
      };
    }
    console.log(payValue);

    await this.props.annuity.methods.userPayEtherToCompany().send({
      from: this.props.accounts[0],
      value: payValue
    });
  }

  render() {
    let program = null;
    for( let i=0; i<this.props.insuranceUser.length; i++){
      if(this.props.insuranceUser[i].userAddress === this.props.accounts){
        program = this.props.insuranceUser[i].program;
        break;
      };
    }
    return (
      <div>
        <h1>請付款</h1>
        <p>您的帳號為 {this.props.accounts}</p>
        <p>您選擇的方案為 {program}</p>
        <p>您所需要付的費用為 {this.state.programPay[program-1]} Wei</p>
        <p>
          付款
          <input type="button" onClick={this.payAnnuity} value="年金給付" />
        </p>
      </div>
    )
  }
}

export default withRouter(PayMoney);