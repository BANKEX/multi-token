pragma solidity ^0.4.23;



import "../../math/SafeMath.sol";
import "./MultiToken.sol";
import "./MultiDividendsTokenInterface.sol";


/**
 * @title Multitoken token with dividends distribution support
 */
contract MultiDividendsToken is MultiDividendsTokenInterface, MultiToken {
  using SafeMath for uint;

  uint constant DECIMAL_MULTIPLIER = 10 ** 18;
  uint constant INT256_MAX = 1 << 255 - 1;

  mapping(uint => mapping (address => uint)) public dividendsRightsFix;
  mapping(uint => uint) dividendsPerToken;

  /**
  * @dev Gets the dividends rights of the specified address.
  * @param _tokenId subtoken identifier
  * @param _owner The address to query the the balance of.
  * @return An uint representing the amount of dividends rights owned by the passed address.
  */
  function dividendsRightsOf(uint _tokenId, address _owner) public view returns (uint balance) {
    uint rights = dividendsPerToken[_tokenId] * balances[_tokenId][_owner] / DECIMAL_MULTIPLIER + dividendsRightsFix[_tokenId][_owner];
    return int(rights) < 0 ? 0 : rights;
  }


  /**
  * @dev release dividends rights
  * @param _tokenId subtoken identifier
  * @param _value The amount of dividends to be transferred.
  * @param _for The address to transfer for.
  */
  function releaseDividendsRights_(uint _tokenId, address _for, uint _value) internal returns(bool) {
    uint _dividendsRights = dividendsRightsOf(_tokenId, _for);
    require(_dividendsRights >= _value);
    dividendsRightsFix[_tokenId][_for] -= _value;
    msg.sender.transfer(_value);
    emit ReleaseDividendsRights(_tokenId, _for, _value);
    return true;
  }


  /**
  * @dev release dividends rights
  * @param _tokenId subtoken identifier
  * @param _value The amount of dividends to be transferred.
  */
  function releaseDividendsRights(uint _tokenId, uint _value) public returns(bool) {
    return releaseDividendsRights_(_tokenId, msg.sender, _value);
  }

  /**
  * @dev Update dividends rights fix
  * @param _tokenId subtoken identifier
  * @param _from address The address which you want to send tokens from
  * @param _to address The address which you want to transfer to
  * @param _value uint the amount of tokens to be transferred
  */
  function dividendsRightsFixUpdate_(uint _tokenId, address _from, address _to, uint _value) private {
    uint _dividendsPerToken = dividendsPerToken[_tokenId];
    uint _balanceFrom = balances[_tokenId][_from];
    uint _balanceTo = balances[_tokenId][_to];
    dividendsRightsFix[_tokenId][_from] += _dividendsPerToken * _balanceFrom / DECIMAL_MULTIPLIER - _dividendsPerToken * (_balanceFrom - _value) / DECIMAL_MULTIPLIER;
    dividendsRightsFix[_tokenId][_to] += _dividendsPerToken * _balanceTo / DECIMAL_MULTIPLIER - _dividendsPerToken * (_balanceTo + _value) / DECIMAL_MULTIPLIER; 
  }


  

  /**
  * @dev transfer token for a specified address
  * @param _tokenId subtoken identifier
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(uint _tokenId, address _to, uint _value) public returns (bool) {
    dividendsRightsFixUpdate_(_tokenId, msg.sender, _to, _value);
    return transfer_(_tokenId, msg.sender, _to, _value);
  }


  /**
  * @dev Transfer tokens from one address to another
  * @param _tokenId subtoken identifier
  * @param _from address The address which you want to send tokens from
  * @param _to address The address which you want to transfer to
  * @param _value uint the amount of tokens to be transferred
  */
  function transferFrom(uint _tokenId, address _from, address _to, uint _value) public returns (bool) {
    dividendsRightsFixUpdate_(_tokenId, _from, _to, _value);
    return transferAllowed_(_tokenId, _from, _to, _value);
  }


  /**
  * @dev Accept dividends
  */
  function acceptDividends(uint _tokenId) public payable {
    uint _dividendsPerToken = dividendsPerToken[_tokenId];
    uint _totalSupply = totalSupply_[_tokenId];
    require(_totalSupply > 0);
    _dividendsPerToken = _dividendsPerToken.add(msg.value.mul(DECIMAL_MULTIPLIER)/_totalSupply);
    require(_dividendsPerToken.mul(_totalSupply) <= INT256_MAX);
    dividendsPerToken[_tokenId] = _dividendsPerToken;
    emit AcceptDividends(_tokenId, msg.value);
  }

  function () public payable {
    revert();
  }
}
