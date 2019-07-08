import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class SelectProgram extends Component {
  state = {
    userProgram: '',
    programPay: [],
    newProgramPay: {},
    age: null,
    userQuantity: 0,
  };

  componentDidMount = async () => {
    const programPayStructure = await this.props.annuity.methods.returnProgramEtherArray().call();

    let newProgram = {};
    const program = [1,2];
    const year = [50,55,60];
    let z = {};
    for(var i = 1; i <=program.length; i++){
      for(var j=45; j <= 65; j++){
        z[j] = await this.getInsuranceValue(i,j);
        newProgram[i] = Object.assign({}, z);
      }
    }

    const account = this.props.accounts[0];
    const birth = await this.props.storage.methods.usersBirth(account).call();
    const birthYear = parseInt(birth.slice(0,4));
    const thisYear = new Date().getFullYear();
    const age = thisYear - birthYear;

    this.setState({
      programPay: programPayStructure,
      newProgramPay: newProgram,
      age: age,
    });
  };

  getInsuranceValue = async(_program, _age) =>{
    return await this.props.annuity.methods.getInsuranceData(_program,_age).call();
  };

  handleProgramChange = async (event) => {
    this.setState({ userProgram: event.target.value });
  };

  handleQuantityChange = async (event) => {
    this.setState({ userQuantity: event.target.value });
  };

  selectProgram = async() => {
    await this.props.annuity.methods.selectProgram(
      this.props.accounts[0],
      this.state.userProgram,
    ).send({
      from: this.props.accounts[0],
    });
  }

  selectProgram2 = async() => {
    await this.props.annuity.methods.selectProgram(
      this.props.accounts[0],
      this.state.userProgram,
    ).send({
      from: this.props.accounts[0],
    });
  }

  selectQuantity = async() => {
    // console.log(this.state.userQuantity, typeof(this.state.userQuantity));
    // console.log(this.props.accounts[0], this.state.userQuantity);
    const quintity = parseInt(this.state.userQuantity);
    await this.props.annuity.methods.selectQuantity(
      this.props.accounts[0],
      quintity,
    ).send({
      from: this.props.accounts[0],
    });    
  }

  render() {

    if(this.props.accounts[0] === ""){
      return (
        <div>
          <h1>請選擇年金保險的方案</h1>
          {this.state.programPay.map((val, index) => {
            if (index !== 0){
              return ( <div key={index}> 方案 {index}: {val} 元</div> );
            }
          })}
          <br/>
          選擇方案：<input type="text"
                      value={this.state.userProgram}
                      name="program"
                      onChange={this.handleProgramChange} />
          <input type="button" onClick={this.selectProgram} value="確認" />
        </div>
      )
    }

    const version = 2;
    if(version === 2){
      return(
        <div>
          <h1>請選擇年金保險的方案</h1>
          { 
            Object.keys(this.state.newProgramPay).map( (key, index)=> {
            let keyWord = (index == 1) ? "月" : "年";
            return (
              <table width="60%" style={{marginBottom:'5px', marginRight:'5px', display: 'inline-block', width: '200px'}} key={index}>
                <thead>
                  <tr>
                    <td colSpan="2">方案 {key} ({keyWord}領 1000元)</td>
                  </tr>
                  <tr>
                    <td width="20%">年齡</td>
                    <td width="30%">費用</td>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this.state.newProgramPay[key]).map( (key2, idx)=> {
                    let aboveAndBelow;
                    if(key2==45){
                      aboveAndBelow = "(低於)";
                    }else if(key2==65){
                      aboveAndBelow = "(高於)";
                    }
                    return (
                    <tr key={idx}>
                      <td>{key2} {aboveAndBelow}</td>
                      <td>{this.state.newProgramPay[key][key2]} 元</td>
                    </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            )
          })
        }
        <br/>
        您現在<strong>{this.state.age}歲</strong>，請填入您想選擇的方案<br/>
        選擇（1）年領或是（2）月領：<input type="text"
                    value={this.state.userProgram}
                    onChange={this.handleProgramChange} />
        <input type="button" onClick={this.selectProgram2} value="確認" />
        <br/>
        購買幾分保險：<input type="text"
                    value={this.state.userQuantity}
                    onChange={this.handleQuantityChange} />
        <input type="button" onClick={this.selectQuantity} value="確認" />

        </div>
      )
    }


  }
}

export default withRouter(SelectProgram);