import React, { Component } from 'react'
import Web3 from 'web3'
import './Content.css'

class Content extends Component {

  

    constructor(props) {
        super(props)
        this.handleSubmit.bind(this)
        this.handleClick.bind(this)
        window.web3 = new Web3(window.ethereum);
    }

    handleSubmit=(e) => {
        e.preventDefault()
        let amount
        console.log(this.props)
        amount = this.input.value.toString()
        amount = window.web3.utils.toWei(amount, 'Ether')
        this.props.makeInvestment(amount)
      }

      handleClick=(event) => {
        event.preventDefault()
        this.props.withdraw()
      }

  render() {
    return (
      <div id="content" className="container">

        <table className="striped">
          <thead>
            <tr>
              <th>Investing Balance</th>
              <th>Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.totalInvestment)} iTokens</td>
              <td>{window.web3.utils.fromWei(this.props.rewardTokenBalance)} rTokens</td>
            </tr>
          </tbody>
        </table>

        <div className="card blue-grey darken-1 card-content white-text hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4" >
            
            <form className="col s12" onSubmit={this.handleSubmit}>
              <div>
                <label className="card-title card-content white-text">Available Tokens To Invest</label>
                <span className="card-title">
                  {window.web3.utils.fromWei(this.props.investorTokenBalance)}
                </span>
              </div>
              <div className="input-field col s6 center-align">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  placeholder="0"
                  required />
              </div>
              <button type="submit" className="btn waves-effect waves-light btn-large left">INVEST</button>
            </form>
            <button
              type="submit"
              className="waves-effect waves-light btn-large right"
              onClick={this.handleClick}>
                WITHDRAW...
              </button>
          </div>

      </div>
    );
  }
}

export default Content;