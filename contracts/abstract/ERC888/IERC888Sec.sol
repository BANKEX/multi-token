pragma solidity ^0.4.23;

import "./IERC888.sol";

contract IERC888Sec is IERC888 {
  event ReleaseDividendsRights(uint indexed tokenId, address indexed _for, uint256 value);
  event AcceptDividends(uint indexed tokenId, uint256 value);

  function dividendsRightsOf(uint tokenId, address _owner) external view returns (uint balance);
  function releaseDividendsRights(uint tokenId, uint _value) external returns(bool);
}