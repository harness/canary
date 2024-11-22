import type { EnumPrincipalType, EnumPullReqState } from '../components/pull-request/interfaces'

export const mockPullReqMetadata = {
  number: 5,
  created: 1723594951898,
  edited: 1723594951898,
  state: 'open' as EnumPullReqState,
  is_draft: false,
  title: 'prwithnoConflicts.txt',
  description:
    '## Describe your changes\n\n## Code Author Checklist\n\n[Code Author Guidelines](https://harness.atlassian.net/wiki/spaces/ENGOPS/pages/21149417486/Code+Review+Guidelines#Code-Author-Guidelines)\n\n- [ ] Description explains "what" and "why" behind the changes with links to relevant documentation, Jira tickets, design documents, UX Mocks, testing, screenshots/videos etc. [Link](https://harness.atlassian.net/wiki/spaces/ENGOPS/pages/21149417486/Code+Review+Guidelines#Write-Good-PR-Descriptions)\n- [ ] Tested the changes in the Local/Devspace environment.\n- [ ] Reviewed own changes for forward and backward compatibility. [Link](https://harness.atlassian.net/wiki/spaces/ENGOPS/pages/21686157314/Common+Pitfalls+Guide+for+Developers#Incompatible-Changes)\n- [ ] Reviewed own changes to ensure changes don\'t require multiple services to be deployed together. [Link](https://harness.atlassian.net/wiki/spaces/ENGOPS/pages/21686157314/Common+Pitfalls+Guide+for+Developers#Changes-Spanning-Multiple-Services)\n- [ ] Reviewed own changes to be rollback safe.\n- [ ] Added appropriate indexes for new/updated DB queries.\n- [ ] Reviewed own code for other potential pitfalls listed [here](https://harness.atlassian.net/wiki/spaces/ENGOPS/pages/21686157314/Common+Pitfalls+Guide+for+Developers).\n- [ ] (If applicable - codebasehashcheck failed) Updated PR description with answers from this [checklist](https://harness.atlassian.net/wiki/spaces/DEL/pages/21016838831/PR+Codebasehash+Check+merge+checklist)\n- [ ] (If applicable) For newly added expressions, similar expressions are validated in devspace.\n- [ ] Checked that JavaComponent Test is required or not and triggered if needed.\n- [ ] Checked that JavaCVNG Test is required or not and triggered if needed.\n\n## Lead Reviewer\n\n[Mention the name of the code reviewer who is the primary reviewer of this PR. It can be a code owner, SME (Subject Matter Expert), or other engineer with expertise in the impacted code area]\n\n## [Latest PR Check Triggers]\n\n<details>\n  <summary>PR Check triggers</summary>\nYou can run multiple PR check triggers by comma separating them in a single comment. e.g. `trigger ut0, ut1`\n\n- Compile: `trigger compile`\n- CodeformatCheckstyle: `trigger checkstylecodeformat`\n  - CodeFormat: `trigger codeformat`\n  - Checkstyle: `trigger checkstyle`\n- MessageMetadata: `trigger messagecheck`\n- File-Permission-Check: `trigger checkpermission`\n- Recency: `trigger recency`\n- BuildNumberMetadata: `trigger buildnum`\n- Trigger CommonChecks: `trigger commonchecks`\n- PMD: `trigger pmd`\n- Copyright Check: `trigger copyrightcheck`\n- Feature Name Check: `trigger featurenamecheck`\n- Unit Tests, ALL: `trigger uts`\n  - UnitTests-0: `trigger ut0`\n  - UnitTests-1: `trigger ut1`\n  - UnitTests-2: `trigger ut2`\n  - UnitTests-3: `trigger ut3`\n  - UnitTests-4: `trigger ut4`\n  - UnitTests-5: `trigger ut5`\n  - UnitTests-6: `trigger ut6`\n  - UnitTests-7: `trigger ut7`\n  - UnitTests-8: `trigger ut8`\n  - UnitTests-9: `trigger ut9`\n  - UnitTests-10: `trigger ut10`\n  - UnitTests-11: `trigger ut11`\n  - UnitTests-12: `trigger ut12`\n  - UnitTests-13: `trigger ut13`\n  - UnitTests-14: `trigger ut14`\n  - UnitTests-ComponentTests: `trigger componentTests`\n  - UnitTests-CVNGTests: `trigger cvngTests`\n- CodeBaseHash: `trigger codebasehash`\n- SonarScan: `trigger ss`\n- GitLeaks: `trigger gitleaks`\n- Trigger all Checks: `trigger smartchecks`\n- Go Build: `trigger gobuild`\n- Validate_Reviews: `trigger review`\n- Module Dependency Check: `trigger mdc`\n- Bazel Hygiene Check: `trigger bazelcheck`\n- CodeGuidelinesCheck-codepulse: `trigger codeGuidelines`\n- Helm Unit Tests: `trigger helmtests`\n</details>\n\n## PR check failures and solutions\nhttps://harness.atlassian.net/wiki/spaces/BT/pages/21106884744/PR+Checks+-+Failures+and+Solutions\n\n### Rebase Instructions:\nTo rebase your branch onto the latest changes in the target branch, simply use the following command in a comment: `/rebase`\n\n\n\n## [Contributor license agreement](https://github.com/harness/harness-core/blob/develop/CONTRIBUTOR_LICENSE_AGREEMENT.md)',

  source_repo_id: 24,
  source_branch: 'source_branch0',
  source_sha: '048f7030a246c1935e1ae836f3a8e112f9e1bc2a',
  target_repo_id: 24,
  target_branch: 'main',
  merged: null,
  merge_method: undefined,
  merge_check_status: 'mergeable',
  merge_target_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  merge_base_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  author: {
    id: 3,
    uid: 'admin',
    display_name: 'Administrator',
    email: 'admin@gitness.io',
    type: 'user' as EnumPrincipalType,
    created: 1699863416002,
    updated: 1699863416002
  },
  merger: undefined,
  stats: {
    commits: 1,
    files_changed: 1,
    additions: 1,
    deletions: 0
  }
}

