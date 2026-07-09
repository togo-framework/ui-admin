<!-- togo-header -->
# @togo-framework/ui-admin

Admin shell components from the togo UI kit: user + mail management
(`admin/`), profile view (`profile/`), and capability-provider backend
switcher (`providers/`). Product-agnostic, props-driven — pass data and
callbacks, no hardcoded URLs.

Requires `@togo-framework/ui-core` (styles + primitives).

```bash
npm install @togo-framework/ui-admin @togo-framework/ui-core
```

```tsx
import "@togo-framework/ui-core/styles.css";
import { UserManagementTable, MailSettingsForm } from "@togo-framework/ui-admin";
```

Split out of the former monolithic `@togo-framework/ui` package.
<!-- togo-sponsors -->
