pragma solidity ^0.4.18;
import "./StandardToken.sol";



contract ERC20Token is StandardToken {
    string public name;
    string public symbol;
    uint8 public decimals;

    function ERC20Token(string _name, string _symbol, uint8 _decimals, address _initialAddress, uint _initialSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply_ = _initialSupply;
        balances[_initialAddress] = _initialSupply;
        Transfer(address(0), _initialAddress, _initialSupply);
    }

}