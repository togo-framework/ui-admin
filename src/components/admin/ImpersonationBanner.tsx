'use client'

import { ShieldOff, UserCog } from 'lucide-react'
import { adminStrings } from './strings'
import type { AdminLanguage } from './types'

export interface ImpersonationBannerProps {
  /** The impersonated user's email. When falsy the banner renders nothing. */
  email?: string | null
  /** Called when the admin clicks "Stop impersonating". */
  onStop: () => void
  language?: AdminLanguage
}

/**
 * ImpersonationBanner — sticky top banner shown while an admin is impersonating
 * another user. Presentational + product-agnostic: the host owns impersonation
 * state and passes `email` + `onStop`. Bilingual, RTL-aware.
 */
export function ImpersonationBanner({ email, onStop, language = 'en' }: ImpersonationBannerProps) {
  const s = adminStrings(language)
  if (!email) return null
  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-amber-500/90 px-4 py-2 text-sm font-medium text-black"
    >
      <UserCog className="size-4" />
      {s.impersonating} <span dir="ltr" className="font-semibold">{email}</span>
      <button
        type="button"
        onClick={onStop}
        className="ms-2 inline-flex items-center gap-1 rounded-md bg-black/15 px-2 py-0.5 transition-colors hover:bg-black/25"
      >
        <ShieldOff className="size-3.5" />
        {s.stopImpersonating}
      </button>
    </div>
  )
}
ImpersonationBanner.displayName = 'ImpersonationBanner'
