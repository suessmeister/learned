/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/learned.json`.
 */
export type Learned = {
  "address": "6mYCAmpBBr8Xm6w1WhbVJKEeLKNbwUPxBftfbxGsnahh",
  "metadata": {
    "name": "learned",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initTeacher",
      "discriminator": [
        178,
        231,
        29,
        54,
        207,
        91,
        140,
        192
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "teacher",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  97,
                  99,
                  104,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "quality",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "teacher",
      "discriminator": [
        223,
        31,
        101,
        80,
        157,
        226,
        216,
        113
      ]
    }
  ],
  "types": [
    {
      "name": "teacher",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "quality",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
