//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TestError {
    error SomeFancyError();

    uint256 private _valueA;
    uint256 public valueB;
    
    function getValueA() public view returns (uint){
        return _valueA;
    }
    
    function setValueA(uint256 newValue) public {
        if (newValue == 42) {
            console.log("--> (contract log) Reverting");
            revert SomeFancyError();
        }
        console.log("--> (contract log) Succedded");
        _valueA = newValue;
    }
}