# 📦 spm — Skill and Plugin Manager

**spm** is a package manager for AI agent *skills*. It installs reusable skills from Git-based catalogs into every coding agent on your machine — one `spm install`, and the skill lands wherever your agents look for it:

| Agent | Project scope | Global scope |
|---|---|---|
| **Claude Code** | `.claude/skills/<skill>/` | `~/.claude/skills/<skill>/` |
| **Google Antigravity** (IDE + CLI) | `.agents/skills/<skill>/` | `~/.gemini/config/skills/`, `~/.gemini/antigravity-cli/skills/` |
| **OpenAI Codex CLI** | `.agents/skills/<skill>/` | `~/.agents/skills/<skill>/` |
| **Cursor** | `.cursor/rules/<skill>.mdc` | — |
| **Cline** | `.clinerules/<skill>.md` | `~/Documents/Cline/Rules/<skill>.md` |
| **Devin** | `.devin/skills/<skill>/` | `%APPDATA%/devin/skills/` (or `~/.config/devin/skills/`) |
| **Aider** | `.aider/skills/` + `.aider.conf.yml` | `~/.aider/skills/` + `~/.aider.conf.yml` |
| **GitHub Copilot** | `.github/instructions/<skill>.instructions.md` | — |
| **Hermes** | `skills/<skill>/` | `~/.hermes/skills/<skill>/` |
| **OpenClaw** | `.agents/skills/<skill>/` | `~/.openclaw/skills/<skill>/` |
| **opencode** | `.opencode/skills/<skill>/` | `~/.config/opencode/skills/<skill>/` |
| **Sourcegraph Amp** | `.agents/skills/<skill>/` | `~/.config/amp/skills/<skill>/` |
| **Pi** | `.agents/skills/<skill>/` | — |

Global deployments only target agents that are actually installed on your system. Many agents read the
shared `.agents/skills/` convention, so one install often reaches several at once.

By default a skill installs to **every detected agent** — use the interactive checklist or the
`--agents` flag to pick a subset. See [Choosing which agents](#choosing-which-agents).

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

## Choosing which agents

By default `spm install` deploys to **every AI agent detected on your machine**. You control which ones:

- **On a terminal**, install shows a checklist — Claude Code, Antigravity/Gemini, and OpenAI Codex are
  pre-checked; the rest are listed unchecked (space to toggle, enter to confirm).
- **Non-interactively / in scripts**, pass `--agents` with a comma-separated list of keys:

  ```bash
  spm install pdf --agents claude,cursor          # only these two
  spm install pdf --agents copilot                # just GitHub Copilot
  ```

Valid agent keys:

`claude` · `gemini` (alias `antigravity`) · `codex` · `cursor` · `cline` · `devin` · `aider` ·
`copilot` · `hermes` · `openclaw` · `opencode` · `amp` · `pi`

Combine with the scope flags below (`--project` / `--global` / `--all`) to control *where* as well as
*which*. Agents that write the same folder (e.g. Codex, OpenClaw, Amp and Pi all read `.agents/skills/`)
are offered as a single choice.

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

## MCP server

spm ships an MCP stdio server so agents can find and install skills without leaving the conversation. Start it with `spm mcp serve` and point your MCP client at it — spm exposes its commands as tools: `search` (find a skill by intent), `list`, `info`, `install`, and the `catalog_*` family. So instead of you wiring up a skill by hand, the agent can search a catalog and install the right one itself.

Read-only tools (`list`, `catalog list`, `search`, `info`) are annotated as safe; destructive ones (`uninstall`, `catalog remove`) carry MCP destructive hints, so agents ask before running them.

## Known limitations

- A skill's install state is tracked once per skill name, not per project — installing the same skill into several projects tracks only the most recent project path.
- The single-file agents get just the skill's text, not its folder, so bundled reference files aren't deployed there: Aider (`SKILL.md` content), Cursor (`.mdc` rule), Cline (rule file), and GitHub Copilot (instruction file). The folder-based agents — Claude Code, Antigravity/Gemini, Codex, Devin, Hermes, OpenClaw, opencode, Amp, and Pi — get the full skill folder.

## Built with

[Repl Toolkit](https://github.com/yllibed/repl) (command graph, REPL, and MCP integration) and [Spectre.Console](https://spectreconsole.net/).

## License

[MIT](LICENSE)
