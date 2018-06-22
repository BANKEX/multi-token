pragma solidity ^0.4.23;
import "../token/multiToken/MultiDividendsToken.sol";


contract TestingToken is MultiDividendsToken {
  mapping(uint => address) internal ownerOf;

  event Init (uint indexed tokenId, address indexed owner, uint totalSupply);

  /**
  * @dev release dividends rights for a specified address
  * @param _for The address to transfer for.
  * @param _value The amount of dividends to be transferred.
  */
  function releaseDividendsRightsForce(uint _tokenId, address _for, uint _value) external returns(bool) {
    require(ownerOf[_tokenId] == msg.sender);
    return releaseDividendsRights_(_tokenId, _for, _value);
  }

  /**
  * @dev init new subtoken a specified address
  * @param _tokenId subtoken identifier
  * @param _value uint the amount of tokens to be minted
  */
  function init(uint _tokenId, uint _value) external {
    require(totalSupply_[_tokenId] == 0);
    require(_value > 0);
    balances[_tokenId][msg.sender] = _value;
    totalSupply_[_tokenId] = _value;
    ownerOf[_tokenId] = msg.sender;
    emit Transfer(_tokenId, address(0), msg.sender, _value);
    emit Init(_tokenId, msg.sender, _value);
  }

}