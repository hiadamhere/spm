# spm concepts

## Skills

A skill is a folder with a `SKILL.md` — YAML frontmatter `name` and `description`, then instructions —
and optional `references/` files the instructions point to. Agents load `SKILL.md` when its description
matches the task and read references on demand. A skill is documentation and workflow, never executable
code; spm copies folders, it does not run anything from them.

By default spm expects a repo's skills under `skills/` at its root. A repo can keep them elsewhere with a
root `skills.json`: `{ "path": "packages/skills" }` or `{ "path": ["skills", "extra/skills"] }`. This is
honoured for `install org/repo` and for subscribed catalogs alike.

## Two ways to get a skill

| | `spm install org/repo[/skill]` | `spm catalog add` / `catalog import` + `spm install <name>` |
|---|---|---|
| For | grabbing a skill once | a library you will reuse |
| Keeps a clone? | no — shallow temp clone, discarded | yes — a subscription under `~/.spm/catalogs/` |
| Reference by | the repo each time | bare skill name |
| Updates | re-fetches the repo | pulls the catalog |

A **catalog** is a subscription to a skills repo. Priorities (lower wins) decide which catalog supplies a
skill when names collide. `catalog import` subscribes to every repo in a `catalog.json` index:

```json
{ "name": "…", "repos": [ { "url": "https://github.com/org/repo", "path": "optional/skills/dir", "name": "short" } ] }
```

spm's featured index (`spm catalog import`) subscribes to a curated set of well-known skill repositories,
including spm's own repo (which provides the `spm` skill you are reading). Run `spm catalog list` after
importing to see exactly what you subscribed to.

## Scopes

- **Project scope** — the current folder is a project when it contains `.git` or `package.json`. Files go
  under that folder: `.agents/skills/<skill>/` plus links in the agents' project folders that exist
  (`.claude/skills/`, `.windsurf/skills/`, …).
- **Global scope** — `~/.agents/skills/<skill>/` plus links in each selected agent's user-level folder
  (`~/.claude/skills/`, `~/.codeium/windsurf/skills/`, …).
- Inside a project a terminal asks; non-interactive runs default to project. Outside a project everything
  is global. `--project`, `--global`, `--all` decide explicitly.
- Tracking is **per skill name**, not per project: installing the same skill into two projects records
  only the latest project path (known limitation).

## The install model

1. The skill folder is copied once to the **canonical** location: `.agents/skills/<skill>/` (project) or
   `~/.agents/skills/<skill>/` (global).
2. **Universal agents** — every agent whose project folder is `.agents/skills` (`spm agents` marks them
   `*`) — read the canonical copy directly. Nothing else is written for them.
3. Every **other** selected agent gets a **directory link** from its own skills folder to the canonical
   copy: a symlink, or a junction on Windows (no admin rights). If linking fails the folder is copied
   instead; `--copy` copies everywhere.
4. At project scope, a non-universal agent is linked only if its root folder already exists in the
   project (Claude Code always), so installing never creates `.windsurf/`, `.kiro/`, … in a repo that
   does not use them. The skill is still available through `.agents/skills/`.
5. `uninstall` removes the links first, then the canonical copy, then prunes empty agent folders.

Consequences: a skill deployed into a project must stay inside that project's `.agents/skills/`; moving
or deleting it breaks the links (`spm update <skill> --force` recreates them). spm ≤ 0.3 wrote per-agent
copies and rule files (Cursor `.mdc`, Cline rules, Aider `read:` entries, Copilot instructions); the first
`spm update` or `spm uninstall` of such a skill migrates or removes them. Aider is no longer a target.

## Which agents are targeted

Detection follows each agent's own config folder (for example `~/.codex`, `~/.claude`, `~/.cursor`,
`~/.codeium/windsurf`); `spm agents` shows the result. Interactive installs pre-check detected agents
(Claude Code when nothing is detected) and remember the last choice; non-interactive installs use the
detected set. `--agents key1,key2` overrides; keys come from the agent registry, and the spm 0.3
keys `claude`, `gemini`, `copilot`, `hermes` are accepted as aliases. `spm agents` is the list.

## Updates, lost skills, health

- `spm update [<skill>]` compares the recorded source commit with the latest (catalog pull or `git
  ls-remote` for repo installs) and redeploys changed skills to exactly their recorded scope, agents, and
  project path.
- If every deployed file is gone, update marks the skill **lost** instead of silently restoring it;
  `spm resurrect` restores or forgets lost skills.
- `spm doctor` is the read-only diagnosis (lost, partial, broken links, old layouts, drifted copies,
  untracked folders, stale clones, staging leftovers). `spm cleanup` previews the safe fixes and performs
  them only with `--apply`; anything spm cannot prove it owns is reported, never removed; removed folders
  go to `~/.spm/quarantine/<timestamp>/` so they can be put back.

## Where spm keeps its state

`~/.spm/` (or `$SPM_HOME`): `config.json` (catalogs, installed skills with catalog/source/version/scope/
project path/agents/mode, last sync time, prompt preferences), `catalogs/<name>/` clones, and
`quarantine/`. `spm catalog root <path>` moves only the clones.

## Interactive-launch courtesy

A bare `spm` in a real terminal (not with arguments, not redirected, not in CI or MCP) may ask one
question: import the featured catalog when there are none, or sync when catalogs are older than seven
days. "Not now" is remembered for a week; "Never ask again" or `spm config prompts off` or
`SPM_NO_PROMPT=1` silence it.
