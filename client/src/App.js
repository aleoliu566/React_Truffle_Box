import React, { Component } from "react";
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import getWeb3 from "./utils/getWeb3";

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleSimpleContract from "./contracts/SimpleSimple.json";
import annuityContract from "./contracts/Annuity.json";

import Sidebar from './views/Sidebar';
import Home    from './views/Home';

import ImageInput    from './components/ImageInput';
import VideoInput    from './components/VideoInput';
import SelectProgram from './components/SelectProgram';
import Intro         from './components/Intro';
import UserInfo      from './components/UserInfo';
import PayMoney      from './components/PayMoney';
import FinishInsure  from './components/FinishInsure';

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    storageValue2: "",
    web3: null,
    accounts: null,
    contract: null,
    contract2: null,
    method: null,
    namee: "123",
    insuranceUser: [],
    insuranceName: [],
    newUser: '',

    annuityContractAddress: annuityContract['networks']['5777']['address'],
    annuityContractValue: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedNetwork2 = SimpleSimpleContract.networks[networkId];
      const instance2 = new web3.eth.Contract(
        SimpleSimpleContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      const deployedNetwork3 = annuityContract.networks[networkId];
      const instance3 = new web3.eth.Contract(
        annuityContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      const annuityContractValue = await instance3.methods.getBalance(instance3._address).call();
      // console.log(instance3._address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        contract2: instance2,
        annuity: instance3,
        annuityContractValue: annuityContractValue,
      });//, this.runExample);

      // 取得之前所有的event
      instance2.getPastEvents('cSet',{
        fromBlock: 0,
        toBlock: 'latest'
      }, (error, events) => {
        // console.log(events);
      });
      this.getUserData();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract, contract2 } = this.state;

  //   // await contract.methods.set(10).send({ from: accounts[0] });
  //   const response = await contract.methods.get().call();

  //   // const response2 = await contract2.methods.returnUint(891011).send({ from: accounts[0] });
  //   // await contract2.methods.returnUint("哭饅頭").send({ from: accounts[0] });

  //   const response2 = await contract2.methods.c().call();

  //   this.setState({
  //     storageValue: response,
  //     storageValue2: response2,
  //   });
  // };

  setValue = async () => {
    const { accounts, contract, contract2 } = this.state;
    // await contract.methods.hello(this.state.namee).send({ from: accounts[0] });
    // const response2 = await contract.methods.getHello().call();

    await contract2.methods.returnUint(this.state.namee).send({ from: accounts[0] });
    const response2 = await contract2.methods.c().call();

    this.setState({
      storageValue2: response2,
    });
  };

  getUserData = async () => {
    let insuranceData = [];
    const user_list = await this.state.annuity.methods.returnArray().call();
    
    for (var i=0; i<user_list.length; i++){
      const userData = await this.state.annuity.methods.usersData(user_list[i]).call();
      userData['ether'] = await this.state.annuity.methods.getBalance(userData.userAddress).call();;
      insuranceData.push(userData);
    }
    this.setState({
      insuranceUser: insuranceData,
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // Ether數量: {val.ether/1000000000000000000} <br/>
    return (
      <div className="App">
        <Sidebar
         annuityContractAddress = {this.state.annuityContractAddress}
         annuityContractValue ={this.state.annuityContractValue}
         insuranceUser = {this.state.insuranceUser}
        />

        <div className="container">
          <Router history={createHistory()}>
          <div>
            <Route path="/intro" render={props =><Intro name="Leo"/>} />
            <Route path="/photo" render={
              props =><ImageInput 
                       annuity={this.state.annuity}
                       accounts={this.state.accounts}/>
            } />
            <Route path="/selectProgram" render={
              props => <SelectProgram 
                        annuity={this.state.annuity}
                        accounts={this.state.accounts} />
            } />
            <Route path="/payMoney" render={
              props => <PayMoney 
                        annuity={this.state.annuity}
                        accounts={this.state.accounts}
                        insuranceUser = {this.state.insuranceUser}
                        getUser = {this.getUser} />
            } />
            <Route path="/camera" render={
              props => <VideoInput 
                        annuity={this.state.annuity}
                        accounts={this.state.accounts} />
            } />
            <Route path="/finishInsure" render={
              props => <FinishInsure 
                        annuity={this.state.annuity}
                        accounts={this.state.accounts} />
            } />
            <Route path="/userInfo" render={
              props => <UserInfo 
                        annuity={this.state.annuity}
                        accounts={this.state.accounts}
                        insuranceUser = {this.state.insuranceUser} />
            } />
            <Route path="/" render={
              props => <Home accounts={this.state.accounts} />
            } />
          </div>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
