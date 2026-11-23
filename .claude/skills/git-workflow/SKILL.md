---
name: git-workflow
description: Branch, commit, push, and pull request workflow for this repository. Use at the start of any task that will change files (to get onto a feature branch before the first edit), and whenever the user asks to commit, push, open or update a PR, write a PR description, sync with master, or clean up after a merge. Covers branch naming, Conventional Commits, PR descriptions generated from the diff, and the GitHub CLI.
---

# Git workflow

`master` is the protected integration branch. All work happens on a feature
branch and reaches `master` through a pull request on GitHub
(`afrankenreider/django_mypage`). A project hook
(`.claude/hooks/protect-master.sh`) blocks `git commit` and `git push` while on
`master`; if it fires, you skipped step 1.

## 1. Before the first edit: get onto a branch

Run `git status -sb` and read the current branch.

- **On a feature branch that matches the task:** stay on it.
- **On a feature branch for different work:** ask the user whether to keep
  going there or start a new branch. Do not mix unrelated work in one branch.
- **On `master` (or `main`):** create a branch before editing anything.

```bash
git fetch origin
git switch -c <type>/<short-slug> origin/master
```

If `master` already has uncommitted changes, they belong to the new task, so
carry them over with `git switch -c <type>/<short-slug>` (no base argument).
Never stash to move work around.

Tell the user the branch name in one line. You don't need to ask first:
creating a local branch is the default here.

### Branch names

`<type>/<short-slug>`, lowercase kebab-case, at most about 40 characters.
The type matches the Conventional Commit type of the main change:

| Type | Use for |
|---|---|
| `feat/` | New user-facing feature or page |
| `fix/` | Bug fix |
| `design/` | Visual or UX change with no new behavior |
| `refactor/` | Code restructure, no behavior change |
| `docs/` | README, AGENTS.md, DESIGN.md, comments |
| `chore/` | Tooling, dependencies, CI, config, skills |
| `test/` | Tests only |

Examples: `feat/project-filter-tags`, `fix/navbar-focus-trap`,
`design/home-hero-type-scale`.

## 2. Commit as you go

Commit on the feature branch at each coherent step. No need to ask before a
local commit on a feature branch. Commits on `master` are never allowed.

- Stage specific paths (`git add <paths>`), not `git add -A`. Check
  `git status` first and leave out anything unrelated: `.env`, local
  databases, `staticfiles/collected/`, editor files.
- Never commit secrets. If a diff contains a key, token, or password, stop and
  tell the user.
- Use Conventional Commits: `type(scope): summary`. The summary is imperative,
  lowercase, no trailing period, at most 72 characters. Scopes used here:
  `frontend`, `api`, `projects`, `weekly-media`, `design`, `ci`, `deps`,
  `skills`, `docs`.
- Add a body when the reason isn't obvious from the summary: what changed and
  why, wrapped at 72 columns.
- No emojis anywhere (repo rule).
- End the message with any attribution lines the session tells you to use.
- If a pre-commit hook fails, fix the cause, re-stage, and make a **new**
  commit. Never use `--no-verify`.
- Don't amend or rebase commits that are already pushed.

```bash
git commit -m "feat(projects): add tag filter to projects page" -m "Filters are client-side because the list is small and already loaded."
```

## 3. Before opening a PR

1. Run `make check` and read the output. Don't open a PR on a failing check
   unless the user asks for a draft; then say what fails in the description.
2. If the frontend changed, run `make build` and commit the updated
   `staticfiles/frontend/` (Django serves the committed build).
3. Bring the branch up to date with `master`:
   - Not pushed yet: `git fetch origin && git rebase origin/master`
   - Already pushed: `git fetch origin && git merge origin/master`
4. Pushing publishes the branch, so do it only when the user asked for a push
   or a PR: `git push -u origin HEAD`. Never force-push to `master`. On a
   feature branch use `--force-with-lease` only after a rebase the user
   agreed to.

## 4. Write the PR description from the diff

Collect the facts first:

```bash
.claude/skills/git-workflow/scripts/pr-context.sh
```

It prints the commits, file stats grouped by area, and the full diff against
`origin/master`. Read the diff itself, not just the commit messages. The
description must match what the code actually does.

**Title:** Conventional Commit style, like a squash-merge summary:
`feat(frontend): add project tag filters`.

**Body:** use this structure (also in `.github/pull_request_template.md`):

```markdown
## Summary
One to three sentences: what this PR does and why, for someone who hasn't
seen the code.

## Changes
- **Frontend:** concrete changes, naming components, pages, or tokens.
- **Backend:** models, endpoints, serializers, migrations.
- **Tooling / CI:** build, dependencies, config.
(Only the areas that changed. Group by area, not by commit.)

## Screenshots
Before and after for UI changes, light and dark, desktop and mobile if
layout changed. Otherwise remove this section.

## How to test
- [ ] `make check`
- [ ] Specific manual steps: the route to open and what to look for.

## Notes
Follow-ups, known gaps, migrations to run, anything risky.
```

Rules for the body:

- Describe behavior and intent. Don't paste the diff or list every file.
- Call out migrations, new dependencies, environment variables, and anything
  that changes deployment.
- State test results as you saw them ("19 passed"), not "should pass".
- End with any PR attribution line the session tells you to use.

Write the body to a temp file and pass it with `--body-file`. That avoids
shell quoting problems.

## 5. Open or update the PR

The GitHub CLI is the default. Check it first: `gh auth status`.

```bash
gh pr create --base master --head "$(git branch --show-current)" \
  --title "feat(frontend): add project tag filters" \
  --body-file "$TMPDIR/pr-body.md"
```

- Add `--draft` when work is incomplete or checks fail.
- If a PR already exists for the branch (`gh pr view --json url`), update it
  with `gh pr edit --title ... --body-file ...` instead of opening another.
- Report the PR URL to the user.

**No `gh`, or not logged in:** don't try other ways to authenticate. Give the
user both commands, `brew install gh` and `gh auth login`, and in the meantime
give them the compare link with the description ready to paste:
`https://github.com/afrankenreider/django_mypage/compare/master...<branch>?expand=1`

Never merge a PR, enable auto-merge, or close one unless the user asks.

## 6. After a merge

When the user says the PR merged:

```bash
git switch master
git pull --ff-only origin master
git branch -d <branch>          # -d, not -D: refuses if unmerged
git push origin --delete <branch>   # only if GitHub didn't delete it
```

## Don't

- Commit or push on `master`.
- Use `git stash`, `git reset --hard`, `git clean -f`, or `git checkout -- .`
  to move or discard work without the user asking.
- Use `--no-verify`, or `--force` without `--with-lease`.
- Rewrite history that's already on GitHub.
- Write `@username` in PR text unless you mean to notify that person.
