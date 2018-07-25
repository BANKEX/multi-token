pragma solidity ^0.4.23;


import "../../libs/math/SafeMath.sol";
import "./ERC888.sol";
import "./IERC888Sec.sol";
import "../Cassette/ICassette.sol";

/**
 * @title Multitoken token with dividends distribution support
 */
contract ERC888Sec is IERC888Sec, ERC888, ICassette {
  using SafeMath for uint;
  
  uint constant DECIMAL_MULTIPLIER = 10 ** 18;
  uint constant INT256_MAX = 1 << 255 - 1;
  
  mapping(uint => mapping(address => uint)) internal dividendsRightsFix;
  mapping(uint => uint) internal dividendsPerToken;
  
  /**
  * @dev Gets the dividends rights of the specified address.
  * @param _tokenId subtoken identifier
  * @param _owner The address to query the the balance of.
  * @return An uint representing the amount of dividends rights owned by the passed address.
  */
  function dividendsRightsOf(uint _tokenId, address _owner) external view returns (uint balance) {
    return dividendsRightsOf_(_tokenId, _owner);
  }
  
  function dividendsRightsOf_(uint _tokenId, address _owner) internal view returns (uint balance) {
    uint rights = dividendsPerToken[_tokenId] * balances[_tokenId][_owner] / DECIMAL_MULTIPLIER + dividendsRightsFix[_tokenId][_owner];
    return int(rights) < 0 ? 0 : rights;
  }
  
  
  /**
  * @dev release dividends rights
  * @param _tokenId subtoken identifier
  * @param _value The amount of dividends to be transferred.
  * @param _for The address to transfer for.
  */
  function releaseDividendsRights_(uint _tokenId, address _for, uint _value) internal returns (bool) {
    uint _dividendsRights = dividendsRightsOf_(_tokenId, _for);
    require(_dividendsRights >= _value);
    dividendsRightsFix[_tokenId][_for] -= _value;
    releaseAbstractToken_(_for, _value);
    emit ReleaseDividendsRights(_tokenId, _for, _value);
    return true;
  }
  
  
  /**
  * @dev release dividends rights
  * @param _tokenId subtoken identifier
  * @param _value The amount of dividends to be transferred.
  */
  function releaseDividendsRights(uint _tokenId, uint _value) external returns (bool) {
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
    if (_from != _to) {
      uint _dividendsPerToken = dividendsPerToken[_tokenId];
      uint _balanceFrom = balances[_tokenId][_from];
      uint _balanceTo = balances[_tokenId][_to];
      dividendsRightsFix[_tokenId][_from] += _dividendsPerToken * _balanceFrom / DECIMAL_MULTIPLIER -
      _dividendsPerToken * (_balanceFrom - _value) / DECIMAL_MULTIPLIER;
      dividendsRightsFix[_tokenId][_to] += _dividendsPerToken * _balanceTo / DECIMAL_MULTIPLIER -
      _dividendsPerToken * (_balanceTo + _value) / DECIMAL_MULTIPLIER;
    }
  }
  
  /**
  * @dev transfer token for a specified address
  * @param _tokenId subtoken identifier
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(uint _tokenId, address _to, uint _value) external returns (bool) {
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
  function transferFrom(uint _tokenId, address _from, address _to, uint _value) external returns (bool) {
    dividendsRightsFixUpdate_(_tokenId, _from, _to, _value);
    uint _allowed = allowed[_tokenId][_from][msg.sender];
    require(_value <= _allowed);
    allowed[_tokenId][_from][msg.sender] = _allowed.sub(_value);
    return transfer_(_tokenId, _from, _to, _value);
  }
  
  /**
  * @dev Accept dividends
  */
  function acceptDividends(uint _tokenId, uint _tvalue) public payable {
    uint _value;
    if(getCassetteType_()==CT_ETHER) {
      _value = msg.value;
    } else if (getCassetteType_()==CT_TOKEN) {
      _value = _tvalue;
      require(acceptAbstractToken_(_value));
    } else revert();

    uint _dividendsPerToken = dividendsPerToken[_tokenId];
    uint _totalSupply = totalSupply_[_tokenId];
    require(_totalSupply > 0);
    _dividendsPerToken = _dividendsPerToken.add(_value.mul(DECIMAL_MULTIPLIER) / _totalSupply);
    require(_dividendsPerToken.mul(_totalSupply) <= INT256_MAX);
    dividendsPerToken[_tokenId] = _dividendsPerToken;
    emit AcceptDividends(_tokenId, _value);
  }
  

  /**
  * @dev Accept dividends
  */
  function acceptDividends(uint _tokenId) public payable {
    require(getCassetteType_()==CT_ETHER);
    uint _value = msg.value;
    uint _dividendsPerToken = dividendsPerToken[_tokenId];
    uint _totalSupply = totalSupply_[_tokenId];
    require(_totalSupply > 0);
    _dividendsPerToken = _dividendsPerToken.add(_value.mul(DECIMAL_MULTIPLIER) / _totalSupply);
    require(_dividendsPerToken.mul(_totalSupply) <= INT256_MAX);
    dividendsPerToken[_tokenId] = _dividendsPerToken;
    emit AcceptDividends(_tokenId, _value);
  }

  function() public payable {
    revert();
  }
}
