pragma solidity ^0.4.18;


contract multiTokenBasics {

  function getDecimals() public view returns(uint8);
  function mulTotalSupply(uint256 _tokenId) public view returns (uint256);
  function mulBalanceOf(uint256 _tokenId, address _owner) public view returns (uint256);
  function ownerOf(uint256 _tokenId)  public view returns (address);
  function mulAllowance(uint256 _tokenId, address _owner, address _spender) public view returns (uint256);
  function prxTransfer(uint256 _tokenId, address _to, uint256 _value) public returns (bool);
  function mulTransfer(uint256 _tokenId, address _to, uint256 _value) public returns (bool);
  function prxTransferFrom(uint256 _tokenId, address _from, address _to, uint256 _value) public returns (bool);
  function mulTransferFrom(uint256 _tokenId, address _from, address _to, uint256 _value)  public returns (bool);
  function prxApprove(uint256 _tokenId, address _spender, uint256 _value) public returns (bool);
  function mulApprove(uint256 _tokenId, address _spender, uint256 _value) public returns (bool);


  event MulTransfer(uint256 indexed tokenId, address indexed from, address indexed to, uint256 value);
  event MulApproval(uint256 indexed tokenId, address indexed owner, address indexed spender, uint256 value);
}
