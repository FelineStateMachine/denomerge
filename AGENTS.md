# denomerge agent notes

- Deno TypeScript only. Prefer JSR/Deno APIs; use npm compatibility only where Automerge packages
  require it.
- Keep `main` as the default branch.
- Use OpenSpec for design/spike changes before implementation.
- Run `deno task check` and `openspec validate --all --strict --json --no-interactive` before
  claiming work is done.
- Do not commit secrets, passkey challenge material, credential private data, or local KV/IndexedDB
  dumps.
