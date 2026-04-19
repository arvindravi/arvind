/*
Codegen shim — re-exports everything from `@apollo/client/react` (where the
hooks and deprecated `*HookOptions` aliases live in v4) and polyfills the two
type names the `typescript-react-apollo` v3 plugin still emits but Apollo v4
no longer ships.

Why a shim instead of bumping codegen: the next-gen `client-preset` would
require rewriting every consumer to use generated DocumentNodes, which is a
much larger surface change. This file lets us keep the existing `useFooMutation`
generated hook ergonomics with zero call-site changes.

`useMutation` is re-typed to return a loose mutate function where variables
are optional. Many existing call sites pre-configure variables at the hook
and invoke the mutate with no args — v4's stock `MutationFunction` makes
variables required at call time, which would force noisy duplication.
*/

export * from '@apollo/client/react'

import type {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  FetchResult,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client'
import {
  type useMutation as useMutationNS,
  useMutation as useMutationV4,
} from '@apollo/client/react'

export type MutationFunction<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
  _TContext = DefaultContext,
  TCache extends ApolloCache = ApolloCache,
> = (
  options?: Partial<
    useMutationNS.MutationFunctionOptions<TData, TVariables, TCache>
  >
) => Promise<FetchResult<TData>>

export type BaseMutationOptions<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
  _TContext = DefaultContext,
  TCache extends ApolloCache = ApolloCache,
> = useMutationNS.Options<TData, TVariables, TCache>

export function useMutation<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: useMutationNS.Options<TData, TVariables>
): [MutationFunction<TData, TVariables>, useMutationNS.Result<TData>] {
  return (useMutationV4 as unknown as (m: unknown, o: unknown) => unknown)(
    mutation,
    options
  ) as [MutationFunction<TData, TVariables>, useMutationNS.Result<TData>]
}
