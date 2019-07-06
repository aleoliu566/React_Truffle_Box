import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const JSON_API = 'http://localhost:3001/faceId';

class Transaction extends Component {
  state={
    tx: [],
  };
  componentDidMount = async () => {
    let tx;
    const data = await fetch(JSON_API).then(
      response => response.json()
    );
    await this.props.annuity.getPastEvents('annuityTx',{ fromBlock: 0, toBlock: 'latest' }, (error, events) => {
      this.setState({
        tx:events,
        data
      });
    });
    console.log(this.state.tx);
  }
  render() {
    return(
      <div>
        <h2>發放年金紀錄</h2>
        <table>
          <thead>
            <tr>
              <td width="50px"></td>
              <td>被保人姓名</td>
              <td>位址</td>
              <td>年金給付金額</td>
              <td>年金給付時間</td>
            </tr>
          </thead>
          <tbody>
          {
            this.state.tx.map((val, index) => {
              var offset = 8;
              var date = new Date(parseInt(val.returnValues._date)*1000 + offset * 3600 * 1000);
              const real_id = val.returnValues._id.slice(0,escape(val.returnValues._id).indexOf('%0'));

              return (
                <tr key={index}>
                  <td>Tx {index}</td>
                  <td>{this.state.data[real_id].name}</td>
                  <td>{val.returnValues._addr}</td>
                  <td>{val.returnValues._value}</td>
                  <td>{date.toUTCString().replace( / GMT$/, "")}</td>
                </tr>
              );
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default withRouter(Transaction);