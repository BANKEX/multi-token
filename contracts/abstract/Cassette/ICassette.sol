pragma solidity ^0.4.23;
contract ICassette {
  uint8 constant CT_ETHER = 0x01;
  uint8 constant CT_TOKEN = 0x02;
  

  function getCassetteSize_() internal view returns(uint);
  function acceptAbstractToken_(uint _value) internal returns(bool);
  function releaseAbstractToken_(address _for, uint _value) internal returns(bool);
  function getCassetteType_() internal pure returns(uint8);

}