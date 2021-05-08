//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
    string public name = "Danilo Miranda Token";
    string public symbol = "DMT";
    uint public totalSupply = 1000000;

    mapping(address => uint) balances;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
         balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint) {
        return balances[account];
    }
}
