# 📦 spm — Skill and Plugin Manager

**spm** is a package manager for AI agent *skills*. It installs reusable skills from Git-based catalogs into every coding agent on your machine — one `spm install`, and the skill lands wherever your agents look for it:

spm follows the open agent-skills conventions, so one install reaches every agent that reads them: the
skill is copied once to the shared **`.agents/skills/<skill>/`** folder (project) or
**`~/.agents/skills/<skill>/`** (global), which every agent following that convention reads directly, and
every other selected agent gets a **link** to that copy (a junction on Windows, no admin needed; a full copy
if linking fails, or always with `--copy`). The full agent list with keys and folders is in
[docs/agents.md](docs/agents.md); `spm agents` prints it with what is detected on your machine.

By default a skill installs to the shared `.agents/skills/` copy plus **every agent detected on your
machine** — use the interactive checklist or the `--agents` flag to pick a different set. See
[Choosing which agents](#choosing-which-agents).

## Install

**npm** — no .NET required:

```bash
npm install -g @hiadamhere/spm
# or run it without installing:
npx @hiadamhere/spm --help
```

**Homebrew** (macOS / Linux):

```bash
brew install hiadamhere/spm/spm
```

**Scoop** (Windows):

```bash
scoop bucket add spm https://github.com/hiadamhere/scoop-spm
scoop install spm
```

**Standalone binary** — download the self-contained executable for your platform from the
[latest release](https://github.com/hiadamhere/spm/releases/latest) (also no .NET required).

**.NET tool** — for .NET users (requires the [.NET 10 SDK or runtime](https://dotnet.microsoft.com/download)):

```bash
dotnet tool install -g spm
```

Verify any of them with `spm --help`, or run `spm` with no arguments for an interactive REPL.

## Two ways to get skills

**Install one now** — point spm at any GitHub repo that has skills; nothing is kept around:

```bash
spm install anthropics/skills            # pick one or more of the repo's skills
spm install anthropics/skills/pdf        # install one directly
```

spm shallow-clones the repo to a temp folder, deploys the skill, and throws the clone away. No subscription, no clutter.

**Subscribe to a library** — when you'll reuse a set of skills, add it as a *catalog*; its skills then show up in `list`/`search` and install by bare name:

```bash
spm catalog add mine https://github.com/you/skills.git   # or: spm catalog add mine you/skills
spm catalog sync                                          # clone/pull subscribed catalogs
spm list                                                  # everything available, with descriptions
spm install some-skill                                    # by name — no URL needed
```

Or import a curated index of repos in one go:

```bash
spm catalog import          # spm's official featured catalog
spm catalog sync
```

Run `spm` with no arguments for an interactive REPL.

## Teach your agents spm

spm ships its own skill, so your agents can search and install skills for you instead of you doing it by hand:

```bash
spm install spm --global      # the `spm` skill: when to reach for spm, every command, MCP vs CLI
```

The featured catalog provides it, and the first interactive launch offers to install it after importing the
catalog. With the skill loaded, an agent that hits "is there a skill for X?" runs `spm search`, shows you the
candidates, and installs the one you pick — via the CLI, or via spm's MCP tools when the host has
`spm mcp serve` registered (the skill explains which to use when).

## Choosing which agents

Every install writes the shared `.agents/skills/` copy, which the "universal" agents read as-is (`spm agents`
marks them `*`). The remaining agents need their own folder, and you control which get one:

- **On a terminal**, install shows a checklist of those agents — the ones detected on your machine are
  pre-checked (Claude Code when nothing is detected), and your last choice is remembered (space to toggle,
  enter to confirm).
- **Non-interactively / in scripts**, pass `--agents` with comma-separated keys (see `spm agents` or
  [docs/agents.md](docs/agents.md)):

  ```bash
  spm install pdf --agents claude-code,windsurf   # these two, plus the shared .agents/skills copy
  spm install pdf --agents universal              # the shared copy only
  spm agents                                      # every key, with detection status
  ```

  The spm 0.3 keys (`claude`, `gemini`, `copilot`, `hermes`) still work as aliases.

Combine with the scope flags below (`--project` / `--global` / `--all`) to control *where* as well as
*which*, and add `--copy` to copy the skill into each agent folder instead of linking.

## install vs catalog — which do I use?

| | `spm install org/repo` | `spm catalog add` / `import` |
|---|---|---|
| **For** | grabbing a skill once | a library you'll reuse |
| **Keeps a clone?** | no (temp, discarded) | yes (a subscription) |
| **Reference by** | the repo each time | bare skill name |
| **Updates** | re-fetches the repo | pulls the catalog |

Both honor a repo's custom skills location — see [Skill layout](#skill-layout).

## Discovering skills

- **`spm list`** shows every skill across your catalogs, grouped by catalog, one line each with its description and install status.
- **`spm search <text>`** (alias `find`) ranks skills by relevance across names and descriptions — not just an exact substring. It's tolerant of word order, partial words/stems, and typos, so `spm search "seo website"` surfaces a skill described as *"analyze a website's SEO and ranking factors."*
- **`spm info <skill>`** (alias `show`) prints a detail view: catalog, description, install status/scope, version, and reference-file count.

Descriptions are read from each skill's `SKILL.md` YAML frontmatter (`description:`).

## Skill layout

A skill is a folder with a `SKILL.md` (its `name` + `description` frontmatter) and optional `references/`:

```
my-skill/
├── SKILL.md
└── references/
```

By default spm looks for skills under `skills/` at a repo's root. To keep them elsewhere, add a **`skills.json`** at the repo root — vendor-neutral, so any tool can adopt it:

```json
{ "path": "packages/skills" }
```

`path` may also be a list: `{ "path": ["skills", "extra/skills"] }`. This works for both `install org/repo` and subscribed catalogs.

## Catalogs

A catalog is a subscription to a skills repo. Manage them with:

```bash
spm catalog add <name> <url|org/repo> [--priority N] [--local <path>]
spm catalog import [<catalog.json url | org/repo | official>]
spm catalog sync            # clone/pull all subscribed catalogs
spm catalog list
spm catalog remove <name>
spm catalog root [<path>]   # where clones are stored (or set SPM_HOME)
```

- **Priority** (lower wins) decides which catalog provides a skill when names collide.
- **`--local <path>`** reuses a clone you already have (or clones there instead of the default root) — great for turning an existing checkout into a catalog. `catalog remove` never deletes a `--local` clone.
- **Private repos** work through your existing git auth (SSH keys, credential manager).
- **Clone location** defaults to `~/.spm/catalogs/`; move it per-catalog with `--local`, globally with `spm catalog root <path>`, or relocate everything with the `SPM_HOME` env var.

### Featured catalog (`catalog.json`)

`spm catalog import` subscribes to every repo listed in a **`catalog.json`** index — spm's official one by default, or any URL / `org/repo` you pass:

```json
{
  "name": "spm featured",
  "description": "Curated agent skills",
  "repos": [
    { "url": "https://github.com/anthropics/skills", "name": "anthropic" },
    { "url": "https://github.com/openai/skills", "path": "skills/.curated", "name": "openai" }
  ]
}
```

Each entry needs a `url`; optional `path` overrides that repo's skills folder (if it has no `skills.json`), and optional `name`/`description` are for nicer output.

### Staying current without thinking about it

When you launch the interactive REPL (a bare `spm`) in a real terminal, spm offers two courtesies: on a
fresh install with no catalogs, to **import the featured catalog** and sync it; and when your catalogs were
last synced more than **7 days** ago, to **sync them now**. Each is a question, not a gate — "Not now" is
remembered for a week, "Never ask again" turns it off (`spm config prompts on|off` toggles it back), and
setting `SPM_NO_PROMPT=1` silences it entirely. Nothing is ever asked when spm runs with arguments, in
scripts or CI, with redirected input, or as an MCP server.

## Scopes

- Inside a project (a folder with `.git` or `package.json`), `spm install <skill>` deploys to **project-local** agent folders.
- Outside a project, it deploys **globally** for every detected agent.
- `--project` forces project-only; `--global` forces global-only; `--all` does both.
- To pick *which agents* receive the skill, see [Choosing which agents](#choosing-which-agents) above.
- `spm uninstall <skill>` removes only that skill's files/sections, using the same scope rules. Run `spm uninstall` with **no name** to pick a scope and then multi-select which installed skills to remove.

## Updates

Skill versions are tracked by their source's Git commit SHA.

```bash
spm update my-skill   # re-fetch this skill, refresh if it changed
spm update            # pick which installed skills to update (or updates all non-interactively)
spm resurrect         # review skills whose files went missing
```

An update **refreshes only the deployments that still exist**, reproducing the exact scope, agents, and project directory the skill was installed with — from anywhere. Skills installed straight from a repo (`install org/repo`) update by re-fetching their source; subscribed ones update by pulling the catalog.

If you've **manually deleted** a skill's files, update won't silently restore them — it marks the skill *lost* and leaves it alone. `spm resurrect` lists lost skills and lets you **restore** (reinstall where they were) or **forget** them. So: *update keeps things current; resurrect brings back what you removed.*

## Health check and cleanup

```bash
spm doctor            # read-only diagnosis of every tracked skill and spm folder
spm doctor --all      # include the healthy ones
spm doctor --untracked  # list the skill folders spm doesn't track (by default only counted)
spm cleanup           # preview what cleanup would do — changes nothing
spm cleanup --apply   # do it (asks first on a terminal; --yes skips the question)
```

`doctor` reports, per skill and scope: **lost** (nothing on disk), **partial** (an agent's folder is missing),
**broken link**, **0.3 layout** (not yet migrated — `spm update <skill>` does it), **copy, not link** and
**content differs** (a real folder where a link was expected), plus **untracked** skill folders in your agents'
directories, **staging leftovers** from interrupted installs, **stale catalog clones**, and forgotten temp clones.

`cleanup` is deliberately conservative. It only acts where spm can prove ownership: it unlinks broken links,
moves staging leftovers and stale clones to a **quarantine** folder (`~/.spm/quarantine/<timestamp>/`, mirroring
their original paths so you can put them back), deletes spm's own temp clones, and flags lost records for
`spm resurrect`. Untracked folders — yours, or another tool's — are reported and never touched, and a real
folder with edited content is never replaced automatically.

## MCP server

spm ships an MCP stdio server so agents can find and install skills without leaving the conversation. Start it with `spm mcp serve` and point your MCP client at it — spm exposes its commands as tools: `search` (find a skill by intent), `list`, `info`, `install`, and the `catalog_*` family. So instead of you wiring up a skill by hand, the agent can search a catalog and install the right one itself.

Read-only tools (`list`, `catalog list`, `search`, `info`, `agents`, `doctor`) are annotated as safe; destructive ones (`uninstall`, `catalog remove`, `cleanup`) carry MCP destructive hints, so agents ask before running them.

## Known limitations

- A skill's install state is tracked once per skill name, not per project — installing the same skill into several projects tracks only the most recent project path.
- Agents are linked to the shared copy, so a skill deployed into a project must stay inside that project's `.agents/skills/` folder — moving or deleting it breaks the links (`spm update` repairs them).
- Upgrading from spm 0.3: the old per-agent rule files (Cursor `.mdc`, Cline rules, Aider `read:` entries, Copilot instructions) and folders are removed by the next `spm update` or `spm uninstall` of that skill. Aider is no longer a deploy target: it has no skills folder to deploy into.

## Built with

[Repl Toolkit](https://github.com/yllibed/repl) (command graph, REPL, and MCP integration) and [Spectre.Console](https://spectreconsole.net/).

## License

[MIT](LICENSE)
