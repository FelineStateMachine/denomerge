# Change: Spike POC phase map

## Summary

Define the POC spike phases in the OpenSpec dashboard so the review flow shows the intended build
order instead of four unrelated changes.

## Why

The POC needs a simple path: prove local storage, prove key-gated sync, then combine them. The
dashboard should expose that order directly.

## Scope

- Add a visible phase map for the current active spike changes.
- Define entry and exit criteria per phase.
- Keep implementation changes in their focused spike change directories.
