// admin/ — generic, product-agnostic user-management + mail-setup components.
// Ported from the Fort admin suite (RTL-ready, bilingual EN/AR, token-themed).
// Every component is props-driven: pass data + callbacks, NO hardcoded URLs.

export { UserManagementTable } from './UserManagementTable'
export type { UserManagementTableProps } from './UserManagementTable'

export { UserActionsMenu } from './UserActionsMenu'
export type { UserActionsMenuProps } from './UserActionsMenu'

export { AddUserDialog, AddUserButton } from './AddUserDialog'
export type { AddUserDialogProps, AddUserButtonProps } from './AddUserDialog'

export { MailSettingsForm } from './MailSettingsForm'
export type { MailSettingsFormProps } from './MailSettingsForm'

export { ConfirmDialog, useConfirm } from './ConfirmDialog'
export type {
  ConfirmDialogProps,
  ConfirmOptions,
  UseConfirmResult,
} from './ConfirmDialog'

export { ImpersonationBanner } from './ImpersonationBanner'
export type { ImpersonationBannerProps } from './ImpersonationBanner'

export { TagInput } from './TagInput'
export type { TagInputProps } from './TagInput'

export { adminStrings } from './strings'
export type { AdminStrings } from './strings'

export type {
  AdminLanguage,
  AdminUser,
  AdminLinkResult,
  AddUserInput,
  EditUserInput,
  MailConfig,
  MailTestResult,
} from './types'
