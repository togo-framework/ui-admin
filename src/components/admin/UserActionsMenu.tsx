'use client'

import { useEffect, useState } from 'react'
import {
  Copy,
  KeyRound,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserCog,
} from 'lucide-react'

import { TagInput } from './TagInput'
import { ConfirmDialog } from './ConfirmDialog'
import { adminStrings } from './strings'
import type { AdminLanguage, AdminLinkResult, AdminUser, EditUserInput } from './types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button, Input, Label, toast, cn } from "@togo-framework/ui-core";

export interface UserActionsMenuProps {
  user: AdminUser
  language?: AdminLanguage
  /** Render the actions inline as a button toolbar instead of a "…" menu. */
  asToolbar?: boolean
  /**
   * Each action renders only when its callback is supplied. Throw inside a
   * callback to surface an error toast. Reset/magic-link callbacks may return
   * an { link, emailed } result, which the menu shows in a copyable dialog.
   */
  onEdit?: (input: EditUserInput) => Promise<void> | void
  onImpersonate?: () => Promise<void> | void
  onResetPassword?: (
    input: { password?: string },
  ) => Promise<AdminLinkResult | void> | AdminLinkResult | void
  onSendMagicLink?: () => Promise<AdminLinkResult> | AdminLinkResult
  onDelete?: () => Promise<void> | void
}

interface LinkState {
  open: boolean
  title: string
  link?: string
  emailed?: boolean
}

/**
 * UserActionsMenu — per-user actions (Edit / Impersonate / Reset password /
 * Send magic link / Delete). Each item calls a passed-in callback; the menu
 * owns the edit/reset/link/confirm dialogs. Product-agnostic, bilingual, RTL.
 */
