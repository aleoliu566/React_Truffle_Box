import React, { Component } from "react";
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import getWeb3 from "./utils/getWeb3";

// import SimpleSimpleContract from "./contracts/SimpleSimple.json";
import annuityContract from "./contracts/Annuity.json";
import annuity2Contract from "./contracts/Annuity2.json";
import storage from "./contracts/Storage.json";
import faceData from "./contracts/FaceData.json";

import Sidebar from './views/Sidebar';
import Home    from './views/Home';

import ImageInput    from './components/ImageInput';
import VideoInput    from './components/VideoInput';
import SelectProgram from './components/SelectProgram';
import Intro         from './components/Intro';
import PayMoney      from './components/PayMoney';
import FinishInsure  from './components/FinishInsure';
import UserInfo      from './components/UserInfo';
import Transaction   from './components/Transaction';
import BasicSet      from './components/BasicSet';

import "./App.css";

const JSON_API = 'http://localhost:3001/faceId';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    face: null,
    method: null,
    insuranceUser: [],
    userData: {},
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

      // const deployedNetwork2 = SimpleSimpleContract.networks[networkId];
      // const instance2 = new web3.eth.Contract(
      //   SimpleSimpleContract.abi,
      //   deployedNetwork2 && deployedNetwork2.address,
      // );

      // 取得之前所有的event
      // instance2.getPastEvents('cSet',{ fromBlock: 0, toBlock: 'latest' }, (error, events) => {
      //   console.log(events);
      // });

      const deployedNetwork3 = annuityContract.networks[networkId];
      const instance3 = new web3.eth.Contract(
        annuityContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      const deployedNetwork4 = annuity2Contract.networks[networkId];
      const instance4 = new web3.eth.Contract(
        annuity2Contract.abi,
        deployedNetwork4 && deployedNetwork4.address,
      );

      const storageContractData = storage.networks[networkId];
      const instance5 = new web3.eth.Contract(
        storage.abi,
        storageContractData && storageContractData.address,
      );

      const annuityContractValue = await instance3.methods.getBalance(instance3._address).call();

      const faceDataContract = faceData.networks[networkId];
      const faceInstance = new web3.eth.Contract(
        faceData.abi,
        faceDataContract && faceDataContract.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        annuity: instance3,
        annuity2: instance4,
        storage: instance5,
        face: faceInstance,
        annuityContractValue: annuityContractValue,
      }, this.getUsersData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getUsersData = async () => {
    const { storage } = this.state;

    let insuranceData = [];
    let userData = {};
    const allUserList = await storage.methods.returnArray().call();
    const userList = [...new Set(allUserList)]; 

    const data = await fetch(JSON_API).then(
      response => response.json()
    );

    for (var i=0; i<userList.length; i++){
      const name = await this.state.storage.methods.usersName(userList[i]).call();
      var id = await this.state.storage.methods.usersId(userList[i]).call();
      const birth = await this.state.storage.methods.usersBirth(userList[i]).call();
      const program = await this.state.storage.methods.usersProgram(userList[i]).call();
      const joinTime = await this.state.storage.methods.usersJoinTime(userList[i]).call();
      const payValue = await this.state.storage.methods.usersPayValue(userList[i]).call();
      const payEnough = await this.state.storage.methods.usersPayEnough(userList[i]).call();
      const live = await this.state.storage.methods.usersLive(userList[i]).call();
      const annuityRecieve = await this.state.storage.methods.usersAnnuityRecieve(userList[i]).call();
      const annuityPayTime = await this.state.storage.methods.usersAnnuityPayTime(userList[i]).call();
      const ammount = await this.state.storage.methods.usersAmount(userList[i]).call();
      const real_id = id.slice(0,escape(id).indexOf('%0'));
      let faceID;
      if(data[real_id] !== undefined){
        faceID = data[real_id].descriptors;
      }


      userData[real_id]={
        "address": userList[i],
        "name": name,
        "id": id,
        "birth": birth,
        "program": program,
        "joinTime": joinTime,
        "payValue": payValue,
        "payEnough": payEnough,
        "live": live,
        "annuityRecieve": annuityRecieve,
        "annuityPayTime": annuityPayTime,
        "faceID": faceID,
        "version": 2,
        "ammount": ammount,
      }
    }
    insuranceData.push(userData);

    // console.log(insuranceData);

    this.setState({
      insuranceUser: insuranceData,
      userData: userData,
    });
  };

  test = async () => {
    // const { accounts, storage } = this.state;
    // const x = this.state.web3.utils.fromAscii("20160528");
    // const z = this.state.web3.utils.fromAscii("[-0.1508369892835617]");//, 0.06637488305568695, 0.07129892706871033, -0.04746388643980026, -0.11599262058734894, -0.027404779568314552, -0.023511942476034164, -0.17204105854034424, 0.10350999236106873, -0.055438391864299774, 0.26959696412086487, -0.054088693112134933, -0.22942259907722473, -0.12324021756649017, -0.06760397553443909, 0.153450146317482, -0.1257581114768982, -0.12546955049037933, -0.0135041493922472, -0.04421490430831909, 0.13448256254196167, 0.013529632240533829, 0.06006525456905365, 0.06832551956176758, -0.0966404378414154, -0.30368223786354065, -0.12021192163228989, -0.06251216679811478, 0.001719065010547638, -0.031152138486504555, -0.06811107695102692, -0.008829699829220772, -0.1644929051399231, -0.022172320634126663, 0.0017943046987056732, 0.1229548454284668, 0.0006973394192755222, -0.09337273985147476, 0.12205217778682709, -0.015092391520738602, -0.20291529595851898, 0.010515774600207806, 0.05520296096801758, 0.20390813052654266, 0.21380466222763062, 0.06679624319076538, 0.034538671374320984, -0.1552097499370575, 0.08452673256397247, -0.12950469553470612, 0.060570381581783295, 0.13758906722068787, 0.08657662570476532, 0.023400455713272095, -0.013708054088056087, -0.1967138797044754, -0.020292125642299652, 0.11597740650177002, -0.04707475006580353, 0.0030470602214336395, 0.02805601805448532, -0.04452376067638397, 0.004663325846195221, -0.10714142769575119, 0.2362024486064911, 0.09328864514827728, -0.15175922214984894, -0.16614791750907898, 0.08844025433063507, -0.15424315631389618, -0.14338356256484985, 0.04136408492922783, -0.21115896105766296, -0.15502993762493134, -0.3397074341773987, 0.03545299172401428, 0.42008647322654724, 0.05004431679844856, -0.23054659366607666, 0.01988903433084488, -0.07188847661018372, 0.07391490042209625, 0.11179540306329727, 0.17075951397418976, -0.05647728592157364, 0.0541725680232048, -0.17484600841999054, -0.0759364515542984, 0.22802360355854034, -0.08884131163358688, -0.04750027507543564, 0.2593996226787567, -0.017456920817494392, 0.13495345413684845, 0.04779715836048126, 0.05511752516031265, -0.05922626703977585, 0.06588773429393768, -0.09391878545284271, -0.03660713508725166, 0.04067518934607506, -0.06956873834133148, 0.004716482944786549, 0.10220139473676682, -0.18721751868724823, 0.08889645338058472, -0.0024398374371230602, 0.08122385293245316, 0.005344647914171219, -0.05599362403154373, -0.1158134937286377, -0.04133716970682144, 0.14926095306873322, -0.21566380560398102, 0.18791463971138, 0.20841975510120392, 0.093678779900074, 0.15587781369686127, 0.19862183928489685, 0.11771734803915024, -0.01170330960303545, 0.007136425003409386, -0.15244132280349731, 0.04668058454990387, 0.08691038191318512, -0.06434978544712067, 0.0737452358007431, 0.05084925517439842]");
    // const b = await storage.methods.setName(z).send({ from: accounts[0] });
    // const a = await storage.methods.x().call()
  }

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
                       web3={this.state.web3}
                       annuity={this.state.annuity}
                       face={this.state.face}
                       accounts={this.state.accounts}/>
            } />
            <Route path="/selectProgram" render={
              props => <SelectProgram
                        web3={this.state.web3}
                        annuity={this.state.annuity}
                        annuity2={this.state.annuity2}
                        accounts={this.state.accounts}
                        storage={this.state.storage}
                        insuranceUser = {this.state.insuranceUser} />
            } />
            <Route path="/payMoney" render={
              props => <PayMoney 
                        annuity={this.state.annuity}
                        annuity2={this.state.annuity2}
                        accounts={this.state.accounts}
                        storage={this.state.storage}
                        insuranceUser = {this.state.insuranceUser}
                        face={this.state.face} />
            } />
            <Route path="/camera" render={
              props => <VideoInput 
                        annuity={this.state.annuity}
                        storage={this.state.storage}
                        face={this.state.face}
                        insuranceUser = {this.state.insuranceUser}
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
                        storage={this.state.storage}
                        insuranceUser = {this.state.insuranceUser}
                        userData={this.state.userData} />
            } />
            <Route path="/transaction" render={
              props => <Transaction
                        accounts={this.state.accounts}
                        insuranceUser = {this.state.insuranceUser}
                        annuity={this.state.annuity} />
            } />
            <Route path="/" render={
              props => <Home accounts={this.state.accounts} />
            } />
            <Route path="/basicSet" render={
              props => <BasicSet 
                        accounts={this.state.accounts}
                        annuity={this.state.annuity} 
                        storage={this.state.storage} />
            } />
          </div>
          </Router>
          <div>{
            // <input type="button" onClick={this.test} value="測試按鈕" />
          }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
