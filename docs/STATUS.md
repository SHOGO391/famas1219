# Public repository maintenance - 2026-10-09

Scope: SHOGO391 public repositories only. Private repositories and live business services are outside this change.

Implemented: Next/React updates in both packages, SDK authentication with session refresh and global sign-out, explicit public environment configuration, private reporting and build CI. Upstream license remains unconfirmed; no new project-wide license.

Validation: root and app lint/build commands passed; 5 SDK tests passed using synthetic fetch; both production dependency audits report no vulnerabilities. Root build validates the preserved template in an isolated temporary directory, then builds app, avoiding the old nested-router collision. Development-only braces advisory has no compatible upstream fix.

Review and completion status are recorded in the Harness section below. Public branch synchronization and CI results are tracked by the account audit. No live Supabase operations.

<!-- harness:start -->
## Harness

- Task: 47c5ac46367a / Update public reservation application security
- 状態: done
- 次の作業: 完了。変更が生じた場合は再検証する
- 試行: 0/3
- 記録: .harness/47c5ac46367a/task.json
<!-- harness:end -->