export function UserActionsMenu({
  user,
  language = 'en',
  asToolbar,
  onEdit,
  onImpersonate,
  onResetPassword,
  onSendMagicLink,
  onDelete,
}: UserActionsMenuProps) {
  const s = adminStrings(language)
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const [editOpen, setEditOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [email, setEmail] = useState(user.email ?? '')
  const [roles, setRoles] = useState<string[]>(user.roles ?? [])
  const [perms, setPerms] = useState<string[]>(user.permissions ?? [])
  const [newPw, setNewPw] = useState('')
  const [link, setLink] = useState<LinkState>({ open: false, title: '' })

  useEffect(() => {
    setEmail(user.email ?? '')
    setRoles(user.roles ?? [])
    setPerms(user.permissions ?? [])
  }, [user])

  const fail = (e: unknown) => toast.error(e instanceof Error ? e.message : s.testFailed)

  async function saveEdit() {
    if (!onEdit) return
    try {
      await onEdit({ email, roles, permissions: perms })
      setEditOpen(false)
    } catch (e) {
      fail(e)
    }
  }

  async function impersonate() {
    if (!onImpersonate) return
    try {
      await onImpersonate()
    } catch (e) {
      fail(e)
    }
  }

  async function doReset(withPw: boolean) {
    if (!onResetPassword) return
    try {
      const r = await onResetPassword(withPw ? { password: newPw } : {})
      setResetOpen(false)
      setNewPw('')
      if (!withPw) {
        setLink({ open: true, title: s.passwordResetLink, link: r?.link, emailed: r?.emailed })
      }
    } catch (e) {
      fail(e)
    }
  }

  async function magicLink() {
    if (!onSendMagicLink) return
    try {
      const r = await onSendMagicLink()
      setLink({ open: true, title: s.magicSignInLink, link: r?.link, emailed: r?.emailed })
    } catch (e) {
      fail(e)
    }
  }

  async function remove() {
    if (!onDelete) return
    try {
      await onDelete()
    } catch (e) {
      fail(e)
    }
  }

  const dialogs = (
    <>
      {/* Edit */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle>{s.editUser}</DialogTitle>
            <DialogDescription dir="ltr">{user.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">{s.email}</Label>
              <Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">{s.roles}</Label>
              <TagInput value={roles} onChange={setRoles} placeholder={s.rolesPlaceholder} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">{s.permissions}</Label>
              <TagInput value={perms} onChange={setPerms} placeholder="users:read…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {s.cancel}
            </Button>
            <Button onClick={saveEdit}>{s.saveChanges}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle>{s.resetPassword}</DialogTitle>
            <DialogDescription dir="ltr">{user.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-1">
            <Label className="text-muted-foreground">{s.newPassword}</Label>
            <Input
              type="password"
              dir="ltr"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder={s.resetBlankHint}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => doReset(false)}>
              {s.sendResetLink}
            </Button>
            <Button onClick={() => doReset(true)} disabled={!newPw}>
              {s.setPassword}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link result */}
      <Dialog open={link.open} onOpenChange={(o) => setLink((l) => ({ ...l, open: o }))}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle>{link.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            {link.emailed ? (
              <p className="text-sm text-emerald-500">{s.emailedToUser}</p>
            ) : null}
            {link.link ? (
              <>
                <p className="text-sm text-muted-foreground">{s.shareSingleUse}</p>
                <div className="flex gap-2">
                  <Input value={link.link} readOnly dir="ltr" className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={s.copy}
                    onClick={() => {
                      navigator.clipboard?.writeText(link.link ?? '')
                      toast.success(s.copied)
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </>
            ) : !link.emailed ? (
              <p className="text-sm text-muted-foreground">{s.noLinkReturned}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button onClick={() => setLink((l) => ({ ...l, open: false }))}>{s.done}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={s.deleteUserQ}
        message={`${user.email ?? ''} — ${s.cannotBeUndone}`}
        confirmLabel={s.delete}
        destructive
        onConfirm={remove}
        language={language}
      />
    </>
  )

  if (asToolbar) {
    return (
      <div className="flex flex-wrap items-center gap-2" dir={dir}>
        {onEdit ? (
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="size-3.5" />
            {s.edit}
          </Button>
        ) : null}
        {onImpersonate ? (
          <Button variant="outline" size="sm" onClick={impersonate}>
            <UserCog className="size-3.5" />
            {s.impersonate}
          </Button>
        ) : null}
        {onResetPassword ? (
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
            <KeyRound className="size-3.5" />
            {s.resetPassword}
          </Button>
        ) : null}
        {onSendMagicLink ? (
          <Button variant="outline" size="sm" onClick={magicLink}>
            <Mail className="size-3.5" />
            {s.sendMagicLink}
          </Button>
        ) : null}
        {onDelete ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-3.5" />
            {s.delete}
          </Button>
        ) : null}
        {dialogs}
      </div>
    )
  }

  const hasDestructive = !!onDelete
  const hasNonDestructive = !!(onEdit || onImpersonate || onResetPassword || onSendMagicLink)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={s.actions}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'}>
          {onEdit ? (
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              {s.edit}
            </DropdownMenuItem>
          ) : null}
          {onImpersonate ? (
            <DropdownMenuItem onSelect={impersonate}>
              <UserCog className="size-4" />
              {s.impersonate}
            </DropdownMenuItem>
          ) : null}
          {onResetPassword ? (
            <DropdownMenuItem onSelect={() => setResetOpen(true)}>
              <KeyRound className="size-4" />
              {s.resetPassword}
            </DropdownMenuItem>
          ) : null}
          {onSendMagicLink ? (
            <DropdownMenuItem onSelect={magicLink}>
              <Mail className="size-4" />
              {s.sendMagicLink}
            </DropdownMenuItem>
          ) : null}
          {hasDestructive && hasNonDestructive ? <DropdownMenuSeparator /> : null}
          {onDelete ? (
            <DropdownMenuItem
              onSelect={() => setConfirmOpen(true)}
              className={cn('text-destructive focus:text-destructive')}
            >
              <Trash2 className="size-4" />
              {s.delete}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogs}
    </>
  )
}
UserActionsMenu.displayName = 'UserActionsMenu'
