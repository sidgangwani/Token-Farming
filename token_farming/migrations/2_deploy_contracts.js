const InvestorToken = artifacts.require('InvestorToken');
const RewardToken = artifacts.require('RewardToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function (deployer, network, accounts) {
    
    //DEPLOYING CONTRACTS
    await deployer.deploy(InvestorToken);
    const investorToken = await InvestorToken.deployed();

    await deployer.deploy(RewardToken);
    const rewardToken = await RewardToken.deployed();

    await deployer.deploy(TokenFarm, investorToken.address, rewardToken.address);
    const tokenFarm = await TokenFarm.deployed();

    //TRANSFERING ALL REWARD TOKENS TO TOKENFARM TO BE AVAILABLE FOR DISTRIBUTION
    await rewardToken.transfer(tokenFarm.address, '1000000000000000000000000');

    //TRANSFERING 10 INVESTOR TOKEN TO AN INVESTOR FROM GANACHE FOR MOCK SETUP
    await investorToken.transfer(accounts[1],'10000000000000000000');

};
