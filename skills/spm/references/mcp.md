# spm as an MCP server

spm exposes its commands as MCP tools over stdio: `spm mcp serve`. Once a host registers it, the agent can
search, inspect, and install skills without a shell.

## When to prefer the MCP tools

- They are present in your tool list (server `spm`; tools such as `search`, `list`, `info`, `install`,
  `update`, `uninstall`, `agents`, `doctor`, `cleanup`, `catalog_list`, `catalog_add`, `catalog_import`,
  `catalog_sync`, `catalog_remove`, `catalog_root`, `resurrect`, `version`).
- You want structured calls with safety annotations: read-only tools (`search`, `list`, `info`, `agents`,
  `doctor`, `catalog_list`, `catalog_root`, `version`) run without confirmation; destructive ones
  (`uninstall`, `catalog_remove`, `cleanup`, `resurrect`) carry MCP destructive hints so the host asks first.
- The task is inside a conversation, not a script.

Prefer the **CLI** when spm tools are not available, when you need interactive pickers or fine control
(`--agents`, `--copy`, `--answer:scope`), in scripts/CI, and for `cleanup --apply`. Do not start
`spm mcp serve` yourself — the host does. Do not mix MCP tools and CLI calls in one flow.

## Tool behaviour

- Tool names are the command paths with spaces replaced by underscores. Arguments are the command's
  parameters and flags by name (`install` takes `skillName`, and optional `agents`, `project`, `global`,
  `all`, `copy`, `skills`, `catalog`).
- Nothing prompts under MCP. `install` inside a project defaults to project scope unless `project`/`global`/
  `all` is set; agents default to the detected ones unless `agents` is given. `update` with no name updates
  everything; `uninstall` needs a name.
- Working directory is the host's process cwd; project scope resolves against it.
- Terminal-only conveniences (`list <catalog>`, the no-argument `catalog import`, no-argument `uninstall`)
  are hidden from MCP; use the canonical tool with an argument (`catalog_import` with `source: "official"`).

## Registering spm with common hosts

Assumes `spm` is on PATH (npm `@hiadamhere/spm`, Homebrew, Scoop, or `dotnet tool install -g spm`).

**Claude Code**

```bash
claude mcp add spm -- spm mcp serve
```

**Codex** — `~/.codex/config.toml`:

```toml
[mcp_servers.spm]
command = "spm"
args = ["mcp", "serve"]
```

**Cursor** — `.cursor/mcp.json` (project) or `~/.cursor/mcp.json`:

```json
{ "mcpServers": { "spm": { "command": "spm", "args": ["mcp", "serve"] } } }
```

**Windsurf** — `~/.codeium/windsurf/mcp_config.json`, **Cline** — MCP settings, **Gemini CLI** —
`~/.gemini/settings.json` under `mcpServers`: the same `command`/`args` shape.

**VS Code / GitHub Copilot** — `.vscode/mcp.json`:

```json
{ "servers": { "spm": { "type": "stdio", "command": "spm", "args": ["mcp", "serve"] } } }
```

Verify with the host's MCP status view: the server should report `spm` at its real version and list the
tools above.
