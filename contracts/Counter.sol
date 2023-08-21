// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract Counter is ERC2771Context {
    mapping(address => uint256) public counter;


    constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {
    }

    function increment() external {
        address msgSender = _msgSender();
        counter[msgSender]++;
        
    }


}
