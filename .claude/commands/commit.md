---
description: Generate a Conventional Commit message from staged changes and commit.
---

# /commit — Conventional Commit helper

Goal: create a commit that follows the
[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
specification, based on the **currently staged** changes.

## Steps

1. Run `git status` and `git diff --cached` to inspect staged changes.
2. If nothing is staged, stop and ask the user what to stage (do **not** run
   `git add` automatically).
3. Pick the most appropriate **type**:
   - `feat` — a new user-facing feature
   - `fix` — a bug fix
   - `docs` — documentation only
   - `style` — formatting, whitespace, no logic change
   - `refactor` — code change that neither fixes a bug nor adds a feature
   - `perf` — performance improvement
   - `test` — adding or updating tests
   - `build` — build system, dependencies (e.g. `package.json`)
   - `ci` — CI configuration
   - `chore` — maintenance tasks that don't fit the above
4. Pick an optional **scope** matching the touched area
   (e.g. `coins`, `api`, `router`, `ui`, `docs`, `config`).
5. Write the **subject** line:
   - imperative mood ("add", not "added" / "adds")
   - lowercase, no trailing period
   - ≤ 72 characters
   - format: `type(scope): subject` or `type: subject`
6. If the change is non-trivial, add a short **body** explaining the _why_
   (wrap at ~72 chars, separated from the subject by a blank line).
7. For breaking changes, add a `BREAKING CHANGE:` footer **and** a `!` after
   the type/scope (e.g. `feat(api)!: drop legacy endpoint`).
8. Show the proposed commit message to the user and ask for confirmation
   before running `git commit`.

## Examples

```
feat(coins): add paginated coins table
```

```
fix(api): handle 429 rate limit responses
```

```
chore(deps): add @tanstack/react-query
```

```
refactor(coins)!: split CoinsTable into row components

BREAKING CHANGE: CoinsTable no longer accepts the `renderRow` prop.
```
