pragma solidity ^0.4.18;

import "../../math/SafeMath.sol";
import "../../ownership/Ownable.sol";
import "./MultiTokenBasics.sol";


contract MultiToken is Ownable, MultiTokenBasics {
	using SafeMath for uint256;

	mapping(uint256 => mapping(address => mapping(address => uint256))) public allowed;
	mapping(uint256 => mapping(address => uint256)) public balance;
	mapping(uint256 => address) public owner_;
	mapping(uint256 => uint256) public totalSupply_;


	uint8 public decimals = 18;
	uint256 public mask = 0xffffffff;



	/**
    * @dev Throws if _tokenId not exists
    * @param _tokenId uint256 is subtoken identifier
    */

	modifier existingToken(uint256 _tokenId) {
		require(owner_[_tokenId] != address(0) && (_tokenId & mask == _tokenId));
		_;
	}

	/**
    * @dev Throws if  _tokenId exists
    * @param _tokenId uint256 is subtoken identifier
    */

	modifier notExistingToken(uint256 _tokenId) {
		require(owner_[_tokenId] == address(0) && (_tokenId & mask == _tokenId));
		_;
	}



	/**
    * @dev Guarantees msg.sender is owner of the given token
    * @param _tokenId uint256 ID of the token to validate its ownership belongs to msg.sender
    */

	modifier onlyOwnerOf(uint256 _tokenId) {
		require(ownerOf(_tokenId) == msg.sender);
		_;
	}


	/**
    * @dev create new subtoken with unique tokenId
    * @param _tokenId uint256 is subtoken identifier
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    * @return uint256 representing the total amount of tokens
    */

	function createNewSubtoken(uint256 _tokenId, address _to, uint256 _value) notExistingToken(_tokenId) onlyOwner() public returns (bool) {
		balance[_tokenId][_to] = _value;
		totalSupply_[_tokenId] = _value;
		owner_[_tokenId] = msg.sender;
		Transfer(_tokenId, address(0), _to, _value);
		return true;
	}


	/**
    * @dev Gets the total amount of tokens stored by the contract
    * @param _tokenId uint256 is subtoken identifier
    * @return uint256 representing the total amount of tokens
    */

	function totalSupply(uint256 _tokenId) existingToken(_tokenId) public view returns (uint256) {
		return totalSupply_[_tokenId];
	}

	/**
    * @dev Gets the balance of the specified address
    * @param _tokenId uint256 is subtoken identifier
    * @param _owner address to query the balance of
    * @return uint256 representing the amount owned by the passed address
    */

	function balanceOf(uint256 _tokenId, address _owner) existingToken(_tokenId) public view returns (uint256) {
		return balance[_tokenId][_owner];
	}


	/**
    * @dev Gets the owner of the specified token ID
    * @param _tokenId uint256 is subtoken identifier
    * @return owner address currently marked as the owner of the given token ID
    */

	function ownerOf(uint256 _tokenId) existingToken(_tokenId) public view returns (address) {
		return owner_[_tokenId];
	}

	/**
    * @dev Function to check the amount of tokens that an owner allowed to a spender.
    * @param _tokenId uint256 is subtoken identifier
    * @param _owner address The address which owns the funds.
    * @param _spender address The address which will spend the funds.
    * @return A uint256 specifying the amount of tokens still available for the spender.
    */

	function allowance(uint256 _tokenId, address _owner, address _spender) existingToken(_tokenId) public view returns (uint256) {
		return allowed[_tokenId][_owner][_spender];
	}



	/**
    * @dev transfer token for a specified address
    * @param _tokenId uint256 is subtoken identifier
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */

	function transfer(uint256 _tokenId, address _to, uint256 _value) existingToken(_tokenId) public returns (bool){
		var _sender = msg.sender;
		var balances = balance[_tokenId];
		require(_to != address(0));
		require(_value <= balances[_sender]);

		// SafeMath.sub will throw if there is not enough balance.
		balances[_sender] = balances[_sender].sub(_value);
		balances[_to] = balances[_to].add(_value);
		Transfer(_tokenId, _sender, _to, _value);
		return true;
	}


	/**
    * @dev Transfer tokens from one address to another
    * @param _tokenId uint256 is subtoken identifier
    * @param _from address The address which you want to send tokens from
    * @param _to address The address which you want to transfer to
    * @param _value uint256 the amount of tokens to be transferred
    */

	function transferFrom(uint256 _tokenId, address _from, address _to, uint256 _value) existingToken(_tokenId) public returns (bool){
		address _sender = msg.sender;
		var balances = balance[_tokenId];
		var tokenAllowed = allowed[_tokenId];

		require(_to != address(0));
		require(_value <= balances[_from]);
		require(_value <= tokenAllowed[_from][_sender]);

		balances[_from] = balances[_from].sub(_value);
		balances[_to] = balances[_to].add(_value);
		tokenAllowed[_from][_sender] = tokenAllowed[_from][_sender].sub(_value);
		Transfer(_tokenId, _from, _to, _value);
		return true;
	}



	/**
    * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
    *
    * Beware that changing an allowance with this method brings the risk that someone may use both the old
    * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
    * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
    * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    * @param _tokenId uint256 is subtoken identifier
    * @param _spender The address which will spend the funds.
    * @param _value The amount of tokens to be spent.
    */



	function approve(uint256 _tokenId, address _spender, uint256 _value) public returns (bool){
		var _sender = msg.sender;
		allowed[_tokenId][_sender][_spender] = _value;
		Approval(_tokenId, _sender, _spender, _value);
		return true;
	}


}
