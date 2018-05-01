pragma solidity ^0.4.21;

import "./MultiTokenInterface.sol";

contract MultiDividendsTokenInterface is MultiTokenInterface {
  event ReleaseDividendsRights(uint indexed tokenId, address indexed _for, uint256 value);

  function dividendsRightsOf(uint tokenId, address _owner) public view returns (uint balance);
  function releaseDividendsRights(uint tokenId, uint _value) public returns(bool);
}