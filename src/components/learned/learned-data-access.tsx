'use client'

import { getLearnedProgram, getLearnedProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useLearnedProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getLearnedProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getLearnedProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['learned', 'all', { cluster }],
    queryFn: () => program.account.learned.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['learned', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ learned: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useLearnedProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useLearnedProgram()

  const accountQuery = useQuery({
    queryKey: ['learned', 'fetch', { cluster, account }],
    queryFn: () => program.account.learned.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['learned', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ learned: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['learned', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ learned: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['learned', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ learned: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['learned', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ learned: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
