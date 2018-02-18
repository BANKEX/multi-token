pragma solidity ^0.4.18;

import "../math/SafeMath.sol";
import "./multiTokenBasics.sol";
import "../ownership/Ownable.sol";


contract proxyToken is Ownable{

  address private addr;
  string public symbol="PROXY";
  uint256 private tokenId;
  uint8 public decimals=18;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);


  function connect(address _addr, uint256 _tokenId) onlyOwner() public returns(bool){
    addr = _addr;
    tokenId = _tokenId;
  }

  function totalSupply() public view returns (uint256) {
    var tkn = multiTokenBasics(addr);
    return tkn.mulTotalSupply(tokenId);
  }

  function balanceOf(address _owner) public view returns (uint256) {
    var tkn = multiTokenBasics(addr);
    return tkn.mulBalanceOf(tokenId, _owner);
  }

  function allowance(address _owner, address _spender) public view returns (uint256) {
    var tkn = multiTokenBasics(addr);
    return tkn.mulAllowance(tokenId, _owner, _spender);
  }


  function transfer(address _to, uint256 _value) public returns (bool success) {
    var tkn = multiTokenBasics(addr);
    require(tkn.prxTransfer(tokenId, _to, _value));
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool){
    var tkn = multiTokenBasics(addr);
    require(tkn.prxTransferFrom(tokenId, _from, _to, _value));
    Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool){
    var tkn = multiTokenBasics(addr);
    require(tkn.prxApprove(tokenId, _spender, _value));
    Approval(msg.sender, _spender, _value);
    return true;
  }

}
