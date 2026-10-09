# Public responsive-layout branch security maintenance - 2026-10-09

Merged the reviewed main security update 7cb90d4 while preserving the sidebar, two-month calendar and responsive layout. The additional sidebar sign-out now awaits SDK server revocation and reports an unconfirmed logout on failure.

Validation: root/template and app builds, lint, five mocked SDK authentication tests, and production dependency audits are required. No real Supabase or business service is accessed. Development-only braces warnings and unconfirmed upstream licensing have the same limits as main.

Review and completion are recorded in the Harness section below. GitHub publication and CI results are tracked by the account audit.

<!-- harness:start -->
## Harness

- Task: 1774bcb447ea / Carry security fixes to public responsive branch
- 状態: done
- 次の作業: 完了。変更が生じた場合は再検証する
- 試行: 0/3
- 記録: .harness/1774bcb447ea/task.json
<!-- harness:end -->
