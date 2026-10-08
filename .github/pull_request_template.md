# Change

Describe the problem, resulting behavior, and linked issue or draft.

# Scope and acceptance criteria

List what this change covers and the checkable outcomes. Explain new dependencies when applicable.

# Validation

Record the result of each relevant command below, or explain why it was not run.

```bash
node --test
node scripts/check-links.mjs
```

The mdBook build runs in CI; do not install mdBook locally solely for this change.

# Review checklist

- [ ] I read AGENTS.md and CONTRIBUTING.md.
- [ ] The diff contains no secret material, .env contents, or personal data; examples are synthetic.
- [ ] Testnet-only status and limitations remain accurate; no deployment or pilot evidence is invented.
- [ ] Documentation claims point to existing code or evidence; relative links and SUMMARY entries resolve.
- [ ] I described remaining risks and any checks not run.
