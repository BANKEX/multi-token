pragma solidity ^0.4.23;
import "../token/multiToken/MultiDividendsToken.sol";
import "../ownership/Ownable.sol";

contract MultiVendingToken is MultiDividendsToken, Ownable {
  uint constant DECIMAL_MULTIPLIER = 10 ** 18;
  string public name = "Vending Token";
  string public symbol = "VEND";
  uint8 public decimals = 18;

  /**
  * @dev release dividends rights for a specified address
  * @param _for The address to transfer for.
  * @param _value The amount of dividends to be transferred.
  */
  function releaseDividendsRightsForce(uint _tokenId, address _for, uint _value) external onlyOwner returns(bool) {
    return releaseDividendsRights_(_tokenId, _for, _value);
  }

  /**
  * @dev init new subtoken a specified address
  * @param _tokenId subtoken identifier
  * @param _value uint the amount of tokens to be minted
  */
  function init(uint _tokenId, uint _value) onlyOwner external {
    require(totalSupply_[_tokenId] == 0);
    require(_value > 0);
    balances[_tokenId][owner] = _value;
    totalSupply_[_tokenId] = _value;
    emit Transfer(_tokenId, address(0), owner, _value);
  }

}