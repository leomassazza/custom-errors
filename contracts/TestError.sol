//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TestError {
    error SomeFancyError();

    uint256 private _valueA;

    function getValueA() public view returns (uint){
        return _valueA;
    }
    
    function setValueA(uint256 newValue) public {
        if (newValue == 42) {
            revert SomeFancyError();
        }
        _valueA = newValue;
    }

    // not that original
}