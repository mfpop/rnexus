# Contributing to RNexus Docs

This guide describes how to keep the database ER diagram and docs in sync with the codebase.

## Update the ER Diagram when models change
1. Edit Django models in `backend/api/models.py` as needed.
2. Update the Mermaid source at `docs/diagrams/erd.mmd` to reflect any new/removed entities, relationships, or renames.
3. Regenerate the static image so non-Mermaid viewers can see it:

```bash
cd frontend
npm run render:erd
```

This produces `docs/diagrams/erd.svg`.

4. Open `docs/DATABASE_STRUCTURE.md` and ensure:
   - The Entities and Fields section matches the models.
   - The ER diagram image link points to `./diagrams/erd.svg`.
   - Seed/management commands and query mappings remain accurate.

## Review checklist for schema changes
- [ ] New models documented with fields/enums/indexes and on_delete policies
- [ ] Relationships updated (1:1, 1:N, N:M through models)
- [ ] Indexes added and common query patterns noted
- [ ] Migrations committed under `backend/api/migrations` and mentioned if needed
- [ ] ERD updated: `docs/diagrams/erd.mmd` + regenerated `erd.svg`

## Tips
- Keep the Mermaid file small and readable; prefer relationship labels over overly long entity definitions.
- If the diagram grows large, consider splitting into domain-level diagrams (Activities, Chat, Updates).
- In PRs that modify models, include a screenshot of the updated ERD for reviewers.
