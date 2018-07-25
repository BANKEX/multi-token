pragma solidity ^0.4.23;


contract IERC888 {
  function totalSupply(uint256 _tokenId) external view returns (uint256);
  function balanceOf(uint256 _tokenId, address _owner) external view returns (uint256);
  function allowance(uint256 _tokenId, address _owner, address _spender) external view returns (uint256);
  function transfer(uint256 _tokenId, address _to, uint256 _value) external returns (bool);
  function transferFrom(uint256 _tokenId, address _from, address _to, uint256 _value) external returns (bool);
  function approve(uint256 _tokenId, address _spender, uint256 _value) external returns (bool);

  event Transfer(uint256 indexed tokenId, address indexed from, address indexed to, uint256 value);
  event Approval(uint256 indexed tokenId, address indexed owner, address indexed spender, uint256 value);
}
