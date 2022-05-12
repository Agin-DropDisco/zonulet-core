// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.5.16;

import './ZonuDexFactory.sol';
import './interfaces/IZonuDexPair.sol';
import './ZonuDexFeeSetter.sol';
import './ZonuDexFeeReceiver.sol';

contract ZonuDexDeployer {
    
    address payable public protocolFeeReceiver;
    address payable public owner;
    address public WETH;
    uint8 public state = 0;
    struct TokenPair {
        address tokenA;
        address tokenB;
        uint32 swapFee;
    }
    
    TokenPair[] public initialTokenPairs;

    event FeeReceiverDeployed(address feeReceiver);    
    event FeeSetterDeployed(address feeSetter);
    event PairFactoryDeployed(address factory);
    event PairDeployed(address pair);
        
    // Step 1: Create the deployer contract with all the needed information for deployment.
    constructor(
        address payable _protocolFeeReceiver,
        address payable _owner,
        address _WETH,
        address[] memory tokensA,
        address[] memory tokensB,
        uint32[] memory swapFees
    ) public {
        owner = _owner;
        WETH = _WETH;
        protocolFeeReceiver = _protocolFeeReceiver;
        for(uint8 i = 0; i < tokensA.length; i ++) {
            initialTokenPairs.push(
                TokenPair(
                    tokensA[i],
                    tokensB[i],
                    swapFees[i]
                )
            );
        }
    }
    
    // Step 2: Transfer ETH 
    function() external payable {
        require(state == 0, "ZonuDexDeployer: WRONG_DEPLOYER_STATE");
        require(msg.sender == owner, "ZonuDexDeployer: CALLER_NOT_FEE_TO_SETTER");
        state = 1;
    }
    
    // Step 3: Deploy ZonuDexFactory and all initial pairs
    function deploy() public {
        require(state == 1, 'ZonuDexDeployer: WRONG_DEPLOYER_STATE');
        ZonuDexFactory zonuDexFactory = new ZonuDexFactory(address(this));
        emit PairFactoryDeployed(address(zonuDexFactory));
        for(uint8 i = 0; i < initialTokenPairs.length; i ++) {
            address newPair = zonuDexFactory.createPair(initialTokenPairs[i].tokenA, initialTokenPairs[i].tokenB);
            zonuDexFactory.setSwapFee(newPair, initialTokenPairs[i].swapFee);
            emit PairDeployed(address(newPair));
        }
        ZonuDexFeeReceiver zonuDexFeeReceiver = new ZonuDexFeeReceiver(
            owner, address(zonuDexFactory), WETH, protocolFeeReceiver, owner
        );
        emit FeeReceiverDeployed(address(zonuDexFeeReceiver));
        zonuDexFactory.setFeeTo(address(zonuDexFeeReceiver));
        
        ZonuDexFeeSetter zonuDexFeeSetter = new ZonuDexFeeSetter(owner, address(zonuDexFactory));
        emit FeeSetterDeployed(address(zonuDexFeeSetter));
        zonuDexFactory.setFeeToSetter(address(zonuDexFeeSetter));
        state = 2;
        msg.sender.transfer(address(this).balance);
    }
    
  
}
