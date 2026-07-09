'use client'

import { useState, type ReactNode } from 'react'
import { UserPlus } from 'lucide-react'

import { TagInput } from './TagInput'
import { adminStrings } from './strings'
import type { AddUserInput, AdminLanguage } from './types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button, Input, Label, toast } from "@togo-framework/ui-core";

export interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Create the user. Throw to surface an error toast; resolve to close + reset. */
  onSubmit: (input: AddUserInput) => Promise<void> | void
  language?: AdminLanguage
  title?: ReactNode
  description?: ReactNode
}

/**
 * AddUserDialog — controlled "create account" dialog (email + password + roles).
 * Product-agnostic: wire `onSubmit` to your API. Bilingual, RTL-aware, themed.
 */
export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  language = 'en',
  title,
  description,
}: AddUserDialogProps) {
  const s = adminStrings(language)
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  const reset = () => {
    setEmail('')
    setPassword('')
    setRoles([])
  }

  async function submit() {
    if (!email.trim()) {
      toast.error(s.emailRequired)
      return
    }
    setBusy(true)
    try {
      await onSubmit({ email: email.trim(), password: password || undefined, roles })
      onOpenChange(false)
      reset()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : s.testFailed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir}>
        <DialogHeader>
          <DialogTitle>{title ?? s.addUser}</DialogTitle>
          <DialogDescription>{description ?? s.addUserDesc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">{s.email}</Label>
            <Input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">{`${s.password} (${s.optional})`}</Label>
            <Input
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">{s.roles}</Label>
            <TagInput value={roles} onChange={setRoles} placeholder={s.rolesPlaceholder} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {s.cancel}
          </Button>
          <Button onClick={submit} disabled={busy}>
            {s.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
AddUserDialog.displayName = 'AddUserDialog'

export interface AddUserButtonProps {
  onSubmit: (input: AddUserInput) => Promise<void> | void
  language?: AdminLanguage
  children?: ReactNode
}

/** AddUserButton — convenience wrapper: a button that owns its dialog state. */
export function AddUserButton({ onSubmit, language = 'en', children }: AddUserButtonProps) {
  const s = adminStrings(language)
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="size-4" />
        {children ?? s.addUser}
      </Button>
      <AddUserDialog open={open} onOpenChange={setOpen} onSubmit={onSubmit} language={language} />
    </>
  )
}
AddUserButton.displayName = 'AddUserButton'
