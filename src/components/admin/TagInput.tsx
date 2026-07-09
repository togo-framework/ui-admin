'use client'

import { useState } from 'react'
import { cn } from "@togo-framework/ui-core";

export interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  /** Input direction — tags like roles/emails are usually LTR. */
  dir?: 'ltr' | 'rtl'
}

/**
 * TagInput — comma/enter separated chips. Used for roles & permissions in the
 * user dialogs. Token-themed, logical-property spacing (RTL-safe).
 */
export function TagInput({ value, onChange, placeholder, className, dir = 'ltr' }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const add = (raw: string) => {
    const v = raw.trim().replace(/,$/, '')
    if (v && !value.includes(v)) onChange([...value, v])
    setDraft('')
  }
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5',
        className,
      )}
    >
      {value.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
        >
          {v}
          <button
            type="button"
            aria-label={`Remove ${v}`}
            onClick={() => onChange(value.filter((x) => x !== v))}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="min-w-[6rem] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        dir={dir}
        value={draft}
        placeholder={value.length ? '' : placeholder}
        onChange={(e) => {
          if (e.target.value.endsWith(',')) add(e.target.value)
          else setDraft(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => add(draft)}
      />
    </div>
  )
}
TagInput.displayName = 'TagInput'
