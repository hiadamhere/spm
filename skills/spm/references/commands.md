# spm command reference

Every command, its flags, and how it behaves without a terminal. `spm <command> --help` prints the same
information from the binary itself; `spm` with no arguments opens an interactive REPL with Tab completion.
Aliases are shown in parentheses. MCP tool names flatten spaces to underscores (`catalog sync` →
`catalog_sync`); a few terminal-only conveniences are hidden from MCP and marked *(CLI only)*.

## Discovering skills

### `spm search <query>` (`find`) — read-only
Ranked, relevance-based search across the names and descriptions of every skill in the synced catalogs.
Tolerant of word order, partial words, and typos. Prints skill, catalog, description, install status.
Needs at least one synced catalog.

### `spm list [--installed]` (`ls`) — read-only
Every skill across the synced catalogs, grouped by catalog, with description and install status
(`installed (project|global|all)` or `available`). `--installed` keeps only tracked skills.
`spm list <catalog>` *(CLI only)* filters to one catalog by name.

### `spm info <skill>` (`show`) — read-only
Detail view: catalog, description, install status and scope, version (source commit), agents it was
deployed to, and the number of reference files. Works for installed skills even when their catalog is gone.

### `spm agents [--detected]`
Every supported agent: key (for `--agents`), display name, project folder, global folder, and whether
the agent is detected on this machine. `*` marks agents that read the shared `.agents/skills` folder
directly (no link needed). `--detected` shows only detected ones.

## Installing

### `spm install <skill | org/repo | org/repo/skill>` (`i`)
Deploys a skill. Sources:

- `<skill>` — a name from the synced catalogs (lowest catalog priority number wins on collisions).
- `org/repo` — any GitHub repo with skills; one skill installs directly, several open a multi-select
  (or use `--skills a,b`). The repo is registered as a catalog on the fly so `spm update` keeps working.
- `org/repo/<skill>` — one skill from a repo, no picker.

Flags:

| Flag | Effect |
|---|---|
| `--project` | Deploy into the current project only (`.agents/skills/` + linked agent folders under the project). |
| `--global` | Deploy to the user-level folders only (`~/.agents/skills/` + linked agent folders under home). |
| `--all` | Both scopes. |
| `--agents a,b` | Only these agent keys (see `spm agents`); the shared `.agents/skills` copy is always written. spm 0.3 keys `claude`, `gemini`, `copilot`, `hermes` still work as aliases. `--agents universal` = the shared copy only. |
| `--copy` | Copy the skill into every agent folder instead of linking to the shared copy. |
| `--skills a,b` | With `org/repo`: which skills to install, skipping the picker. |
| `--catalog <name>` | Resolve the skill from this catalog only (used by `update` to pin the source). |
| `--answer:scope=0|1|2` | Pre-answer the scope question for non-interactive runs: 0 project, 1 global, 2 all. |

Behaviour:

- **Scope question.** Inside a project (a folder with `.git` or `package.json`) with no scope flag, a
  terminal asks project / global / all; non-interactive runs default to **project**. Outside a project the
  install is global.
- **Agent question.** A terminal shows the agents that need their own folder, detected ones pre-checked
  (Claude Code if none), last choice remembered; non-interactive runs use the **detected** agents.
- **What is written.** The skill folder is copied once to `.agents/skills/<skill>/` (or `~/.agents/skills/`),
  which the "universal" agents read directly (`spm agents` marks them `*`). Each other selected agent gets a directory link to that copy (symlink;
  junction on Windows, no admin rights; a full copy if linking fails). At project scope a non-universal
  agent is linked only if its root folder (e.g. `.windsurf/`) already exists in the project — Claude Code
  is always linked — so a repo is never littered with agent folders.
- **Tracking.** `~/.spm/config.json` records the skill's catalog/source, version (commit), scope, project
  path, agents, and mode (`link`/`copy`) so `update`, `uninstall`, and `doctor` know what to touch.

### `spm update [<skill>] [--force]`
With a name: re-fetch that skill's source and, if its version changed (or `--force`), redeploy to exactly
the scope, agents, and project directory it was installed with — from any working directory. Without a
name: a terminal shows a multi-select of installed skills; non-interactive runs update all of them. Update
refreshes only deployments that still exist; if every file is gone the skill is marked **lost** (see
`resurrect`). Skills deployed by spm ≤ 0.3 are migrated to the shared-copy layout and their old rule files
removed, even when the source is unchanged.

