# Nexus Database Structure

This document describes the core models, relationships, indexes, and data population strategies for Nexus. It mirrors the current Django models and is kept in sync with migrations.

- Core domains: Users, Activities, Projects, Updates, Chat, System Messages
- Indexing strategy for performance (status/type/priority fields, foreign keys, date fields)
- Sample data and management commands: `populate_all`, `populate_*`

See backend models in `backend/api/models.py` and migrations for details.
