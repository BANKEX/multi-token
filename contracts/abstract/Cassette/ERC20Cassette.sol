pragma solidity ^0.4.23;

import "./ICassette.sol";
import "../../libs/token/ERC20/IERC20.sol";

contract ERC20Cassette is ICassette {

  address public utilityToken;

  function getCassetteSize_() internal view returns(uint) {
    return IERC20(utilityToken).balanceOf(address(this));
  }

  function acceptAbstractToken_(uint _value) internal returns(bool){
    return IERC20(utilityToken).transferFrom(msg.sender, address(this), _value);
  }
  function releaseAbstractToken_(address _for, uint _value) internal returns(bool){
    return IERC20(utilityToken).transfer(_for, _value);
  }

  function getCassetteType_() internal pure returns(uint8){
    return CT_TOKEN;
  }

}