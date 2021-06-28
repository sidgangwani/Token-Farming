const { assert } = require('chai');

const InvestorToken = artifacts.require('InvestorToken');
const RewardToken = artifacts.require('RewardToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('TokenFarm',(accounts)=>{
    
    let investorToken, rewardToken, tokenFarm;

    before(async()=>{
        investorToken = await InvestorToken.new();
        rewardToken = await RewardToken.new();
        tokenFarm = await TokenFarm.new(investorToken.address, rewardToken.address);
        
        //TRANSFERING ALL REWARD TOKENS TO TOKENFARM TO BE AVAILABLE FOR DISTRIBUTION
        await rewardToken.transfer(tokenFarm.address, '1000000000000000000000000');

        //TRANSFERING 10 INVESTOR TOKEN TO AN INVESTOR FROM GANACHE FOR MOCK SETUP
        await investorToken.transfer(accounts[1], '10000000000000000000', {from: accounts[0]});

    })
    
    describe('Testing for InvestorToken Deployment', async()=>{
        it('NAME TEST', async()=>{
            assert.equal(await investorToken.name(),'Investor Token');
        })
    })

    describe('Testing for RewardToken Deployment', async()=>{
        it('NAME TEST', async()=>{
            assert.equal(await rewardToken.name(),'Reward Token');
        })
    })

    describe('Testing for TokenFarm Deployment', async()=>{
        it('NAME TEST', async()=>{
            assert.equal(await tokenFarm.name(),'TOKEN FARM');
        })

        it('TOTAL REWARD TOKENS IN TOKEN FARM TEST', async()=>{
            assert.equal(await rewardToken.balanceOf(tokenFarm.address),'1000000000000000000000000');
        })

        it('INITIAL INVESTOR TOKENS WITH INVESTOR TEST', async()=>{
            assert.equal(await investorToken.balanceOf(accounts[1]),'10000000000000000000');
        })
    })

    describe('Testing for Investing', async()=>{
        it('INVESTING PROCESS TEST', async()=>{
            await investorToken.approve(tokenFarm.address, '10000000000000000000', { from: accounts[1] });
            await tokenFarm.investment('10000000000000000000', { from: accounts[1] });

            assert.equal(await investorToken.balanceOf(accounts[1]), '0','INVESTOR SHOULD HAVE 0 INVESTOR TOKENS IN WALLET');
            assert.equal(await investorToken.balanceOf(tokenFarm.address), '10000000000000000000', 'TOKEN FARM SHOULD HAVE 10 INVESTOR TOKENS');
            assert.equal(await tokenFarm.totalInvestment(accounts[1]), '10000000000000000000', 'INVESTOR SHOULD HAVE INVESTED 10 INVESTOR TOKENS');
            assert.equal(await tokenFarm.investing(accounts[1]), true, 'INVESTOR SHOULD STILL BE INVESTING');
        })

        it('REWARDING PROCESS TEST', async()=>{
            
            //ONLY OWNER SHOULD BE ABLE TO REWARD
            await tokenFarm.reward({ from: accounts[1] }).should.be.rejected;

            await tokenFarm.reward({ from: accounts[0] });
            assert.equal(await rewardToken.balanceOf(accounts[1]), '10000000000000000000', 'INVESTOR SHOULD HAVE 10 REWARD TOKENS');
            
        })

        it('WITHDRAWING PROCESS TEST', async()=>{

            await tokenFarm.withdraw({ from: accounts[1]});

            assert.equal(await investorToken.balanceOf(accounts[1]), '10000000000000000000', 'INVESTOR SHOULD HAVE 10 INVESTOR TOKENS BACK');
            assert.equal(await investorToken.balanceOf(tokenFarm.address), '0', 'TOKEN FARM SHOULD HAVE 0 INVESTOR TOKENS');

            assert.equal(await tokenFarm.totalInvestment(accounts[1]), '0', 'INVESTOR SHOULD HAVE 0 TOTAL INVESTMENT');
            assert.equal(await tokenFarm.investing(accounts[1]), false, 'INVESTOR SHOULD NOT BE INVESTING');
            assert.equal(await rewardToken.balanceOf(accounts[1]), '10000000000000000000', 'INVESTOR SHOULD STILL HAVE 10 REWARD TOKENS');
        })
    })
})
