# Agent guide: stratora-website

This repo is the public marketing site, https://stratora.io. It is a static
React + Vite + Tailwind site, deployed to GitHub Pages by
`.github/workflows/deploy.yml`. It is not the Stratora application.

## PUBLIC REPO RULES

**This repository is public. Everything you write here (code, commits, issues,
PR text, comments) is visible to anyone.**

- **Never file, describe or discuss security vulnerabilities here.** Security
  work goes only to the private `Stratora-Platforms/stratora` repo, which is
  the only repo with the `security` label.
- **Never put internal hostnames, domain names, IP ranges, credentials, tokens
  or private backlog text in this repo**, including in issues and comments.
- **Customer-facing copy must not describe unreleased or unfixed security
  behaviour.** Only describe what the shipping release does.
- **Demo data on the site is fiction (the Halden Group estate).** Keep it
  fictional: `.example` hostnames, placeholder addresses, private-range
  subnets. Never copy real names, domains or addresses from a lab or customer
  system into a view, screenshot or data file.

If you are unsure whether something is safe to write here, put it in the
private stratora repo instead.

## Where the work is tracked

Work for this repo is tracked as issues in `Stratora-Platforms/stratora-website`
on the org project **Stratora Development**:
https://github.com/orgs/Stratora-Platforms/projects/1

The full workflow lives in the private stratora repo's `AGENTS.md`. The
essentials, so you can work from this repo alone:

### Approval (owner decision, 2026-10-16)

- **Board writes do not halt.** You may move board statuses, comment on
  issues and file new issues without halting for the owner's approval. Say
  in your report what you moved, posted and filed.
- **Check for private content first.** This repo (like stratora-docs) is
  public. Before filing or commenting here, check the text contains nothing
  private: no security detail, internal hostnames or lab box names,
  credentials, private backlog text (see PUBLIC REPO RULES). Security work
  only ever goes to the private `Stratora-Platforms/stratora` repo.
- **Closing needs evidence.** An issue closes as Done only through the
  owner's PR merge (`Closes #N`, which this repo allows only when nothing is
  left to prove after the merge; see below), or by closing it with an
  evidence comment that shows the fix on origin (see Evidence before Done).
  Never close without that evidence. Close as not planned only with the
  owner's approval.
- **Diff, commit and push keep the halt cadence.** Halt at the diff, before
  each commit and before each push, and wait for the owner's go-ahead at
  each one, except inside a workflow the owner has explicitly approved (for
  example an autonomous wave with standing approval to push per-issue
  branches and open PRs). Outside such a workflow, opening a PR also needs
  the go-ahead. **Merging always stays with the owner.** Merging a PR or
  pushing to `main` deploys the live site.

### Project fields

| Field | Values |
|-------|--------|
| Status | Backlog, Ready, In Progress, Code Review, QA / Testing, Blocked, Done |
| Priority | P0 Critical, P1 High, P2 Medium, P3 Low, P4 Enhancement |
| Release | Next release, Following release, Security release, Out-of-band, Later, Unscheduled |
| Work Type | Bug, Feature, Security, Tech Debt, Docs, Validation/QA, Investigation, Process/CI, Ops/Lab, Release |
| Agent | Claude Code, Codex, Nick, Unassigned |
| Legacy ID | Text. The old backlog ID, if the issue was migrated. |

Old severities S1..S5 map to P0..P4.

Labels: `area:*` (this repo is usually `area:website`), `blocked:hardware`,
`blocked:external`, `blocked:decision`, `needs-verify`, `needs-triage`,
`release-gate`, `customer-commitment`, `agent-filed`, `epic`. There is no
`security` label here, on purpose.

### Picking up an issue

If the owner named an issue, work that one. Otherwise take issues in Ready
first, then Backlog, highest Priority first. Do not take an issue that another
Agent already has In Progress, or one with a `blocked:*` label unless you are
clearing the blocker. After claiming, post a plan comment: what you will
change, how you will prove it, what is out of scope.

```bash
R=Stratora-Platforms/stratora-website
N=123   # issue number

gh issue view $N --repo $R --comments
gh issue edit $N --repo $R --add-assignee @me
gh issue comment $N --repo $R --body "Claimed by <your agent name>. Plan: ..."
```

Then set Status and Agent on the board. `item-add` returns the existing item
if the issue is already on the project:

```bash
P=PVT_kwDOD6e-Tc4BnYKF
ITEM=$(gh project item-add 1 --owner Stratora-Platforms \
  --url https://github.com/$R/issues/$N --format json --jq .id)

# Status -> In Progress
gh project item-edit --project-id $P --id $ITEM \
  --field-id PVTSSF_lADOD6e-Tc4BnYKFzhl9EfQ --single-select-option-id d6099c41

# Agent -> yourself (63043f31 is Claude Code; Codex uses a010a0e8)
gh project item-edit --project-id $P --id $ITEM \
  --field-id PVTSSF_lADOD6e-Tc4BnYKFzhl9Emw --single-select-option-id 63043f31
```

Status option IDs: Backlog `821c5bc9`, Ready `0bc56156`, In Progress
`d6099c41`, Code Review `67d340b5`, QA / Testing `6e420535`, Blocked
`06e5971d`, Done `ddc31e98`. Agent option IDs: Claude Code `63043f31`, Codex
`a010a0e8`, Nick `cdff2130`, Unassigned `c673d02c`. If an ID stops working,
list the current ones with
`gh project field-list 1 --owner Stratora-Platforms --format json`.