### `spm resurrect`
Lists skills marked lost (files deleted by hand). On a terminal, pick which to **restore** (reinstall where
they were) or **forget** (drop from tracking). Non-interactive runs only list them.

### `spm uninstall [<skill>] [--project|--global|--all]` (`remove`)
Removes the skill's links and shared copy from the chosen scope, then prunes now-empty agent folders and
any spm ≤ 0.3 rule files. Scope defaults to how the skill was installed; from a different directory than
the recorded project, spm asks you to run it there or pass `--global`/`--all`. Without a name, a terminal
asks for a scope and shows a multi-select of installed skills *(CLI only)*. Nothing is reported as
removed unless it actually was; failures keep the tracking record.

## Catalogs

### `spm catalog add <name> <url|org/repo> [--priority N] [--local <path>]`
Subscribe to a skills repo. `name` is also the clone folder name. `--priority` (default 100, lower wins)
resolves same-named skills across catalogs. `--local <path>` reuses an existing clone (or clones there);
`catalog remove` never deletes a `--local` clone. Run `spm catalog sync` afterwards.

### `spm catalog import [<catalog.json URL | org/repo | official>]`
Subscribe to every repo listed in a `catalog.json` index. No argument *(CLI only)* or `official` = spm's
curated featured index (which includes spm's own `spm` skill). Then `spm catalog sync`.

### `spm catalog sync` — idempotent
Clone or pull every subscribed catalog. Records the sync time (used by the launch courtesy below).

### `spm catalog list` — read-only
Configured catalogs with URL, priority, and sync status.

### `spm catalog remove <name>` — destructive
Drop a catalog and delete its clone (unless it was `--local`). Installed skills stay installed.

### `spm catalog root [<path>|default]`
Show, or set, where catalog clones are stored (default `~/.spm/catalogs/`). `SPM_HOME` relocates all of
spm's data instead.

## Health

### `spm doctor [--all] [--untracked]` — read-only
Diagnoses every tracked skill per scope — healthy, **lost**, **partial** (an agent folder missing),
**broken link**, **0.3 layout** (run `spm update <skill>`), **copy, not link**, **content differs**,
**project gone** — and inventories spm's folders: untracked skill folders (counted by default, listed with
`--untracked`), `.spm-stage-*` leftovers, stale catalog clones, forgotten temp clones, unsynced catalogs.
`--all` also lists healthy deployments. Each row names the command that fixes it.

### `spm cleanup [--apply] [--yes]` — destructive
Preview (default) or perform (`--apply`) the safe fixes: unlink broken links, move staging leftovers and
stale clones to `~/.spm/quarantine/<timestamp>/` (mirroring their original paths), delete spm's temp
clones, flag lost records for `resurrect`. On a terminal `--apply` asks first; `--yes` skips the question.
Untracked folders and folders with edited content are never touched.

## Misc

### `spm version` — read-only
Prints `spm <version>+<commit>`.

### `spm config prompts on|off` — idempotent
Enable or disable the interactive-launch courtesy: on a bare `spm` in a real terminal, spm offers to import
the featured catalog when there are none, or to sync when catalogs are older than 7 days. `SPM_NO_PROMPT=1`
also silences it. Never shown with arguments, redirected input, in CI, or under MCP.

### `spm mcp serve`
Run spm as an MCP stdio server for an agent host. See [mcp.md](mcp.md). Do not run it by hand.

## Environment

| Variable | Effect |
|---|---|
| `SPM_HOME` | Where config, catalog clones, and quarantine live (default `~/.spm`). |
| `SPM_NO_PROMPT` | Silence the interactive-launch courtesy. |
| `XDG_CONFIG_HOME`, `CODEX_HOME`, `CLAUDE_CONFIG_DIR`, `VIBE_HOME`, `HERMES_HOME`, `AUTOHAND_HOME`, `GROK_HOME` | Honoured when resolving those agents' global folders. |
| `CI` | Treated as non-interactive. |

## Exit status and output

Human output is Spectre-rendered text; `--output:json` requests machine output. Non-zero exit codes and
single-value JSON for every command are being completed (spm 0.4.x); until then parse the printed lines
and treat `Error:` / `✘` as failure.
