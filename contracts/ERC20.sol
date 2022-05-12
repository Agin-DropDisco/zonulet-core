pragma solidity =0.5.16;

import './ZonuDexERC20.sol';

contract ERC20 is ZonuDexERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
