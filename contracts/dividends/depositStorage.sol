pragma solidity ^0.4.18;

import "../math/SafeMath.sol";
import "./token/multiToken/multiTokenBasics.sol";





contract depositStorage {

  struct Deposit{
    uint timestamp;
    uint balance;
  }


  event AcceptDeposit(address _token, uint indexed _tokenId, address indexed beneficiary, uint depositId, uint daytimestamp, uint _value);
  event ReleaseDeposit(address _token, uint indexed _tokenId, address indexed beneficiary, uint depositId, uint daytimestamp, uint _value);

  mapping (address => mapping (uint => mapping (address => mapping (uint => Deposit)))) public deposits;


  modifier existingDeposit(address _token, uint _tokenId, uint _depositId) {
    require(deposits[_token][_tokenId][msg.sender][_depositId].daytimestamp !=0 );
    _;
  }

  modifier notExistingDeposit(address _token, uint _tokenId, uint _depositId) {
    require(deposits[_token][_tokenId][msg.sender][_depositId].daytimestamp ==0 );
    _;
  }



  function acceptDeposit(address _token, uint _tokenId, uint _depositId, uint _value) notExistingDeposit(_token, _tokenId, _depositId) public returns (bool) {
    assert(multiTokenBasics(_token).transferFrom(_tokenId, msg.sender, address(this), _value));
    uint _daytimestamp = now/691200;
    deposits[_token][_tokenId][msg.sender][_depositId] = Deposit(_daytimestamp, _value);
    AcceptDeposit(_token, _tokenId, msg.sender, _depositId, _daytimestamp, _value);
  }

  function releaseDeposit(address _token, uint _tokenId, uint _depositId) existingDeposit(_token, _tokenId, _depositId) public returns (bool) {
    uint _value = deposits[_token][_tokenId][msg.sender][_depositId].balance;
    uint _daytimestamp = now/691200;
    delete deposits[_token][_tokenId][msg.sender][_depositId];
    assert(multiTokenBasics(_token).transfer(_tokenId, msg.sender, _value);
    ReleaseDeposit(_token, _tokenId, msg.sender, _depositId, _daytimestamp, _value);

  }
}
