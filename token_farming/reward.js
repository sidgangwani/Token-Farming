const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function (callback) {
    const tokenFarm = await TokenFarm.deployed();
    await tokenFarm.reward();

    console.log('Rewarded RewardTokens to Investors');

    callback();
};  