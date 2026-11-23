#!/usr/bin/env bash
# PreToolUse hook for Bash: block commits and pushes on master/main so work
# goes through a feature branch and a pull request. Exit 2 blocks the call
# and sends stderr back to Claude.

set -uo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)"
cwd="$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)"
[ -z "$cmd" ] && exit 0

# "git", then global options (-C <dir>, -c <k=v>, --flag), then the subcommand.
git_prefix='(^|[;&|(`[:space:]])git([[:space:]]+(-[Cc][[:space:]]+[^[:space:]]+|-[^[:space:]]+))*[[:space:]]+'
runs() { printf '%s' "$cmd" | grep -Eq "${git_prefix}$1([[:space:]]|\$)"; }

runs commit || runs push || exit 0

# Resolve the repo the command targets: an explicit -C wins over cwd.
dir="$(printf '%s' "$cmd" | sed -nE 's/.*git[[:space:]]+-C[[:space:]]+([^[:space:]]+).*/\1/p' | head -n1)"
dir="${dir%\"}"; dir="${dir#\"}"
base="${cwd:-${CLAUDE_PROJECT_DIR:-.}}"
case "$dir" in
  "") dir="$base" ;;
  /*) ;;
  *) dir="$base/$dir" ;;
esac
branch="$(git -C "$dir" branch --show-current 2>/dev/null || true)"

block() {
  echo "Blocked by .claude/hooks/protect-master.sh: $1" >&2
  echo "Create a feature branch first (git switch -c <type>/<slug>), commit there, and open a PR to master. See the git-workflow skill." >&2
  exit 2
}

case "$branch" in
  master|main)
    runs commit && block "committing directly on $branch."
    runs push && block "pushing from $branch."
    ;;
esac

# From any branch, refuse pushes that name master/main as the destination.
if runs push && printf '%s' "$cmd" | grep -Eq 'push.*([[:space:]]|:)(refs/heads/)?(master|main)([[:space:]]|$)'; then
  block "pushing to master/main. Open a pull request instead."
fi

exit 0
