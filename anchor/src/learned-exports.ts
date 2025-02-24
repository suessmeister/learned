// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import LearnedIDL from '../target/idl/learned.json'
import type { Learned } from '../target/types/learned'

// Re-export the generated IDL and type
export { Learned, LearnedIDL }

// The programId is imported from the program IDL.
export const LEARNED_PROGRAM_ID = new PublicKey(LearnedIDL.address)

// This is a helper function to get the Learned Anchor program.
export function getLearnedProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...LearnedIDL, address: address ? address.toBase58() : LearnedIDL.address } as Learned, provider)
}

// This is a helper function to get the program ID for the Learned program depending on the cluster.
export function getLearnedProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Learned program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return LEARNED_PROGRAM_ID
  }
}
