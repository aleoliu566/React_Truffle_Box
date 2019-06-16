import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';

// Import face profile & test picture
const JSON_PROFILE = require('../descriptors/faceData.json');
const testImg = require('../img/test.jpg');
const JSON_API = 'http://localhost:3001/faceId';

// Initial State
const INIT_STATE = {
  imageURL: testImg, //null,
  fullDesc: null,
  detections: null,
  descriptors: null,
  match: null,
  dimensions: {},
  userName: "",
  userId: "",
  userAddress: "",
  userBirth: "",
};

class ImageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INIT_STATE, faceMatcher: null };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE['faceId']) });
    await this.handleImage(this.state.imageURL);
  };

  handleImage = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      if (!!fullDesc) {
        this.setState({
          fullDesc,
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
  };

  handleFileChange = async event => {
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImage();
  };

  resetState = () => {
    this.setState({ ...INIT_STATE });
  };

  onImgLoad = ({target:img}) => {
    var imgs = new Image();
    imgs.src = this.state.imageURL;
    this.setState({dimensions:{height:imgs.height,
                               width:imgs.width}});
  };

  handleNameChange = async (event) => {
    this.setState({ userName: event.target.value });
  };

  handleuserIDChange = async (event) => {
    this.setState({ userId: event.target.value });
  };

  handleuserBirthChange = async (event) => {
    this.setState({ userBirth: event.target.value });
  };

  handleuserAddressChange = async (event) => {
    this.setState({ userAddress: event.target.value });
  };


  // 有修改空間，有空再研究
  // 1. 改成使用資料庫儲存
  // 2. 一個人好像可以存好幾個臉的陣列，但是目前只存一種
  clickAddUserPicButton = async (event) => {
    let descriptorA = this.state.fullDesc[0].descriptor;
    let descriptor = [];

    for (let i = 0; i < descriptorA.length; ++i){
      descriptor[i] = descriptorA[i];
    }

    let userID = this.state.userId;
    let newData = {}
    newData[userID] = {
      "name": this.state.userName,
      "descriptors": [descriptor],
    }

    const data = await fetch(JSON_API).then(
      response => response.json()
    );
    data[userID] = newData[userID];

    fetch(JSON_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    await this.props.annuity.methods.setuserData(
      this.state.userName,
      this.state.userAddress,
      this.state.userBirth
    ).send({ from: this.props.accounts[0] });
  };

  render() {
    const { imageURL, detections, match } = this.state;
    const userPictureWidth = 400;
    const style = {
      userPictureWidth: {
        width: `${userPictureWidth}px`,
      }
    }
    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {

        let adjust = userPictureWidth/this.state.dimensions.width;

        let _H = detection.box.height * adjust;
        let _W = detection.box.width * adjust;
        let _X = detection.box._x * adjust;
        let _Y = detection.box._y * adjust;

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
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return (
      <div>
        <h3>Step 1: 輸入基本資料</h3>
        使用者姓名：
        <input type="text" value={this.state.userName} 
               onChange={this.handleNameChange} />
        <br/>
        使用者位址：
        <input type="text" value={this.state.userAddress} 
               onChange={this.handleuserAddressChange} />
        <br/>
        身份證字號：
        <input type="text" value={this.state.userID} 
               onChange={this.handleuserIDChange} />
        <br/>
        出生年月日：
        <input type="text" value={this.state.userBirth} 
               onChange={this.handleuserBirthChange} />
        <br/>
        照片：<input id="myFileUpload" type="file" onChange={this.handleFileChange} accept=".jpg, .jpeg, .png" />
        <br/>
        <input type="button" value="確認" onClick={this.clickAddUserPicButton}/>

        <div style={{ position: 'relative', 'marginTop': '20px'}}>
          <div style={{ position: 'absolute' }}>
            <img onLoad={this.onImgLoad} 
                 src={imageURL}
                 alt="imageURL"
                 style={style.userPictureWidth}/>
          </div>
          {!!drawBox ? drawBox : null}
        </div>
      </div>
    );
  }
}

export default withRouter(ImageInput);