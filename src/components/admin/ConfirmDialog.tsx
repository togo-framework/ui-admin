'use client'

import { useCallback, useState, type ReactNode } from 'react'

import { adminStrings } from './strings'
import type { AdminLanguage } from './types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, cn } from "@togo-framework/ui-core";

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  message?: ReactNode
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  /** Styles the confirm action as destructive (red). */
  destructive?: boolean
  /** Fired when the user confirms. */
  onConfirm: () => void
  language?: AdminLanguage
}

/**
 * ConfirmDialog — controlled confirmation built on the AlertDialog primitive.
 * RTL-aware, token-themed. For an imperative `await confirm(...)` API use the
 * `useConfirm()` hook below.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  language = 'en',
}: ConfirmDialogProps) {
  const s = adminStrings(language)
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {message ? <AlertDialogDescription>{message}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel ?? s.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              destructive &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            )}
          >
            {confirmLabel ?? s.create}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
ConfirmDialog.displayName = 'ConfirmDialog'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

export interface UseConfirmResult {
  /** Open the dialog; resolves true on confirm, false on cancel/dismiss. */
  confirm: (opts: ConfirmOptions) => Promise<boolean>
  /** Render this once in your tree (it carries the live dialog). */
  dialog: ReactNode
}

/**
 * useConfirm — imperative confirmation. Mirrors Fort's local helper so products
 * can `if (!(await confirm({ … }))) return` before a destructive action.
 *
 *   const { confirm, dialog } = useConfirm({ language })
 *   // …
 *   if (await confirm({ title: 'Delete?', destructive: true })) doDelete()
 *   return <>{dialog}{rest}</>
 */
export function useConfirm(opts?: { language?: AdminLanguage }): UseConfirmResult {
  const [state, setState] = useState<
    ConfirmOptions & { open: boolean; resolve?: (v: boolean) => void }
  >({ open: false, title: '' })

  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setState({ open: true, ...o, resolve })),
    [],
  )

  const settle = useCallback(
    (v: boolean) => {
      setState((s) => {
        s.resolve?.(v)
        return { ...s, open: false }
      })
    },
    [],
  )

  const dialog = (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(o) => {
        if (!o) settle(false)
      }}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      destructive={state.destructive}
      onConfirm={() => settle(true)}
      language={opts?.language}
    />
  )

  return { confirm, dialog }
}
