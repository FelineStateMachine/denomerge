# denomerge agent notes

- Deno TypeScript only. Prefer JSR/Deno APIs; use npm compatibility only where Automerge packages
  require it.
- Keep `main` as the default branch.
- Use OpenSpec for design/spike changes before implementation.
- Run `deno task check` and `openspec validate --all --strict --json --no-interactive` before
  claiming work is done. The test task grants env access because Automerge's npm dependency graph
  imports `debug`, which reads `process.env` at module load.
- Do not commit secrets, passkey challenge material, credential private data, or local KV/IndexedDB
  dumps.
