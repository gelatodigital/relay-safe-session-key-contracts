// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./vendor/gelato/GelatoBytes.sol";
import {IAutomate} from "./interfaces/IAutomate.sol";
import {IOpsProxyFactory} from "./interfaces/IOpsProxyFactory.sol";
import {ISafe} from "./interfaces/ISafe.sol";
import {IMultiSend} from "./interfaces/IMultiSend.sol";
import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract GelatoSafeModule is ERC2771Context {
    using GelatoBytes for bytes;

    struct TxSpec {
        address to;
        bytes4 selector;
        bool hasValue;
        ISafe.Operation operation;
    }

    struct Tx {
        address to;
        bytes data;
        uint256 value;
        ISafe.Operation operation;
    }

    struct SessionGate {
        uint256 end;
        address user;
        address tempPublicKey;
    }

    address private constant AUTOMATE_PROXY_FACTORY =
        0xC815dB16D4be6ddf2685C201937905aBf338F5D7;

    address private constant MULTISEND =
        0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761;

    mapping(bytes32 => address) whitelistedTransactions;

    mapping(bytes32 => SessionGate) public sessions;

    event SetSession(bytes32 sessionKey);

    constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {}

    function createSession(
        string memory _sessionId,
        uint256 _duration,
        address _tmpPublicKey
    ) external {

        bytes32 sessionId = keccak256(abi.encodePacked(_sessionId));

        sessions[sessionId] = SessionGate(
            block.timestamp + _duration,
            _msgSender(),
            _tmpPublicKey
        );

        emit SetSession(sessionId);
    }

    function whitelistTransaction(TxSpec[] calldata _txs) external {
        bytes32 txHash = encodeTx(msg.sender, _txs);
        require(
            whitelistedTransactions[txHash] == address(0),
            "GelatoSafeModule: Transaction already whitelisted"
        );

        whitelistedTransactions[txHash] = msg.sender;
    }

    function removeTransaction(TxSpec[] calldata _txs) external {
        bytes32 txHash = encodeTx(msg.sender, _txs);
        require(
            whitelistedTransactions[txHash] == msg.sender,
            "GelatoSafeModule: Transaction not whitelisted"
        );

        delete whitelistedTransactions[txHash];
    }

    // Execute Transaction via dedicated Gelato msg.sender
    function execute(string memory _sessionId, Tx[] calldata _txs) external {
        bytes32 sessionId = keccak256(abi.encodePacked(_sessionId));
        SessionGate memory _sessionGate = sessions[sessionId ];

        require(isTrustedForwarder(msg.sender),"onlyGelatoRelayERC2771");
        require(_sessionGate.user != address(0), 'sessionNotInit');
        require(_sessionGate.tempPublicKey == _msgSender(), 'tempKeyNotAllowed');
        require(_sessionGate.end >= block.timestamp, 'tempKeyExpired');


       
        _onlyWhitelistedTransactions(_sessionGate.user, _convertTxToTxSpec(_txs));

        Tx memory execTx = getExecTx(_txs);

        (bool success, bytes memory returnData) = ISafe(_sessionGate.user)
            .execTransactionFromModuleReturnData(
                execTx.to,
                execTx.value,
                execTx.data,
                execTx.operation
            );

        if (!success)
            returnData.revertWithError(
                "GelatoSafeModule: module exec reverted: "
            );
    }

    function getExecTx(
        Tx[] calldata _txs
    ) public pure returns (Tx memory execTx) {
        if (_txs.length > 1) {
            bytes memory multiSendData;

            for (uint256 i; i < _txs.length; i++) {
                // Multisends get encoded as follows: "uint8", "address", "uint256", "uint256", "bytes"],
                Tx memory memTx = _txs[i];
                multiSendData = abi.encodePacked(
                    multiSendData,
                    uint8(memTx.operation),
                    memTx.to,
                    memTx.value,
                    memTx.data.length,
                    memTx.data
                );
            }
            execTx = Tx({
                to: MULTISEND,
                value: 0, // we are doing a delegatecall, so no need to send value
                data: abi.encodeWithSelector(
                    IMultiSend.multiSend.selector,
                    multiSendData
                ),
                operation: ISafe.Operation.DelegateCall
            });
        } else {
            execTx = Tx({
                to: _txs[0].to,
                value: _txs[0].value,
                data: _txs[0].data,
                operation: _txs[0].operation
            });
        }
    }

    function _convertTxToTxSpec(
        Tx[] calldata _txs
    ) private pure returns (TxSpec[] memory) {
        TxSpec[] memory txSpecs = new TxSpec[](_txs.length);
        for (uint256 i; i < _txs.length; i++) {
            TxSpec memory txSpec = TxSpec(
                _txs[i].to,
                _txs[i].data.memorySliceSelector(),
                _txs[i].value > 0,
                _txs[i].operation
            );
            txSpecs[i] = txSpec;
        }
        return txSpecs;
    }

    function _onlyWhitelistedTransactions(
        address _safe,
        TxSpec[] memory _txSpecs
    ) private view {
        require(
            isWhitelistedTransaction(_safe, _txSpecs),
            "GelatoSafeModule: TxSpec not whitelisted"
        );
    }

    function isWhitelistedTransaction(
        address _safe,
        TxSpec[] memory _txSpecs
    ) public view returns (bool) {
        bytes32 txHash = encodeTx(_safe, _txSpecs);
        return whitelistedTransactions[txHash] == _safe;
    }

    function encodeTx(
        address _safe,
        TxSpec[] memory _txSpecs
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_safe, _txSpecs));
    }
}
