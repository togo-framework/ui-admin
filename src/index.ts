// @togo-framework/ui-admin — public API.
// Admin shell components: user/mail management, profile view, provider backend
// switcher. Product-agnostic, props-driven. Depends on @togo-framework/ui-core.

// ── Admin (user management + mail setup) ──
export * from "./components/admin";

// ── profile ──
export { ProfileView } from "./components/profile/ProfileView";
export type { ProfileViewProps, ProfileSession } from "./components/profile/ProfileView";

// ── providers (capability backend switcher) ──
export * from "./components/providers";
