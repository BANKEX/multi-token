pragma solidity ^0.4.18;

import "./ERC20Token.sol";

contract TokenFactory {
    function createToken(string _name, string _symbol, uint8 _decimals, address _initialAddress, uint _initialSupply) public returns(address) {
        return address(new ERC20Token(_name, _symbol, _decimals, _initialAddress, _initialSupply));
    }
}