### Moving it along

- In Progress: you are working on it.
- Code Review: a PR or commit is ready for review.
- QA / Testing: merged, waiting on the deploy run and a check of the live
  site. This is where an issue sits between the merge and closing it.
- Blocked: add the matching `blocked:*` label and a comment saying what you
  are waiting on.
- Done: only through the owner's merge of a PR with `Closes #N` (when
  allowed, below) or after the evidence comment below.

Reference the issue in commits and PRs with `Refs #N`. Issues in other repos
need the full form, for example `Refs Stratora-Platforms/stratora-docs#N`.
Do not use `Closes #N`, `Fixes #N` or similar in a PR: the site deploys only
after the merge, so the deploy run and the live check are still owed when the
PR merges, and a closing keyword would close the issue (and move it to Done)
before that evidence exists. Close the issue by hand, with the evidence
comment below, once the deploy run is green and the live page is checked. The
only exception is a change with nothing to prove after merge (for example a
README edit that does not touch the site); then `Closes #N` is allowed.

**A merged PR does not move the board by itself.** Closing the issue moves it
to Done. So after merging, move the issue to QA / Testing yourself, and close
it only when it is really done.

### Evidence before Done

Before closing, comment on the issue with:

- what changed (one or two lines);
- the commit SHAs **on `origin/main`** and the PR. Run `git fetch` first and
  confirm each commit is there, for example with
  `git branch -r --contains <sha>` (it must list `origin/main`);
- how you checked it: `npm run build` result, what you looked at in
  `npm run dev` or the preview, at which widths;
- the Deploy to GitHub Pages run for that commit (link, green) and what you
  saw on https://stratora.io after it finished.

A local commit, a handoff claim or a green PR is not evidence. Never close an
issue without the commits on `origin/main` and the deploy result.

```bash
git fetch origin
git branch -r --contains abc1234   # must list origin/main
gh issue comment $N --repo $R --body "Done in abc1234 (on origin/main), PR #45. Built clean; checked at 390 and 1440 px; deploy run <link> green for abc1234; live site shows the change."
gh issue close $N --repo $R
```

If you could not verify something, say so and leave the issue in
QA / Testing with `needs-verify` instead of closing it.

### Filing new issues

File website work you find here, in stratora-website, at the moment you
find it. You do not need to ask first (see Approval above), but a new issue
is public: check the text for private content before you post it, and say in
your report what you filed. Label it `area:website` and `agent-filed`, add it
to the project, and set Priority, Work Type and Release (use `needs-triage`
and Release `Unscheduled` if you cannot judge). Put it under the epic
`Stratora-Platforms/stratora#19` (Product website) as a sub-issue. Write the
issue so it makes sense to a stranger, because it is public.

### Later backlog

Unscheduled P3/P4 work sits in "Later backlog: <epic>" checklist issues. This
repo has none yet; the private stratora repo has 21 and stratora-docs has 3.
Their full text is in the private repo's `docs/backlog-archive/`. If you
promote a Later backlog line into an issue here, write a new public
description (what users see, where, and what done looks like), keep its
Legacy ID and link the archive entry. **Never paste the archive text into
this repo**: it holds internal host names, lab details and private IDs.

```bash
gh issue create --repo $R --title "..." --body "..." \
  --label area:website --label agent-filed
```

Security findings, internal infrastructure problems and anything that needs
private context go to `Stratora-Platforms/stratora`, never here.

## Working on the site

### Install, build, preview

Node 20 (that is what CI uses). From the repo root:

```bash
npm install        # CI runs npm install, not npm ci
npm run dev        # Vite dev server
npm run build      # production build into dist/
npx vite preview   # serve dist/ locally (no npm script for this); default http://localhost:4173
```

There are no test or lint scripts. `npm run build` passing is the minimum
check; then look at the change in the browser at phone and desktop widths.

### How it deploys

Every push to `main` builds and deploys to GitHub Pages (`deploy.yml`, also
runnable by hand with workflow_dispatch). **Pushing or merging to `main`
publishes to the live site.** `public/CNAME` holds the `stratora.io` domain,
and `public/404.html` redirects unknown paths back to the SPA. Do not remove
either.

### Layout

- `src/app/App.tsx`, `src/app/pages/`, `src/app/components/`: the site.
- `src/app/constants.ts`: `RELEASE_VERSION` and the download and release-notes
  URLs built from it. Change the version here when a release ships; other
  places read it from this constant.
- `src/app/components/app-preview/`: the HTML recreations of app screens shown
  in the "See Stratora in action" carousel, with fictional data.
- `tools/screenshots/`: a separate Playwright package for capturing and
  checking the site. See its README. It is kept out of the root
  `package.json` on purpose so the Pages build never installs Playwright.

### Do not

- Do not push or merge to `main` without the owner's explicit approval for
  that push or merge (see Approval above). It deploys straight to production.
- Do not add Playwright or other heavy tooling to the root `package.json`.
- Do not commit `dist/`, `node_modules/`, `tools/screenshots/.env`,
  `tools/screenshots/.auth.json`, or anything in `tools/screenshots/out/` or
  `tools/screenshots/reference/`.
- Do not commit real app screenshots. The carousel uses recreated HTML views.
- Do not hard-code a release version anywhere except `constants.ts`.
- Do not describe features or fixes on the site that have not shipped.
