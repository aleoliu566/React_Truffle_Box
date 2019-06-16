import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class SelectProgram extends Component {
  state = {
    userProgram: '',
    userValue: '',
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

  handleProgramChange = async (event) => {
    this.setState({ userProgram: event.target.value });
  };

  invokeState2 = async() => {
    await this.props.annuity.methods.selectProgram(
      this.state.userProgram-1,
    ).send({
      from: this.props.accounts[0],
      // value: payValue //單位是wei
    });
  }

  render() {
    return (
      <div>
        <h1>SelectProgram</h1>
        {this.state.programPay.map((val, index) => {
          return (
            <div key={index}>
              方案 {index+1}: {val} Wei
            </div>
          );
        })}
        <br/>
        選擇方案：<input type="text"
                    value={this.state.userProgram}
                    name="program"
                    onChange={this.handleProgramChange} />
        <input type="button" onClick={this.invokeState2} value="確認" />
      </div>
    )
  }
}

export default withRouter(SelectProgram);