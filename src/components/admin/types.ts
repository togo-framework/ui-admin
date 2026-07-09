'use client'

/**
 * admin/ — generic, product-agnostic user-management + mail-setup components.
 *
 * Ported from the Fort admin suite and made framework-agnostic for any togo
 * app: every component takes data + callback props (NO hardcoded URLs, NO data
 * fetching), is bilingual EN/AR via a `language` prop (Rule 8), RTL-aware, and
 * themed with semantic tokens only (Rule 16). Products wire the callbacks to
 * their own API client (Fort `/v1/admin/*`, GraphQL, REST, …).
 */

export type AdminLanguage = 'en' | 'ar'

/** A single user record shown in the management table / actions menu. */
export interface AdminUser {
  id?: string
  email?: string
  roles?: string[]
  permissions?: string[]
  created_at?: string
}

/** Result of generating a one-time link (reset / magic sign-in). */
export interface AdminLinkResult {
  /** The single-use URL, when the host returns one to display/copy. */
  link?: string
  /** true when the host emailed the link directly to the user. */
  emailed?: boolean
}

/** Payload for creating a user. */
export interface AddUserInput {
  email: string
  password?: string
  roles: string[]
}

/** Payload for editing a user. */
export interface EditUserInput {
  email: string
  roles: string[]
  permissions: string[]
}

/** SMTP configuration value. */
export interface MailConfig {
  host?: string
  port?: number
  username?: string
  password?: string
  from?: string
  secure?: boolean
}

/** Structured result of a test-send. */
export interface MailTestResult {
  ok: boolean
  error?: string
}
