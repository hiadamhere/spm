# Supported agents

This table is generated from spm's agent registry. It is the only place agents are enumerated, so the list
cannot drift; `spm agents` prints the same table with detection status for the current machine.

- **`--agent`** is the key for `spm install --agents key1,key2`. The spm 0.3 keys `claude`, `gemini`,
  `copilot`, `hermes` are accepted as aliases for `claude-code`, `antigravity`, `github-copilot`, `hermes-agent`.
- Agents whose project path is **`.agents/skills/`** are *universal*: they read the shared copy directly and
  get no link of their own (in either scope).
- Other agents get a link from their own folder to the shared copy; at project scope only if that agent's
  root folder already exists in the project (Claude Code always).
- `~/.config` follows `$XDG_CONFIG_HOME`; `~/.codex`, `~/.claude`, `~/.vibe`, `~/.hermes`, `~/.autohand`,
  `~/.grok` follow `$CODEX_HOME`, `$CLAUDE_CONFIG_DIR`, `$VIBE_HOME`, `$HERMES_HOME`, `$AUTOHAND_HOME`, `$GROK_HOME`.

<!-- supported-agents:start -->
| Agent | `--agent` | Project Path | Global Path |
|-------|-----------|--------------|-------------|
| AiderDesk | `aider-desk` | `.aider-desk/skills/` | `~/.aider-desk/skills/` |
| Amp, Replit, Universal | `amp`, `replit`, `universal` | `.agents/skills/` | `~/.config/agents/skills/` |
| Antigravity | `antigravity` | `.agents/skills/` | `~/.gemini/antigravity/skills/` |
| Antigravity CLI | `antigravity-cli` | `.agents/skills/` | `~/.gemini/antigravity-cli/skills/` |
| AstrBot | `astrbot` | `data/skills/` | `~/.astrbot/data/skills/` |
| Autohand Code CLI | `autohand-code` | `.autohand/skills/` | `~/.autohand/skills/` |
| Augment | `augment` | `.augment/skills/` | `~/.augment/skills/` |
| IBM Bob | `bob` | `.bob/skills/` | `~/.bob/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| OpenClaw | `openclaw` | `skills/` | `~/.openclaw/skills/` |
| Cline, Dexto, Kimi Code CLI, Loaf, Warp, Zed | `cline`, `dexto`, `kimi-code-cli`, `loaf`, `warp`, `zed` | `.agents/skills/` | `~/.agents/skills/` |
| CodeArts Agent | `codearts-agent` | `.codeartsdoer/skills/` | `~/.codeartsdoer/skills/` |
| CodeBuddy | `codebuddy` | `.codebuddy/skills/` | `~/.codebuddy/skills/` |
| Codemaker | `codemaker` | `.codemaker/skills/` | `~/.codemaker/skills/` |
| Code Studio | `codestudio` | `.codestudio/skills/` | `~/.codestudio/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.codex/skills/` |
| Command Code | `command-code` | `.commandcode/skills/` | `~/.commandcode/skills/` |
| Continue | `continue` | `.continue/skills/` | `~/.continue/skills/` |
| Cortex Code | `cortex` | `.cortex/skills/` | `~/.snowflake/cortex/skills/` |
| Crush | `crush` | `.crush/skills/` | `~/.config/crush/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| Deep Agents | `deepagents` | `.agents/skills/` | `~/.deepagents/agent/skills/` |
| Devin for Terminal | `devin` | `.devin/skills/` | `~/.config/devin/skills/` |
| Droid | `droid` | `.factory/skills/` | `~/.factory/skills/` |
| Eve | `eve` | `agent/skills/` | N/A (project-only) |
| Firebender | `firebender` | `.agents/skills/` | `~/.firebender/skills/` |
| ForgeCode | `forgecode` | `.forge/skills/` | `~/.forge/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| Goose | `goose` | `.goose/skills/` | `~/.config/goose/skills/` |
| Grok Build | `grok` | `.grok/skills/` | `~/.grok/skills/` |
| Hermes Agent | `hermes-agent` | `.hermes/skills/` | `~/.hermes/skills/` |
| inference.sh | `inference-sh` | `.inferencesh/skills/` | `~/.inferencesh/skills/` |
| Jazz | `jazz` | `.jazz/skills/` | `~/.jazz/skills/` |
| Junie | `junie` | `.junie/skills/` | `~/.junie/skills/` |
| iFlow CLI | `iflow-cli` | `.iflow/skills/` | `~/.iflow/skills/` |
| Kilo Code | `kilo` | `.kilocode/skills/` | `~/.kilocode/skills/` |
| Kimchi | `kimchi` | `.kimchi/skills/` | `~/.config/kimchi/harness/skills/` |
| Kiro CLI | `kiro-cli` | `.kiro/skills/` | `~/.kiro/skills/` |
| Kode | `kode` | `.kode/skills/` | `~/.kode/skills/` |
| Lingma | `lingma` | `.lingma/skills/` | `~/.lingma/skills/` |
| MCPJam | `mcpjam` | `.mcpjam/skills/` | `~/.mcpjam/skills/` |
| MiniMax Code | `minimax-code` | `.minimax/skills/` | `~/.minimax/skills/` |
| Mistral Vibe | `mistral-vibe` | `.vibe/skills/` | `~/.vibe/skills/` |
| Moxby | `moxby` | `.moxby/skills/` | `~/.moxby/skills/` |
| Mux | `mux` | `.mux/skills/` | `~/.mux/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| OpenHands | `openhands` | `.openhands/skills/` | `~/.openhands/skills/` |
| Ona | `ona` | `.ona/skills/` | `~/.ona/skills/` |
| Pi | `pi` | `.pi/skills/` | `~/.pi/agent/skills/` |
| Posit Assistant | `posit-assistant` | `.posit/assistant/skills/` | `~/.posit/assistant/skills/` |
| Qoder | `qoder` | `.qoder/skills/` | `~/.qoder/skills/` |
| Qoder CN | `qoder-cn` | `.qoder/skills/` | `~/.qoder-cn/skills/` |
| Qwen Code | `qwen-code` | `.qwen/skills/` | `~/.qwen/skills/` |
| Reasonix | `reasonix` | `.reasonix/skills/` | `~/.reasonix/skills/` |
| Rovo Dev | `rovodev` | `.rovodev/skills/` | `~/.rovodev/skills/` |
| Roo Code | `roo` | `.roo/skills/` | `~/.roo/skills/` |
| Tabnine CLI | `tabnine-cli` | `.tabnine/agent/skills/` | `~/.tabnine/agent/skills/` |
| Terramind | `terramind` | `.terramind/skills/` | `~/.terramind/skills/` |
| Tinycloud | `tinycloud` | `.tinycloud/skills/` | `~/.tinycloud/skills/` |
| Trae | `trae` | `.trae/skills/` | `~/.trae/skills/` |
| Trae CN | `trae-cn` | `.trae/skills/` | `~/.trae-cn/skills/` |
| Windsurf | `windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| ZCode | `zcode` | `.zcode/skills/` | `~/.zcode/skills/` |
| Zencoder, Zenflow | `zencoder`, `zenflow` | `.zencoder/skills/` | `~/.zencoder/skills/` |
| Neovate | `neovate` | `.neovate/skills/` | `~/.neovate/skills/` |
| Pochi | `pochi` | `.pochi/skills/` | `~/.pochi/skills/` |
| PromptScript | `promptscript` | `.agents/skills/` | N/A (project-only) |
| AdaL | `adal` | `.adal/skills/` | `~/.adal/skills/` |
<!-- supported-agents:end -->

Detection: an agent counts as installed when its config folder exists (for example `~/.claude`, `~/.codex`,
`~/.cursor`, `~/.codeium/windsurf`, `~/.gemini/antigravity`), or, for a few project-bound agents, when their
project folder exists (`.codebuddy`, `.continue`, `.jazz`, `agent/` for Eve, `.replit`, `.promptscript`).
