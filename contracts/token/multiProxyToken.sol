pragma solidity ^0.4.18;

import "../math/SafeMath.sol";
import "./multiTokenBasics.sol";

contract multiProxyToken{



  mapping (address => address) private addr;
  mapping (address => string) private symbol_;
  mapping (address => uint256) private tokenId;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  function connect(address _addr, uint256 _tokenId, string _sign) public returns(bool){
    var _sender = msg.sender;
    addr[_sender] = _addr;
    tokenId[_sender] = _tokenId;
    symbol_[_sender] = _sign;
    return true;
  }
/*
  function genSign(string memory suffix, uint256 v) pure private returns (string str) {
    uint maxlength = 64;
    bytes memory reversed = new bytes(maxlength);
    uint i = 0;
    uint j = 0;
    while (v != 0) {
        uint remainder = v % 16;
        v = v / 16;
        reversed[i] =  remainder < 10 ? byte(48 + remainder) : byte(87 + remainder);
        i++;
    }

    bytes memory bsuffix = bytes(suffix);
    var bsuffix_length = bsuffix.length;
    bytes memory s = new bytes(i+bsuffix_length);

    for (j = 0; j < bsuffix_length; j++) {
      s[j]=bsuffix[j];
    }
    for (j = 0; j < i; j++) {
        s[j+bsuffix_length] = reversed[i - j - 1];
    }
    str = string(s);
  }


  function sign() view returns(string){
    return genSign("TEST", tokenId[msg.sender]);
  }
*/
  function symbol() view returns(string){
    return symbol_[msg.sender];
  }

  function decimals() view returns(uint8){
    var tkn = multiTokenBasics(addr[msg.sender]);
    return tkn.getDecimals();
  }


  function totalSupply() public view returns (uint256) {
    var tkn = multiTokenBasics(addr[msg.sender]);
    return tkn.mulTotalSupply(tokenId[msg.sender]);
  }

  function balanceOf(address _owner) public view returns (uint256) {
    var tkn = multiTokenBasics(addr[msg.sender]);
    return tkn.mulBalanceOf(tokenId[msg.sender], _owner);
  }

  function allowance(address _owner, address _spender) public view returns (uint256) {
    var tkn = multiTokenBasics(addr[msg.sender]);
    return tkn.mulAllowance(tokenId[msg.sender], _owner, _spender);
  }


  function transfer(address _to, uint256 _value) public returns (bool success) {
    var tkn = multiTokenBasics(addr[msg.sender]);
    require(tkn.prxTransfer(tokenId[msg.sender], _to, _value));
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool){
    var tkn = multiTokenBasics(addr[msg.sender]);
    require(tkn.prxTransferFrom(tokenId[msg.sender], _from, _to, _value));
    Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool){
    var tkn = multiTokenBasics(addr[msg.sender]);
    require(tkn.prxApprove(tokenId[msg.sender], _spender, _value));
    Approval(msg.sender, _spender, _value);
    return true;
  }

}