export const mockPullReqMetadataUnchecked = {
  number: 5,
  created: 1723594951898,
  edited: 1723594951898,
  state: 'open' as EnumPullReqState,
  is_draft: false,
  title: 'prwithnoConflicts.txt',
  description: 'tt',
  source_repo_id: 24,
  source_branch: 'noConflicts',
  source_sha: '048f7030a246c1935e1ae836f3a8e112f9e1bc2a',
  target_repo_id: 24,
  target_branch: 'main',
  merged: null,
  merge_method: undefined,
  merge_check_status: 'unchecked',
  merge_target_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  merge_base_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  author: {
    id: 3,
    uid: 'admin',
    display_name: 'Administrator',
    email: 'admin@gitness.io',
    type: 'user' as EnumPrincipalType,
    created: 1699863416002,
    updated: 1699863416002
  },
  merger: undefined,
  stats: {
    commits: 1,
    files_changed: 1,
    additions: 1,
    deletions: 0
  }
}

export const mockPullReqMetadataConflict = {
  number: 5,
  created: 1723594951898,
  edited: 1723594951898,
  state: 'open' as EnumPullReqState,
  is_draft: false,
  title: 'prwithnoConflicts.txt',
  description: '',
  source_repo_id: 24,
  source_branch: 'noConflicts',
  source_sha: '048f7030a246c1935e1ae836f3a8e112f9e1bc2a',
  target_repo_id: 24,
  target_branch: 'main',
  merged: null,
  merge_method: undefined,
  merge_check_status: 'conflict',
  merge_target_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  merge_base_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  author: {
    id: 3,
    uid: 'admin',
    display_name: 'Administrator',
    email: 'admin@gitness.io',
    type: 'user' as EnumPrincipalType,
    created: 1699863416002,
    updated: 1699863416002
  },
  merger: undefined,
  stats: {
    commits: 1,
    files_changed: 1,
    additions: 1,
    deletions: 0
  }
}
