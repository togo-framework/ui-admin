'use client'

import type { AdminLanguage } from './types'

/**
 * Bilingual chrome strings for the admin component suite (Rule 8).
 * Self-contained EN/AR — no LanguageProvider required, matching the
 * `language`-prop pattern used by DataTable / ProfileView.
 */
export interface AdminStrings {
  // generic
  cancel: string
  create: string
  done: string
  saveChanges: string
  optional: string
  // add / edit user
  addUser: string
  addUserDesc: string
  editUser: string
  email: string
  password: string
  roles: string
  permissions: string
  rolesPlaceholder: string
  emailRequired: string
  // actions
  edit: string
  impersonate: string
  resetPassword: string
  sendMagicLink: string
  delete: string
  actions: string
  // reset dialog
  newPassword: string
  setPassword: string
  sendResetLink: string
  resetBlankHint: string
  passwordResetLink: string
  magicSignInLink: string
  // link result
  emailedToUser: string
  shareSingleUse: string
  noLinkReturned: string
  copy: string
  copied: string
  // delete confirm
  deleteUserQ: string
  cannotBeUndone: string
  // impersonation banner
  impersonating: string
  stopImpersonating: string
  // table
  joined: string
  noUsers: string
  noUsersDesc: string
  member: string
  // mail
  mailTitle: string
  mailIntro: string
  mailUnavailable: string
  smtpHost: string
  port: string
  username: string
  fromAddress: string
  useTls: string
  sendTestTo: string
  sendTest: string
  enterRecipient: string
  testSentTo: string
  testFailed: string
}

const EN: AdminStrings = {
  cancel: 'Cancel',
  create: 'Create',
  done: 'Done',
  saveChanges: 'Save changes',
  optional: 'optional',
  addUser: 'Add user',
  addUserDesc: 'Create a new account',
  editUser: 'Edit user',
  email: 'Email',
  password: 'Password',
  roles: 'Roles',
  permissions: 'Permissions',
  rolesPlaceholder: 'admin, member…',
  emailRequired: 'Email is required',
  edit: 'Edit',
  impersonate: 'Impersonate',
  resetPassword: 'Reset password',
  sendMagicLink: 'Send magic link',
  delete: 'Delete',
  actions: 'Actions',
  newPassword: 'New password',
  setPassword: 'Set password',
  sendResetLink: 'Send reset link',
  resetBlankHint: 'Leave blank to email a reset link',
  passwordResetLink: 'Password reset link',
  magicSignInLink: 'Magic sign-in link',
  emailedToUser: 'The link was emailed to the user.',
  shareSingleUse: 'Share this single-use link:',
  noLinkReturned: 'No link was returned.',
  copy: 'Copy',
  copied: 'Copied',
  deleteUserQ: 'Delete user?',
  cannotBeUndone: 'this cannot be undone.',
  impersonating: 'Impersonating',
  stopImpersonating: 'Stop impersonating',
  joined: 'Joined',
  noUsers: 'No users',
  noUsersDesc: 'New sign-ups and accounts appear here.',
  member: 'member',
  mailTitle: 'Mail (SMTP)',
  mailIntro: 'Outbound email for password resets, magic links and invitations.',
  mailUnavailable: 'Mail endpoint is not available in this build.',
  smtpHost: 'SMTP host',
  port: 'Port',
  username: 'Username',
  fromAddress: 'From address',
  useTls: 'Use TLS/SSL',
  sendTestTo: 'Send test email to',
  sendTest: 'Send test',
  enterRecipient: 'Enter a recipient',
  testSentTo: 'Test email sent to',
  testFailed: 'Test failed',
}

const AR: AdminStrings = {
  cancel: 'إلغاء',
  create: 'إنشاء',
  done: 'تم',
  saveChanges: 'حفظ التغييرات',
  optional: 'اختياري',
  addUser: 'إضافة مستخدم',
  addUserDesc: 'إنشاء حساب جديد',
  editUser: 'تعديل المستخدم',
  email: 'البريد الإلكتروني',
  password: 'كلمة المرور',
  roles: 'الأدوار',
  permissions: 'الصلاحيات',
  rolesPlaceholder: 'مدير، عضو…',
  emailRequired: 'البريد الإلكتروني مطلوب',
  edit: 'تعديل',
  impersonate: 'انتحال الهوية',
  resetPassword: 'إعادة تعيين كلمة المرور',
  sendMagicLink: 'إرسال رابط دخول',
  delete: 'حذف',
  actions: 'إجراءات',
  newPassword: 'كلمة مرور جديدة',
  setPassword: 'تعيين كلمة المرور',
  sendResetLink: 'إرسال رابط إعادة التعيين',
  resetBlankHint: 'اتركه فارغًا لإرسال رابط إعادة التعيين بالبريد',
  passwordResetLink: 'رابط إعادة تعيين كلمة المرور',
  magicSignInLink: 'رابط الدخول السحري',
  emailedToUser: 'تم إرسال الرابط إلى المستخدم بالبريد.',
  shareSingleUse: 'شارك هذا الرابط ذا الاستخدام الواحد:',
  noLinkReturned: 'لم يتم إرجاع أي رابط.',
  copy: 'نسخ',
  copied: 'تم النسخ',
  deleteUserQ: 'حذف المستخدم؟',
  cannotBeUndone: 'لا يمكن التراجع عن هذا.',
  impersonating: 'انتحال هوية',
  stopImpersonating: 'إيقاف انتحال الهوية',
  joined: 'انضم',
  noUsers: 'لا يوجد مستخدمون',
  noUsersDesc: 'تظهر الحسابات الجديدة هنا.',
  member: 'عضو',
  mailTitle: 'البريد (SMTP)',
  mailIntro: 'البريد الصادر لإعادة تعيين كلمات المرور وروابط الدخول والدعوات.',
  mailUnavailable: 'نقطة نهاية البريد غير متوفرة في هذه النسخة.',
  smtpHost: 'خادم SMTP',
  port: 'المنفذ',
  username: 'اسم المستخدم',
  fromAddress: 'عنوان المُرسِل',
  useTls: 'استخدام TLS/SSL',
  sendTestTo: 'إرسال بريد تجريبي إلى',
  sendTest: 'إرسال تجريبي',
  enterRecipient: 'أدخل مستلمًا',
  testSentTo: 'تم إرسال البريد التجريبي إلى',
  testFailed: 'فشل الإرسال التجريبي',
}

const TABLE: Record<AdminLanguage, AdminStrings> = { en: EN, ar: AR }

export function adminStrings(language: AdminLanguage): AdminStrings {
  return TABLE[language] ?? EN
}
