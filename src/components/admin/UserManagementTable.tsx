'use client'

import type { ReactNode } from 'react'
import { Users } from 'lucide-react'

import { adminStrings } from './strings'
import type { AdminLanguage, AdminUser } from './types'
import { Card, CardContent, Avatar, AvatarFallback, Badge, EmptyState, cn } from "@togo-framework/ui-core";

export interface UserManagementTableProps {
  users: AdminUser[]
  language?: AdminLanguage
  loading?: boolean
  /** Optional slot above the list (e.g. an <AddUserButton />). */
  toolbar?: ReactNode
  /** Click handler for a row (excluding the actions column). */
  onRowClick?: (user: AdminUser) => void
  /** Render the per-row actions column — typically a <UserActionsMenu />. */
  renderActions?: (user: AdminUser) => ReactNode
  /** Override the empty-state copy. */
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

/**
 * UserManagementTable — accounts list with avatar, email, role badges and an
 * actions column. Presentational + product-agnostic: pass `users` and render
 * the actions via `renderActions`. Bilingual, RTL-aware, token-themed.
 */
export function UserManagementTable({
  users,
  language = 'en',
  loading,
  toolbar,
  onRowClick,
  renderActions,
  emptyTitle,
  emptyDescription,
  className,
}: UserManagementTableProps) {
  const s = adminStrings(language)
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className={cn('space-y-4', className)} dir={dir}>
      {toolbar ? <div className="flex items-center justify-end">{toolbar}</div> : null}
      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <EmptyState
              className="py-16"
              title={emptyTitle ?? (loading ? '…' : s.noUsers)}
              description={emptyDescription ?? s.noUsersDesc}
              icon={<Users size={28} />}
            />
          ) : (
            <ul className="divide-y divide-border">
              {users.map((u, i) => (
                <li
                  key={u.id ?? i}
                  className="flex items-center gap-1 pe-3 transition-colors hover:bg-accent/50"
                >
                  <button
                    type="button"
                    onClick={() => onRowClick?.(u)}
                    disabled={!onRowClick}
                    className="flex flex-1 items-center justify-between gap-4 px-5 py-3.5 text-start text-sm disabled:cursor-default"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {(u.email ?? '?').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate font-medium" dir="ltr">
                          {u.email}
                        </span>
                        {u.created_at ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {s.joined} {new Date(u.created_at).toLocaleDateString()}
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center justify-end gap-1.5">
                      {(u.roles ?? []).length ? (
                        (u.roles ?? []).map((r) => (
                          <Badge key={r} variant="secondary">
                            {r}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">{s.member}</Badge>
                      )}
                    </span>
                  </button>
                  {renderActions ? <div className="shrink-0">{renderActions(u)}</div> : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
UserManagementTable.displayName = 'UserManagementTable'
