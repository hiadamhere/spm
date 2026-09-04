---
name: spm
description: Use spm (Skill and Plugin Manager) to find, install, update, and tidy agent skills for the user's coding agents. Reach for it when the user asks "is there a skill for X", "how do I do X" in a specialised domain, wants a capability the agent lacks, mentions spm, catalogs, SKILL.md folders, or .agents/skills, or when a task would clearly go better with domain knowledge that a skill could supply.
---

# spm — Skill and Plugin Manager

spm installs reusable **skills** (a folder with a `SKILL.md` and optional `references/`) from Git-based
**catalogs** into every coding agent on the machine. It follows the open agent-skills conventions: one
shared copy in `.agents/skills/<skill>/` (project) or `~/.agents/skills/<skill>/` (global), plus a link from
each other agent's own skills folder to that copy. `spm agents` lists every
supported agent with its key, folders, and whether it is detected on this machine — use it instead of
remembering names.

Full detail lives in `references/`: [commands](references/commands.md) (every command and flag),
[concepts](references/concepts.md) (catalogs, scopes, the install model, doctor/cleanup, config),
[mcp](references/mcp.md) (spm as an MCP server). Read the one you need; do not load them all.

## When to use spm

- The user asks for something that is probably a packaged skill: "find a skill for X", "is there a
  skill that…", "how do I do X" for a framework, platform, or workflow (React performance, PDF handling,
  Cloudflare Workers, Uno Platform, Stripe, testing, deploys, …).
- You are about to work in a domain where you lack specifics and a well-known vendor skill exists.
- The user mentions skills, catalogs, `SKILL.md`, `.agents/skills`, or spm itself.
- Skills stopped working, folders look stale, or the user asks to clean up: `spm doctor`.

Do not use spm to install arbitrary code. A skill is instructions and reference files, never executables.

## MCP or command line?

spm is both a CLI and an MCP server (`spm mcp serve`). Pick one per task:

1. **spm's MCP tools are in your tool list** (a server named `spm` offering `search`, `info`, `install`,
   `list`, `catalog_sync`, `doctor`, …) → **use the tools**. They are structured, annotated (read-only vs
   destructive, so the host asks before `uninstall`, `catalog_remove`, `cleanup`), and need no shell.
2. **No spm tools available** → **run the CLI** through your shell tool. This is the common case.
3. **Always the CLI** for interactive pickers (`spm update` / `spm uninstall` with no name), fine control
   (`--agents`, `--copy`, `--project`/`--global`), scripting, and `spm cleanup --apply`.

Never start `spm mcp serve` yourself: the host launches it. Never mix both in one flow.

## Core flow: find → inspect → install

```bash
spm search "seo website"        # ranked, typo-tolerant search across the user's catalogs
spm info <skill>                # description, catalog, install status, reference-file count
spm install <skill>             # from a catalog by name
spm install org/repo            # or straight from a GitHub repo (pick one or more skills)
spm install org/repo/<skill>    # one skill from a repo, no picker
```

If `search` finds nothing, the user may have no catalogs: `spm catalog list`. Offer
`spm catalog import && spm catalog sync` (a curated index of well-known skill repositories), or
`spm catalog add <name> org/repo` for a specific library.

## Rules of engagement

- **Scope.** Inside a project (a folder with `.git` or `package.json`) install to the **project** unless
  the user wants it everywhere; pass `--project` explicitly in non-interactive runs. Use `--global` only
  when asked or when the skill is general-purpose and the user agrees.
- **Which agents.** By default spm writes the shared `.agents/skills` copy plus every agent it detects.
  To target a set: `--agents claude-code,windsurf`. `spm agents` lists keys and what is detected.
- **Ask before global installs, uninstalls, catalog removals, and `cleanup --apply`.** Read-only commands
  (`search`, `list`, `info`, `agents`, `doctor`, `catalog list`) need no confirmation.
- **Non-interactive.** In scripts and MCP, spm never prompts: inside a project it defaults to project
  scope (or pre-answer with `--answer:scope=0|1|2`), agents default to the detected ones, and `spm update`
  / `spm uninstall` with no name act on all / refuse. Pass flags instead of relying on prompts.
- **After installing**, tell the user which agents received it and where (spm prints each path). A newly
  installed skill is available to the agent on its next turn or session, depending on the agent.
- **Keep things current.** `spm update` refreshes what is installed; `spm doctor` explains anything odd;
  `spm cleanup` previews fixes and only changes things with `--apply`.

## Quick reference

| Task | Command |
|---|---|
| Find a skill | `spm search <text>` · `spm list` · `spm info <skill>` |
| Install | `spm install <skill>` · `spm install org/repo[/<skill>]` · flags `--project` `--global` `--all` `--agents a,b` `--copy` |
| Keep current | `spm update [<skill>] [--force]` · `spm resurrect` |
| Remove | `spm uninstall <skill> [--project\|--global\|--all]` |
| Catalogs | `spm catalog add <name> <url\|org/repo>` · `spm catalog import [source]` · `spm catalog sync` · `spm catalog list` · `spm catalog remove <name>` · `spm catalog root [path]` |
| Agents | `spm agents [--detected]` |
| Health | `spm doctor [--all] [--untracked]` · `spm cleanup [--apply] [--yes]` |
| Misc | `spm version` · `spm config prompts on\|off` · `spm --help` · `spm <command> --help` |

Everything else — exact flags, output, edge cases — is in [references/commands.md](references/commands.md).
