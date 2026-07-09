import type { Meta, StoryObj } from "@storybook/react";
import { ProfileView } from "../components/profile/ProfileView";

const meta: Meta<typeof ProfileView> = {
  title: "Pages/Profile",
  component: ProfileView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: { inline: false, height: "560px" },
      description: {
        component:
          "ProfileView — a presentational account / security / sessions profile screen built " +
          "from the kit primitives (Avatar, Tabs, Card, Switch, StatusBadge). Product-agnostic: " +
          "pass user data + callbacks. RTL + bilingual via `language`, themed via tokens.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ProfileView>;

const sessions = [
  { id: "1", device: "MacBook Pro · Chrome", location: "Doha, QA", lastActive: "now", current: true },
  { id: "2", device: "iPhone 15 · Safari", location: "Doha, QA", lastActive: "2h ago" },
  { id: "3", device: "Windows · Edge", location: "Dubai, AE", lastActive: "Yesterday" },
];

export const Default: Story = {
  args: {
    user: { name: "Fady Mondy", email: "fady@example.com", roles: ["admin", "owner"] },
    sessions,
    twoFactorEnabled: true,
  },
};

export const NoAvatarNoRoles: Story = {
  args: {
    user: { email: "user@example.com" },
    sessions: sessions.slice(0, 1),
    twoFactorEnabled: false,
  },
};

export const ArabicRTL: Story = {
  args: {
    user: { name: "فادي مُندي", email: "fady@example.com", roles: ["مدير"] },
    language: "ar",
    sessions: [
      { id: "1", device: "ماك بوك · كروم", location: "الدوحة", lastActive: "الآن", current: true },
      { id: "2", device: "آيفون · سفاري", location: "الدوحة", lastActive: "قبل ساعتين" },
    ],
    twoFactorEnabled: true,
  },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};
