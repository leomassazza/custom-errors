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
        console.log("going to set the value", newValue);
        console.log("current value", _valueA);
        if (newValue == 42) {
            console.log("Reverting");
            revert SomeFancyError();
        }
        console.log("Succedded");
        _valueA = newValue;
    }
}