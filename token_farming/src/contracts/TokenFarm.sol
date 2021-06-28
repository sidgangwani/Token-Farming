pragma solidity >=0.5.0 <0.6.0;

import "./InvestorToken.sol";
import "./RewardToken.sol";

contract TokenFarm {

    InvestorToken public investorToken;
    RewardToken public rewardToken;
    string public name = "TOKEN FARM";
    address public owner;

    mapping(address => uint) public totalInvestment;
    address[] public investors;
    mapping(address => bool) public invested;
    mapping(address => bool) public investing;

    constructor(InvestorToken _investorToken, RewardToken _rewardToken) public{
        investorToken = _investorToken;
        rewardToken = _rewardToken;
        owner = msg.sender;
    }

    function investment(uint _amount) public{
        require(_amount > 0, "AMOUNT INVESTING CANNOT BE 0");
        investorToken.transferFrom(msg.sender, address(this), _amount);
        totalInvestment[msg.sender] = totalInvestment[msg.sender] += _amount;

        if(!invested[msg.sender]){
            investors.push(msg.sender);
        }

        invested[msg.sender] = true;
        investing[msg.sender] = true;
    }

    function withdraw() public{

        require(invested[msg.sender],"NOT AN INVESTOR");
        uint amount = totalInvestment[msg.sender];

        require(amount>0,"AMOUNT INVESTED SHOULD BE GREATER THAN 0");

        investorToken.transfer(msg.sender, amount);
        totalInvestment[msg.sender] = 0;
        investing[msg.sender] = false;
    }

    function reward() public{
        require(msg.sender == owner, "ONLY OWNER CAN REWARD");

        for(uint i=0; i<investors.length;i++){
            if(investing[investors[i]]){
                rewardToken.transfer(investors[i], totalInvestment[investors[i]]);
            }
        }
    }
}