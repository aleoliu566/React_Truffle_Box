import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';

// Import face profile
const JSON_PROFILE = require('../descriptors/faceData.json');

const WIDTH = 300;
const HEIGHT = 300;
const inputSize = 160;

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      second: 0,
      condition: "",
      realPerson: "none",
      type: "",
    };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE['faceId']) });
    this.setInputDevice();

    const program = await this.props.storage.methods.usersProgram(this.props.accounts[0]).call();
    let ammount = await this.props.storage.methods.usersAmount(this.props.accounts[0]).call();
    let typeProgram;
    if(program == 1){
      typeProgram = "年";
    } else{
      typeProgram = "月";      
    }

    this.setState({
      type: typeProgram,
      ammount: ammount,
      program: program,
    });
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        if (!!fullDesc) {
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
            descriptors: fullDesc.map(fd => fd.descriptor)
          });
        }
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        let match = await this.state.descriptors.map(descriptor =>
          this.state.faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }    

      const { accounts, storage, face, insuranceUser } = this.props;
      let newDescriptor = []

      // 比對合約上和資料庫中，同個人的臉是不是一樣的
      if(this.state.descriptors.length!==0 ){
        const nn = this.state.match[0]._label;
        const id = nn.slice(nn.indexOf("@")+1,);

        var foundfaceId = insuranceUser[0]

        if(foundfaceId == undefined ||
           foundfaceId[id] == undefined || 
           this.state.match[0]._label == "unknown"
        ){
          this.setState({
            condition: "不是本人喔",
            realPerson: "none",
          });
          return
        }

        if(foundfaceId[id].faceID!=undefined){
          const facee = foundfaceId[id].faceID[0];
          
          facee.forEach(function(ele,idx){
            newDescriptor.push(parseInt(ele*1000).toString());
          });
          const d = await face.methods.getUserFace(accounts[0]).call();

          if(this.arraysEqual(newDescriptor,d)){
            this.setState({ 
              condition: "是本人，可以領取年金！",
              realPerson: "inline-block",
            });
          }else{
            this.setState({
              condition: "不是本人喔！",
              realPerson: "none",
            });
          }
        }
      } else {
        this.setState({
          condition: "沒有人喔！",
          realPerson: "none",
        });        
      }
    }
  };


  getAnnuityAnnual = async () => {
    const {match} = this.state;
    const account = this.props.accounts[0];
    if(!!match && !!match[0]){
      await this.props.annuity.methods.companyPayAnnual(account).send({
        from: account
      });
    }
  };

  getAnnuityMonthly = async () => {
    const {match} = this.state;
    const account = this.props.accounts[0];
    if(!!match && !!match[0]){
      await this.props.annuity.methods.companyPayAnnual(account).send({
        from: account
      });
    }
  };

  getAnnuityBasic = async () => {
    const {match} = this.state;
    const account = this.props.accounts[0];
    await this.props.annuity.methods.companyPayBasic(account).send({
      from: account
    });
  }

  render() {
    const { detections, match, facingMode } = this.state;
    let videoConstraints = null;
    let camera = '';
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
      if (facingMode === 'user') {
        camera = 'Front';
      } else {
        camera = 'Back';
      }
    }

    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'blue',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: 'blue',
                    border: 'solid',
                    borderColor: 'blue',
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {match[i]._label.slice(0,match[i]._label.indexOf("@"))}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    const programExpress = (program) => {
      if(program == 1){
        return ( <div></div> )
      } else if(program == 2){
        return ( <div></div> )
      }
    }
    if(this.props.accounts[0] === "0xb5E0c34C1215C776fcf17D4244B29A739E42fa09"){
      return (
        <div>
          <h2>請您領取年金保險</h2>
          <input type="button" onClick={this.getAnnuityBasic} value="領取年金保險" />          
        </div>
      )
    }
    return (
      <div className="Camera">
        <h2>請您透過臉部辨識，領取年金保險</h2>
        <p style={{display:'none'}}>Camera: {camera}</p>
        <div>{programExpress(this.state.program)}</div>
        <p>您選擇的方案是 {this.state.type}領年金 1000元，購買 {this.state.ammount} 份，每{this.state.type}可以領取 {this.state.ammount * 1000 } 元</p>

        <div style={{ width: WIDTH, height: HEIGHT }}>
          <div style={{ position: 'relative', width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!drawBox ? drawBox : null}
          </div>
        </div>
        <div>
          <div>{this.state.condition}</div>
          <input style={{display:this.state.realPerson}} type="button" onClick={this.getAnnuityAnnual} value="領取年金保險" />
        </div>
      </div>
    );
  }
}

export default withRouter(VideoInput);