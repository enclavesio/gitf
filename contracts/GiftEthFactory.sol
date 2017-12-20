pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './GiftEth.sol';

contract GiftEthFactory is Ownable {

  event GiftGenerated(address indexed _gifter, address indexed _recipient, address indexed _gift, uint256 _amount, uint256 _lockTs, string _giftMessage);
  event Frozen(bool _frozen);

  bool public frozen;

  modifier notFrozen {
    require(!frozen);
    _;
  }

  function setFrozen(bool _frozen) public onlyOwner {
    frozen = _frozen;
    Frozen(frozen);
  }

  function giftEth(address _recipient, uint256 _lockTs, string _giftMessage) payable public notFrozen {
    GiftEth gift = (new GiftEth).value(msg.value)(msg.sender, _recipient, _lockTs, _giftMessage);
    GiftGenerated(msg.sender, _recipient, address(gift), msg.value, _lockTs, _giftMessage);
  }

}
