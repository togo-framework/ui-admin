/**
 * Admin.stories.tsx
 *
 * Storybook stories for the generic admin suite (user management + mail setup).
 * Every component is product-agnostic: data + callbacks in, no hardcoded URLs.
 *
 * Variants:
 *   - UserManagementTable with an actions column (EN/LTR + AR/RTL)
 *   - UserActionsMenu (menu + toolbar)
 *   - AddUserDialog / AddUserButton
 *   - MailSettingsForm
 *   - ConfirmDialog (+ useConfirm)
 *   - ImpersonationBanner
 */

import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  AddUserButton,
  ConfirmDialog,
  ImpersonationBanner,
  MailSettingsForm,
  UserActionsMenu,
  UserManagementTable,
  useConfirm,
} from '../components/admin'
import type { AdminUser } from '../components/admin'
import { Toaster } from '@togo-framework/ui-core'
import { Button } from '@togo-framework/ui-core'

const USERS: AdminUser[] = [
  { id: '1', email: 'ada@example.com', roles: ['admin'], created_at: '2026-01-12T09:00:00Z' },
  { id: '2', email: 'grace@example.com', roles: ['member'], created_at: '2026-02-03T09:00:00Z' },
  { id: '3', email: 'linus@example.com', roles: [], created_at: '2026-03-21T09:00:00Z' },
]

const log = (msg: string) => () => {
  // eslint-disable-next-line no-console
  console.log(msg)
}

const menuCallbacks = (u: AdminUser) => ({
  onEdit: async (input: { email: string; roles: string[]; permissions: string[] }) =>
    log(`edit ${u.email}: ${JSON.stringify(input)}`)(),
  onImpersonate: log(`impersonate ${u.email}`),
  onResetPassword: async () => ({ link: `https://app.example.com/reset/${u.id}?t=abc123` }),
  onSendMagicLink: async () => ({ emailed: true }),
  onDelete: log(`delete ${u.email}`),
})

const meta: Meta = {
  title: 'Components/Admin',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    ),
  ],
}
export default meta

type Story = StoryObj

/** User management table with a "…" actions menu per row (EN / LTR). */
export const UsersTable: Story = {
  render: () => (
    <UserManagementTable
      users={USERS}
      language="en"
      toolbar={<AddUserButton onSubmit={async (i) => log(`create ${JSON.stringify(i)}`)()} />}
      renderActions={(u) => <UserActionsMenu user={u} {...menuCallbacks(u)} />}
    />
  ),
}

/** Same table in Arabic / RTL. */
export const UsersTableRTL: Story = {
  render: () => (
    <div dir="rtl">
      <UserManagementTable
        users={USERS}
        language="ar"
        toolbar={
          <AddUserButton
            language="ar"
            onSubmit={async (i) => log(`create ${JSON.stringify(i)}`)()}
          />
        }
        renderActions={(u) => <UserActionsMenu user={u} language="ar" {...menuCallbacks(u)} />}
      />
    </div>
  ),
}

/** The actions as an inline toolbar (used on a user-detail page). */
export const ActionsToolbar: Story = {
  render: () => (
    <div className="rounded-xl border border-border bg-card p-4">
      <UserActionsMenu user={USERS[0]} asToolbar {...menuCallbacks(USERS[0])} />
    </div>
  ),
}

/** Add-user button + dialog. */
export const AddUser: Story = {
  render: () => (
    <AddUserButton onSubmit={async (i) => log(`create ${JSON.stringify(i)}`)()} />
  ),
}

/** SMTP / mail settings form with a test-send. */
export const MailSettings: Story = {
  render: () => (
    <div className="max-w-2xl">
      <MailSettingsForm
        value={{ host: 'smtp.example.com', port: 587, secure: true, from: 'App <no-reply@example.com>' }}
        onSave={async (cfg) => log(`save ${JSON.stringify(cfg)}`)()}
        onTest={async () => ({ ok: true })}
      />
    </div>
  ),
}

/** Imperative confirm via useConfirm(). */
export const Confirm: Story = {
  render: () => {
    const { confirm, dialog } = useConfirm()
    return (
      <div>
        <Button
          variant="destructive"
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete user?',
              message: 'ada@example.com — this cannot be undone.',
              confirmLabel: 'Delete',
              destructive: true,
            })
            log(`confirmed: ${ok}`)()
          }}
        >
          Delete user
        </Button>
        {dialog}
      </div>
    )
  },
}

/** Controlled ConfirmDialog. */
export const ConfirmControlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open confirm</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Are you sure?"
          message="This action is irreversible."
          destructive
          confirmLabel="Yes, do it"
          onConfirm={log('confirmed')}
        />
      </div>
    )
  },
}

/** Impersonation banner. */
export const Impersonation: Story = {
  render: () => (
    <ImpersonationBanner email="grace@example.com" onStop={log('stop impersonating')} />
  ),
}
