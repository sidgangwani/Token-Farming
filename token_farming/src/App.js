import React, { Component } from 'react'
import Web3 from 'web3'
import InvestorToken from './abis/InvestorToken.json'
import RewardToken from './abis/RewardToken.json'
import TokenFarm from './abis/TokenFarm.json'
import Navbar from './Navbar'
import Content from './Content'

class App extends Component {
  
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  
  async loadBlockchainData(){
    window.web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts[0]);
    
    this.setState({
      account:accounts[0]
    })

    const id= await window.ethereum.request({ method: 'net_version' });
    console.log(id);

    const investorTokenData = InvestorToken.networks[id];
    if(investorTokenData) {
      const investorToken = new window.web3.eth.Contract(InvestorToken.abi, investorTokenData.address);
      this.setState({ 
        investorToken 
      })
      let investorTokenBalance = await investorToken.methods.balanceOf(this.state.account).call();
      this.setState({ 
        investorTokenBalance: investorTokenBalance.toString() 
      })
      console.log(investorTokenBalance);
    } else {
      window.alert('Investment Token Contract is not Deployed.')
    }

    const rewardTokenData = RewardToken.networks[id];
    if(rewardTokenData) {
      const rewardToken = new window.web3.eth.Contract(RewardToken.abi, rewardTokenData.address);
      this.setState({ 
        rewardToken 
      })
      let rewardTokenBalance = await rewardToken.methods.balanceOf(this.state.account).call();
      this.setState({ 
        rewardTokenBalance: rewardTokenBalance.toString() 
      })
    } else {
      window.alert('Reward Token Contract is not Deployed.')
    }

    const tokenFarmData = TokenFarm.networks[id];
    if(tokenFarmData) {
      const tokenFarm = new window.web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({ 
        tokenFarm 
      })
      let totalInvestment = await tokenFarm.methods.totalInvestment(this.state.account).call();
      this.setState({ 
        totalInvestment: totalInvestment.toString() 
      })
      console.log(tokenFarm)
      console.log(totalInvestment);
    } else {
      window.alert('Token Farm Contract is not Deployed.')
    }

    this.setState({
      loading: false
    })
  }

  async loadWeb3() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
        }
      }
    }else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  makeInvestment = (amount) => {
    this.setState({ loading: true })
    this.state.investorToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.investment(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        window.location.reload()
      })
    })
  }

  withdraw = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.withdraw().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      window.location.reload()
    })
  }

  /*
  componentDidUpdate(){
    this.loadWeb3();
    this.loadBlockchainData();
  } */

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      investorToken: {},
      rewardToken: {},
      tokenFarm: {},
      investorTokenBalance: '0',
      rewardTokenBalance: '0',
      totalInvestment: '0',
      loading: true
    }

    this.makeInvestment.bind(this)
    this.withdraw.bind(this)

    
  }

  
  render(){
    var content
    if(this.state.loading){
      content = <p className="center">LOADING...................</p>
    }else{
      content = <Content investorTokenBalance = {this.state.investorTokenBalance}
      rewardTokenBalance = {this.state.rewardTokenBalance} totalInvestment = {this.state.totalInvestment}
      makeInvestment = {this.makeInvestment} withdraw = {this.withdraw} />
    }
    
    return (
      <div className="App">
        <Navbar account={this.state.account}/>
        <div className="container center">
          {content}
        </div>
      </div>
    );
  }
}

export default App;
