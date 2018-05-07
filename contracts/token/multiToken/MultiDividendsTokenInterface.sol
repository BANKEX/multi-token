pragma solidity ^0.4.23;

import "./MultiTokenInterface.sol";

contract MultiDividendsTokenInterface is MultiTokenInterface {
  event ReleaseDividendsRights(uint indexed tokenId, address indexed _for, uint256 value);
  event AcceptDividends(uint indexed tokenId, uint256 value);

  function dividendsRightsOf(uint tokenId, address _owner) external view returns (uint balance);
  function releaseDividendsRights(uint tokenId, uint _value) external returns(bool);
}