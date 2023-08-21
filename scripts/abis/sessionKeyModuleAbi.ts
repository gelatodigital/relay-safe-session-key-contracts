export const sessionKeyModuleAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_trustedForwarder",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "sessionKey",
        type: "bytes32",
      },
    ],
    name: "SetSession",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_sessionId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_tmpPublicKey",
        type: "address",
      },
    ],
    name: "createSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_safe",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "selector",
            type: "bytes4",
          },
          {
            internalType: "bool",
            name: "hasValue",
            type: "bool",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.TxSpec[]",
        name: "_txSpecs",
        type: "tuple[]",
      },
    ],
    name: "encodeTx",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_sessionId",
        type: "string",
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.Tx[]",
        name: "_txs",
        type: "tuple[]",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.Tx[]",
        name: "_txs",
        type: "tuple[]",
      },
    ],
    name: "getExecTx",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.Tx",
        name: "execTx",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_safe",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "selector",
            type: "bytes4",
          },
          {
            internalType: "bool",
            name: "hasValue",
            type: "bool",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.TxSpec[]",
        name: "_txSpecs",
        type: "tuple[]",
      },
    ],
    name: "isWhitelistedTransaction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "selector",
            type: "bytes4",
          },
          {
            internalType: "bool",
            name: "hasValue",
            type: "bool",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.TxSpec[]",
        name: "_txs",
        type: "tuple[]",
      },
    ],
    name: "removeTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "sessions",
    outputs: [
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "tempPublicKey",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "selector",
            type: "bytes4",
          },
          {
            internalType: "bool",
            name: "hasValue",
            type: "bool",
          },
          {
            internalType: "enum ISafe.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        internalType: "struct GelatoSafeModule.TxSpec[]",
        name: "_txs",
        type: "tuple[]",
      },
    ],
    name: "whitelistTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]