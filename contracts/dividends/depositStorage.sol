pragma solidity ^0.4.18;

import "../math/SafeMath.sol";
import "../token/multiToken/multiTokenBasic.sol";
import "../token/ERC20/ERC20.sol";





contract depositStorage {
  using SafeMath for uint;



  uint constant tokenSize = 10**18;
  uint constant updatePeriod = 691200 * 7;


  address dividendToken;
  mapping (address => mapping (uint => mapping (address => mapping (uint => uint)))) public depositTimestamp;
  mapping (address => mapping (uint => mapping (address => mapping (uint => uint)))) public depositValue;

  mapping (address => mapping (uint => uint)) depositCollected;
  mapping (address => mapping (uint => uint)) dividendCollected;
  mapping (address => mapping (uint => mapping(uint=>uint))) dividendPerTokenHistory;
  mapping (address => mapping (uint => uint)) lastUpdatePeriod;

  function updateState(address _token, uint _tokenId) private returns (bool){
    uint _timestamp = currentPeriod();
    if (lastUpdatePeriod[_token][_tokenId] == 0)
      lastUpdatePeriod[_token][_tokenId] = _timestamp;
    uint _t = lastUpdatePeriod[_token][_tokenId];
    if (_t < _timestamp){
      if (dividendCollected[_token][_tokenId] != 0){
        dividendPerTokenHistory[_token][_tokenId][_t]=dividendPerTokenHistory[_token][_tokenId][_t-1] + depositCollected[_token][_tokenId]*tokenSize/dividendCollected[_token][_tokenId];
        dividendCollected[_token][_tokenId] = 0;
        _t += updatePeriod;
      }

      while(_t < _timestamp){
        dividendPerTokenHistory[_token][_tokenId][_t]=dividendPerTokenHistory[_token][_tokenId][_t-1];
        _t += updatePeriod;
      }
      lastUpdatePeriod[_token][_tokenId]=_timestamp;
    }
    return true;
  }

  function depositStorage(address _dividendToken) public {
    dividendToken = _dividendToken;
  }


  event AcceptDeposit(address _token, uint indexed _tokenId, address indexed beneficiary, uint depositId, uint daytimestamp, uint _value);
  event ReleaseDeposit(address _token, uint indexed _tokenId, address indexed beneficiary, uint depositId, uint daytimestamp, uint _value);



  modifier dividendTokenZero() {
    require(dividendToken==address(0));
    _;
  }

  modifier dividendTokenNotZero() {
    require(dividendToken!=address(0));
    _;
  }

  modifier notDividendToken(address _token){
    require(_token!=dividendToken);
    _;
  }

  modifier existingDeposit(address _token, uint _tokenId, uint _depositId) {
    require(depositTimestamp[_token][_tokenId][msg.sender][_depositId] !=0 );
    _;
  }

  modifier notExistingDeposit(address _token, uint _tokenId, uint _depositId) {
    require(depositTimestamp[_token][_tokenId][msg.sender][_depositId] ==0 );
    _;
  }

  function currentPeriod() private view returns (uint) {
    return now - now % updatePeriod;
  }


  function acceptDividend(address _token, uint _tokenId, uint _value) dividendTokenNotZero() notDividendToken(_token) public returns (bool){
    uint _timestamp = currentPeriod();
    if (_timestamp>lastUpdatePeriod[_token][_tokenId])
      updateState(_token, _tokenId);
    assert(ERC20(dividendToken).transferFrom(msg.sender, address(this), _value));
    dividendCollected[_token][_tokenId]=dividendCollected[_token][_tokenId].add(_value);
    return true;
  }

  function acceptDividendEth(address _token, uint _tokenId) dividendTokenZero() payable public returns (bool){
    uint _timestamp = currentPeriod();
    if (_timestamp>lastUpdatePeriod[_token][_tokenId])
      updateState(_token, _tokenId);
    dividendCollected[_token][_tokenId]=dividendCollected[_token][_tokenId].add(msg.value);
    return true;
  }

  function releaseDividend(address _token, uint _tokenId, uint _depositId) notDividendToken(_token) dividendTokenNotZero()  existingDeposit(_token, _tokenId, _depositId) public returns (bool){
    uint _timestamp = currentPeriod();
    if (_timestamp>lastUpdatePeriod[_token][_tokenId])
      updateState(_token, _tokenId);
    uint _depositTimestamp =  depositTimestamp[_token][_tokenId][msg.sender][_depositId];
    uint _dividendPerToken = dividendPerTokenHistory[_token][_tokenId][_timestamp].sub(dividendPerTokenHistory[_token][_tokenId][_depositTimestamp]);
    uint _value = _dividendPerToken.mul(depositValue[_token][_tokenId][msg.sender][_depositId])/tokenSize;
    depositTimestamp[_token][_tokenId][msg.sender][_depositId]=_timestamp;
    assert(ERC20(dividendToken).transfer(msg.sender, _value));
    return true;
  }

  function releaseDividendEth(address _token, uint _tokenId, uint _depositId) dividendTokenZero() existingDeposit(_token, _tokenId, _depositId) payable public returns (bool){
    require(msg.value == 0);
    uint _timestamp = currentPeriod();
    if (_timestamp>lastUpdatePeriod[_token][_tokenId])
      updateState(_token, _tokenId);
    uint _depositTimestamp =  depositTimestamp[_token][_tokenId][msg.sender][_depositId];
    uint _dividendPerToken = dividendPerTokenHistory[_token][_tokenId][_timestamp].sub(dividendPerTokenHistory[_token][_tokenId][_depositTimestamp]);
    uint _value = _dividendPerToken.mul(depositValue[_token][_tokenId][msg.sender][_depositId])/tokenSize;
    depositTimestamp[_token][_tokenId][msg.sender][_depositId]=_timestamp;
    msg.sender.transfer(_value);
    return true;
  }

  function acceptDeposit(address _token, uint _tokenId, uint _depositId, uint _value) notDividendToken(_token) notExistingDeposit(_token, _tokenId, _depositId) public returns (bool) {
    uint _timestamp = currentPeriod();
    if (_timestamp>lastUpdatePeriod[_token][_tokenId])
      updateState(_token, _tokenId);
    if (_tokenId == 0)
      assert(ERC20(_token).transferFrom(msg.sender, address(this), _value));
    else
      assert(multiTokenBasics(_token).transferFrom(_tokenId, msg.sender, address(this), _value));
    depositTimestamp[_token][_tokenId][msg.sender][_depositId] = _timestamp;
    depositValue[_token][_tokenId][msg.sender][_depositId] = _value;
    depositCollected[_token][_tokenId].add(_value);
    AcceptDeposit(_token, _tokenId, msg.sender, _depositId, _timestamp, _value);
    return true;
  }

  function releaseDeposit(address _token, uint _tokenId, uint _depositId) notDividendToken(_token) existingDeposit(_token, _tokenId, _depositId) public returns (bool) {
    uint _timestamp = currentPeriod();
    if (_timestamp>lastUpdatePeriod[_token][_tokenId])
      updateState(_token, _tokenId);
    uint _value = depositValue[_token][_tokenId][msg.sender][_depositId];
    delete depositValue[_token][_tokenId][msg.sender][_depositId];
    delete depositTimestamp[_token][_tokenId][msg.sender][_depositId];
    depositCollected[_token][_tokenId].sub(_value);
    if (_tokenId == 0)
      assert(ERC20(_token).transfer(msg.sender, _value));
    else
      assert(multiTokenBasics(_token).transfer(_tokenId, msg.sender, _value));
    ReleaseDeposit(_token, _tokenId, msg.sender, _depositId, _timestamp, _value);
    return true;
  }
}
