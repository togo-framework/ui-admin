'use client'

import { useState, type ReactNode } from 'react'
import { Mail, Send } from 'lucide-react'

import { adminStrings } from './strings'
import type { AdminLanguage, MailConfig, MailTestResult } from './types'
import { Card, CardContent, CardHeader, CardTitle, Input, Switch, Button, toast } from "@togo-framework/ui-core";

export interface MailSettingsFormProps {
  /** Initial SMTP config (e.g. fetched from your API). */
  value?: MailConfig
  /** Persist the config. Throw to surface an error toast. */
  onSave: (config: MailConfig) => Promise<void> | void
  /** Send a test email; return a structured { ok, error } result. */
  onTest: (to: string) => Promise<MailTestResult> | MailTestResult
  /** When false, shows the "endpoint unavailable" notice. */
  available?: boolean
  language?: AdminLanguage
  /** Optional override for the intro paragraph. */
  intro?: ReactNode
}

/**
 * MailSettingsForm — SMTP setup (host/port/username/password/from/secure) plus a
 * test-send. Product-agnostic: wire `onSave` / `onTest` to your API. Bilingual,
 * RTL-aware, token-themed.
 */
export function MailSettingsForm({
  value,
  onSave,
  onTest,
  available = true,
  language = 'en',
  intro,
}: MailSettingsFormProps) {
  const s = adminStrings(language)
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const [cfg, setCfg] = useState<MailConfig>({ port: 587, secure: true, ...(value ?? {}) })
  const [saving, setSaving] = useState(false)
  const [testTo, setTestTo] = useState('')
  const [testing, setTesting] = useState(false)

  const set = (k: keyof MailConfig, v: unknown) => setCfg((p) => ({ ...p, [k]: v }))

  async function save() {
    setSaving(true)
    try {
      await onSave(cfg)
      toast.success(s.saveChanges)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : s.testFailed)
    } finally {
      setSaving(false)
    }
  }

  async function sendTest() {
    if (!testTo.trim()) {
      toast.error(s.enterRecipient)
      return
    }
    setTesting(true)
    try {
      const r = await onTest(testTo.trim())
      if (r.ok) toast.success(`${s.testSentTo} ${testTo}`)
      else toast.error(r.error || s.testFailed)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : s.testFailed)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card dir={dir}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-4" />
          {s.mailTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{intro ?? s.mailIntro}</p>
        {!available ? (
          <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            {s.mailUnavailable}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={s.smtpHost}>
            <Input
              dir="ltr"
              placeholder="smtp.example.com"
              value={cfg.host ?? ''}
              onChange={(e) => set('host', e.target.value)}
            />
          </Field>
          <Field label={s.port}>
            <Input
              dir="ltr"
              type="number"
              value={String(cfg.port ?? 587)}
              onChange={(e) => set('port', Number(e.target.value))}
            />
          </Field>
          <Field label={s.username}>
            <Input
              dir="ltr"
              autoComplete="off"
              value={cfg.username ?? ''}
              onChange={(e) => set('username', e.target.value)}
            />
          </Field>
          <Field label={s.password}>
            <Input
              dir="ltr"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={cfg.password ?? ''}
              onChange={(e) => set('password', e.target.value)}
            />
          </Field>
          <Field label={s.fromAddress}>
            <Input
              dir="ltr"
              placeholder="App <no-reply@example.com>"
              value={cfg.from ?? ''}
              onChange={(e) => set('from', e.target.value)}
            />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
            <label className="text-sm">{s.useTls}</label>
            <Switch checked={!!cfg.secure} onCheckedChange={(v) => set('secure', v)} />
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-end gap-2">
            <Field label={s.sendTestTo}>
              <Input
                dir="ltr"
                type="email"
                placeholder="you@example.com"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
              />
            </Field>
            <Button variant="outline" onClick={sendTest} disabled={testing}>
              <Send className="size-4" />
              {s.sendTest}
            </Button>
          </div>
          <Button onClick={save} disabled={saving}>
            {s.saveChanges}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
MailSettingsForm.displayName = 'MailSettingsForm'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
