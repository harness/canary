# Privacy — DS Contracts

## What the plugin accesses

- **Canvas data** in the open Figma file: selection, page instances, component property names/values, component keys/names, file name / page name / file key (for deep links).
- **clientStorage** on the designer’s machine: settings, onboarding flag, proposal drafts, optional catalog cache.

## Network

- **v1 default:** `networkAccess.allowedDomains: ["none"]`. No outbound requests. Catalogs are **bundled**.
- **Optional:** If you configure a custom catalog manifest URL **and** allow-list that host in `manifest.json`, the plugin fetches only that manifest and its referenced catalog JSON files (10s timeout). No analytics, telemetry, or third-party SDKs in v1.

## What we do not do

- No rewriting of library components
- No uploading of file contents to Harness/Canary servers unless you explicitly open an issue URL you configured
- No tracking pixels

## Data leaving Figma

Only when **you** choose:

- **Copy markdown / handoff** → your clipboard  
- **Open GitHub / Harness issue** → browser with title/body you authored  

## Questions

See [SUPPORT.md](./SUPPORT.md).
