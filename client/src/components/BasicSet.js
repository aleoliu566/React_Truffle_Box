import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class BasicSet extends Component {
  state={
    storageAddress: "",
  };

  handleStorageContract = async (event) => {
    this.setState({ storageAddress: event.target.value });
  };

  handleuserIDChange = async (event) => {
    this.setState({ userId: event.target.value });
  };

  setStorageContract = async () => {
    const storageAddress = this.props.storage._address;
    this.props.annuity.methods.setStorageContract(storageAddress).send({
      from: this.props.accounts[0],
    });
  };

  render() {
    return (
      <div>
        <span>
          <strong>主合約連接儲存合約</strong> 
          <input type="button" onClick={this.setStorageContract} value="確認" />
        </span>



      </div>
    )
  }
}

export default withRouter(BasicSet);

//        <br/>
//        <h3>建立FSM關聯</h3>
//        更新或刪除：<input type="text" value={this.state.userName} onChange={this.handleNameChange} /> <br/>
//        state：<input type="text" value={this.state.state} onChange={this.handleStateChange} /> <br/>
//        nextState：<input type="text" value={this.state.nextState} onChange={this.handleNextStateChange} /> <br/>
//        eventId：<input type="text" value={this.state.eventId} onChange={this.handleEventIdChange} /> <br/>
//        functionName：<input type="text" value={this.state.functionName} onChange={this.handleFunctionNameChange} /> <br/>
//        address：<input type="text" value={this.state.address} onChange={this.handleAddressChange} /> <br/>
//        complete version update：<input type="text" value={this.state.completOrNot} onChange={this.handleCompletOrNotChange} /> <br/>
//        <h3>加入使用者</h3>
