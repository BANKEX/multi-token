pragma solidity ^0.4.18;


contract multiTokenBasics {

  function totalSupply(uint256 _tokenId) public view returns (uint256);
  function balanceOf(uint256 _tokenId, address _owner) public view returns (uint256);
  function ownerOf(uint256 _tokenId)  public view returns (address);
  function allowance(uint256 _tokenId, address _owner, address _spender) public view returns (uint256);
  function transfer(uint256 _tokenId, address _to, uint256 _value) public returns (bool);
  function transferFrom(uint256 _tokenId, address _from, address _to, uint256 _value)  public returns (bool);
  function approve(uint256 _tokenId, address _spender, uint256 _value) public returns (bool);


  event Transfer(uint256 indexed tokenId, address indexed from, address indexed to, uint256 value);
  event Approval(uint256 indexed tokenId, address indexed owner, address indexed spender, uint256 value);
}
