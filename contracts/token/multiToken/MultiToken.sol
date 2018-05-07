pragma solidity ^0.4.23;

import "../../math/SafeMath.sol";
import "./MultiTokenInterface.sol";


contract MultiToken is MultiTokenInterface {
  using SafeMath for uint;

  mapping(uint => mapping(address => mapping(address => uint))) internal allowed;
  mapping(uint => mapping(address => uint)) internal balances;
  mapping(uint => uint) internal totalSupply_;

 
  /**
  * @dev Gets the total amount of tokens stored by the contract
  * @param _tokenId is subtoken identifier
  * @return representing the total amount of tokens
  */

  function totalSupply(uint _tokenId) external view returns (uint) {
    return totalSupply_[_tokenId];
  }

  /**
  * @dev Gets the balance of the specified address
  * @param _tokenId is subtoken identifier
  * @param _owner address to query the balance of
  * @return representing the amount owned by the passed address
  */

  function balanceOf(uint _tokenId, address _owner) external view returns (uint) {
    return balances[_tokenId][_owner];
  }



  /**
  * @dev Function to check the amount of tokens that an owner allowed to a spender.
  * @param _tokenId subtoken identifier
  * @param _owner The address which owns the funds.
  * @param _spender The address which will spend the funds.
  * @return specifying the amount of tokens still available for the spender.
  */

  function allowance(uint _tokenId, address _owner, address _spender) external view returns (uint) {
    return allowed[_tokenId][_owner][_spender];
  }



  /**
  * @dev transfer token for a specified address
  * @param _tokenId subtoken identifier
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */

  function transfer(uint _tokenId, address _to, uint _value) external returns (bool) {
    return transfer_(_tokenId, msg.sender, _to, _value);
  }


  /**
  * @dev Transfer tokens from one address to another
  * @param _tokenId subtoken identifier
  * @param _from The address which you want to send tokens from
  * @param _to The address which you want to transfer to
  * @param _value uint the amount of tokens to be transferred
  */

  function transfer_(uint _tokenId, address _from, address _to, uint _value) internal returns (bool) {
    mapping(address => uint) _balances = balances[_tokenId];
    uint _bfrom = _balances[_from];
    uint _bto = _balances[_to];
    require(_to != address(0));
    require(_value <= _bfrom);
    _balances[_from] = _bfrom.sub(_value);
    _balances[_to] = _bto.add(_value);
    emit Transfer(_tokenId, _from, _to, _value);
    return true;
  }


  /**
  * @dev Transfer tokens from one address to another, decreasing allowance
  * @param _tokenId subtoken identifier
  * @param _from address The address which you want to send tokens from
  * @param _to address The address which you want to transfer to
  * @param _value The amount of tokens to be transferred
  */
  function transferAllowed_(uint _tokenId, address _from, address _to, uint _value) internal returns (bool) {
    uint _allowed = allowed[_tokenId][_from][msg.sender];
    require(_value <= _allowed);
    allowed[_tokenId][_from][msg.sender] = _allowed.sub(_value);
    return transfer_(_tokenId, _from, _to, _value);
  }


  /**
  * @dev Transfer tokens from one address to another
  * @param _tokenId subtoken identifier
  * @param _from The address which you want to send tokens from
  * @param _to The address which you want to transfer to
  * @param _value uint the amount of tokens to be transferred
  */

  function transferFrom(uint _tokenId, address _from, address _to, uint _value) external returns (bool) {
    return transferAllowed_(_tokenId, _from, _to, _value);
  }



  /**
  * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
  *
  * Beware that changing an allowance with this method brings the risk that someone may use both the old
  * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
  * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
  * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
  * @param _tokenId uint is subtoken identifier
  * @param _spender The address which will spend the funds.
  * @param _value The amount of tokens to be spent.
  */



  function approve(uint _tokenId, address _spender, uint _value) external returns (bool) {
    address _sender = msg.sender;
    allowed[_tokenId][_sender][_spender] = _value;
    emit Approval(_tokenId, _sender, _spender, _value);
    return true;
  }


  /**
    * @dev Increase the amount of tokens that an owner allowed to a spender.
    * @param _tokenId subtoken identifier.
    * @param _spender The address which will spend the funds.
    * @param _addedValue The amount of tokens to increase the allowance by.
    */

  function increaseApproval(uint _tokenId, address _spender, uint _addedValue) external returns (bool) {
    address _sender = msg.sender;
    uint _allowed = allowed[_tokenId][_sender][_spender];
    _allowed=_allowed.add(_addedValue);
    allowed[_tokenId][_sender][_spender] = _allowed;
    emit Approval(_tokenId, _sender, _spender, _allowed);
    return true;
  }

  /**
    * @dev Decrease the amount of tokens that an owner allowed to a spender.
    * 
    * @param _tokenId subtoken identifier.
    * @param _spender The address which will spend the funds.
    * @param _subtractedValue The amount of tokens to decrease the allowance by.
    */
  function decreaseApproval(uint _tokenId, address _spender, uint _subtractedValue) external returns (bool) {
    address _sender = msg.sender;
    uint _allowed = allowed[_tokenId][_sender][_spender];
    if (_subtractedValue > _allowed) {
      _allowed = 0;
    } else {
      _allowed = _allowed.sub(_subtractedValue);
    }
    allowed[_tokenId][_sender][_spender] = _allowed;
    emit Approval(_tokenId, _sender, _spender, _allowed);
    return true;
  }
}
