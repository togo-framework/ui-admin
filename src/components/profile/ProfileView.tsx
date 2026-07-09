"use client";

import * as React from "react";
import { ShieldCheck, Monitor, LogOut, User, KeyRound, Camera, Check } from "lucide-react";
import { cn, Avatar, AvatarFallback, AvatarImage, Card, CardContent, Button, Input, Label, Switch, Separator, StatusBadge } from "@togo-framework/ui-core";

export interface ProfileSession {
  id: string;
  device: string;
  location?: string;
  lastActive: string;
  current?: boolean;
}

export interface ProfileViewProps {
  user: { name?: string; email: string; avatarUrl?: string; roles?: string[] };
  language?: "en" | "ar";
  sessions?: ProfileSession[];
  twoFactorEnabled?: boolean;
  onSave?: (data: { name: string; email: string }) => void;
  onChangePassword?: () => void;
  onToggle2FA?: (enabled: boolean) => void;
  onRevokeSession?: (id: string) => void;
  onChangeAvatar?: () => void;
}

type SectionKey = "account" | "security" | "sessions";

const T = {
  en: {
    title: "Profile settings", subtitle: "Manage your account, security and active sessions.",
    account: "Account", security: "Security", sessions: "Sessions",
    accountDesc: "Your public profile and contact details.",
    securityDesc: "Password and two-factor authentication.",
    sessionsDesc: "Devices currently signed in to your account.",
    name: "Name", email: "Email", save: "Save changes", saved: "Saved",
    avatar: "Profile photo", changeAvatar: "Change photo",
    password: "Password", passwordDesc: "Set a strong, unique password.", changePassword: "Change password",
    twoFA: "Two-factor authentication", twoFADesc: "Add an extra layer of security to your account.",
    current: "This device", revoke: "Revoke", active: (n: number) => `${n} active session${n === 1 ? "" : "s"}`,
  },
  ar: {
    title: "إعدادات الملف", subtitle: "إدارة حسابك والأمان والجلسات النشطة.",
    account: "الحساب", security: "الأمان", sessions: "الجلسات",
    accountDesc: "ملفك العام وبيانات التواصل.",
    securityDesc: "كلمة المرور والمصادقة الثنائية.",
    sessionsDesc: "الأجهزة المسجّلة الدخول حاليًا إلى حسابك.",
    name: "الاسم", email: "البريد الإلكتروني", save: "حفظ التغييرات", saved: "تم الحفظ",
    avatar: "صورة الملف", changeAvatar: "تغيير الصورة",
    password: "كلمة المرور", passwordDesc: "اختر كلمة مرور قوية وفريدة.", changePassword: "تغيير كلمة المرور",
    twoFA: "المصادقة الثنائية", twoFADesc: "أضف طبقة حماية إضافية لحسابك.",
    current: "هذا الجهاز", revoke: "إنهاء", active: (n: number) => `${n} جلسة نشطة`,
  },
};

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

/** ProfileView — a real settings screen: a section sidebar (Account / Security / Sessions)
 * beside the active section's content. Product-agnostic (data + callbacks in), RTL + bilingual
 * via `language`, fully token-themed (dark/light). */
export function ProfileView({
  user, language = "en", sessions = [], twoFactorEnabled = false,
  onSave, onChangePassword, onToggle2FA, onRevokeSession, onChangeAvatar,
}: ProfileViewProps) {
  const t = T[language];
  const isRTL = language === "ar";
  const [section, setSection] = React.useState<SectionKey>("account");
  const [name, setName] = React.useState(user.name ?? "");
  const [email, setEmail] = React.useState(user.email);
  const [saved, setSaved] = React.useState(false);
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  const NAV: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
    { key: "account", label: t.account, icon: <User className="h-4 w-4" /> },
    { key: "security", label: t.security, icon: <ShieldCheck className="h-4 w-4" /> },
    { key: "sessions", label: t.sessions, icon: <Monitor className="h-4 w-4" /> },
  ];

  function save() {
    onSave?.({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-5xl p-6">
      {/* ── Header ── */}
      <header className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <div className="relative">
          <Avatar className="h-16 w-16">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name ?? user.email} />}
            <AvatarFallback className="bg-primary/10 text-lg text-primary">{initial}</AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold">{user.name || user.email}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        {user.roles && user.roles.length > 0 && (
          <div className="hidden flex-wrap gap-1.5 sm:flex">
            {user.roles.map((r) => <StatusBadge key={r} tone="info">{r}</StatusBadge>)}
          </div>
        )}
      </header>

      {/* ── Body: section sidebar + content ── */}
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible" aria-label={t.title}>
          {NAV.map((item) => {
            const active = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="min-w-0">
          {section === "account" && (
            <section>
              <SectionHeader title={t.account} desc={t.accountDesc} />
              <Card>
                <CardContent className="space-y-5 pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name ?? user.email} />}
                      <AvatarFallback className="bg-primary/10 text-primary">{initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{t.avatar}</p>
                      <Button variant="outline" size="sm" className="mt-1.5 gap-1.5" onClick={onChangeAvatar}>
                        <Camera className="h-3.5 w-3.5" />{t.changeAvatar}
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="pv-name">{t.name}</Label>
                      <Input id="pv-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pv-email">{t.email}</Label>
                      <Input id="pv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex justify-end">
                <Button onClick={save} className="gap-1.5">
                  {saved ? <><Check className="h-4 w-4" />{t.saved}</> : t.save}
                </Button>
              </div>
            </section>
          )}

          {section === "security" && (
            <section>
              <SectionHeader title={t.security} desc={t.securityDesc} />
              <Card>
                <CardContent className="divide-y divide-border pt-2">
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-start gap-3">
                      <KeyRound className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{t.password}</p>
                        <p className="text-sm text-muted-foreground">{t.passwordDesc}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={onChangePassword}>{t.changePassword}</Button>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{t.twoFA}</p>
                        <p className="text-sm text-muted-foreground">{t.twoFADesc}</p>
                      </div>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={(v) => onToggle2FA?.(v)} />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {section === "sessions" && (
            <section>
              <SectionHeader title={t.sessions} desc={t.sessionsDesc} />
              <Card>
                <CardContent className="space-y-3 pt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.active(sessions.length)}</p>
                  {sessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground">
                          <Monitor className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="flex items-center gap-2 text-sm font-medium">
                            {s.device}
                            {s.current && <StatusBadge tone="success">{t.current}</StatusBadge>}
                          </p>
                          <p className="text-xs text-muted-foreground">{[s.location, s.lastActive].filter(Boolean).join(" · ")}</p>
                        </div>
                      </div>
                      {!s.current && (
                        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onRevokeSession?.(s.id)}>
                          <LogOut className="h-4 w-4" />{t.revoke}
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
