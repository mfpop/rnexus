# RNexus Database Structure

This document describes the application data model: entities, fields, relationships, indexes, and integrity rules. It reflects the Django models in `backend/api/models.py` and is kept in sync with migrations under `backend/api/migrations/`.

## Overview

- Core domains: Users & Profiles, Activities, Chat & Messages, System Messages, Updates (news/feed) with Tags, Media, Comments, Likes.
- Backing DB: PostgreSQL in production, SQLite in tests/dev (see `core.settings_test`).
- Conventions: Most models have `created_at` and `updated_at`, sensible default orderings, and indexes for common queries.

## Entities and Fields

### Users
- User: Django’s built-in `auth_user` table is used (no custom user model enabled).

#### UserProfile (1:1 with User)
- user: OneToOne(User, on_delete=CASCADE, related_name="profile")
- middle_name, maternal_last_name, preferred_name
- position, department
- phone, phone_country_code (+1 default), phone_type (mobile|home|work|other), secondary_phone
- street_address, apartment_suite, city, state_province, zip_code, country
- bio
- education JSON[], work_history JSON[], profile_visibility JSON
- created_at, updated_at
- Meta: db_table="user_profiles"

### Activities
These capture operational events/tasks and reference presentational configs for status/priority.

#### ActivityStatus
- status (unique): planned|in-progress|completed|cancelled|overdue
- display_name
- color_bg, color_text, color_border (Tailwind classes)
- icon (emoji or short code)
- description, is_active
- sort_order (for display)
- Meta: ordering=[sort_order, status], verbose_name_plural="Activity Statuses"

#### ActivityPriority
- priority (unique): low|medium|high|critical
- display_name
- color_bg, color_text, color_border
- description, is_active
- sort_order (for display)
- Meta: ordering=[sort_order, priority], verbose_name_plural="Activity Priorities"

#### Activity
- id: UUID primary key
- title, description
- type: enum (Production, Maintenance, Inspection & Audit, Engineering, Logistics, Quality, Meetings, Projects, Training, Admin & Systems)
- status: enum value mirroring ActivityStatus.status
- priority: enum value mirroring ActivityPriority.priority
- status_config: FK(ActivityStatus, on_delete=PROTECT, related_name="activities")
- priority_config: FK(ActivityPriority, on_delete=PROTECT, related_name="activities")
- start_time, end_time
- assigned_to, assigned_by
- location (nullable)
- progress (0–100), estimated_duration (mins), actual_duration (mins, nullable)
- notes (optional)
- created_by: FK(User, on_delete=CASCADE, related_name="created_activities")
- created_at, updated_at
- Meta: ordering=[-created_at]
- Save behavior: when `status_config` or `priority_config` is missing, they’re auto-populated based on `status`/`priority` enum values.

### Chat & Messaging

#### Chat
- id: CharField primary key (db_index)
- chat_type: user|group
- name, description (for groups)
- user1: FK(User, null=True, related_name="chats_as_user1")
- user2: FK(User, null=True, related_name="chats_as_user2")
- members: JSON[] of user IDs (for groups)
- last_message: FK(Message, null=True, related_name="chat_last_message")
- last_activity: auto_now
- is_active: bool
- created_by: FK(User, null=True, related_name="created_chats")
- avatar_url
- created_at, updated_at
- Meta:
  - ordering=[-last_activity]
  - indexes:
    - (chat_type, last_activity)
    - (user1, user2)

#### Message
- chat_id (CharField, indexed), chat_type (user|group)
- sender_id (CharField), sender_name
- content (Text)
- message_type: text|image|audio|video|document|location|contact
- status: sending|sent|delivered|read
- reply_to: self-FK nullable, related_name="replies"
- forwarded (bool), forwarded_from (CharField)
- edited (bool), edited_at (DateTime)
- file fields: file_name, file_size, file_url, thumbnail_url, caption
- AV fields: duration (seconds), waveform JSON
- location fields: latitude, longitude, location_name
- contact fields: contact_name, contact_phone, contact_email
- timestamp (auto_now_add), updated_at
- Meta:
  - ordering=[timestamp]
  - indexes:
    - (chat_id, timestamp)
    - (sender_id, timestamp)
    - (status, timestamp)

### System Messages
#### SystemMessage
- recipient_id (CharField) — not a FK to allow system-wide and external lookups
- title (nullable), message (Text)
- message_type: info|warning|error|success
- link (URL, nullable)
- is_read (bool)
- created_at (auto_now_add)
- Meta: ordering=[-created_at]

### Updates (News/Feed)

#### Tag
- name (unique), description
- color (hex), category (optional)
- is_active (bool), usage_count (int)
- created_at, updated_at
- Meta:
  - ordering=[category, name]
  - indexes:
    - (category, is_active)
    - (is_active, usage_count)

#### Update
- id (CharField, PK)
- type: news|communication|alert
- title, summary, body
- timestamp (default now)
- status: new|read|urgent
- tags: JSON[] of strings
- author (display name)
- icon (emoji)
- created_by: FK(User, on_delete=CASCADE, related_name="created_updates")
- is_active (bool)
- priority (int, higher = more prominent)
- expires_at (nullable)
- created_at, updated_at
- Meta:
  - ordering=[-priority, -timestamp]
  - indexes:
    - (type, status)
    - (status, timestamp)
    - (created_by, timestamp)
    - (is_active, timestamp)

#### UpdateAttachment
- id (AutoField, PK)
- update: FK(Update, on_delete=CASCADE, related_name="attachments")
- type: pdf|doc|docx|txt|image|audio|video
- url, label
- file_size (bytes, nullable)
- created_at
- Meta: ordering=[created_at]

#### UpdateMedia
- id (AutoField, PK)
- update: FK(Update, on_delete=CASCADE, related_name="media")
- type: image|video|audio
- url, label, thumbnail_url
- duration (seconds, nullable), file_size (bytes, nullable)
- created_at
- Meta: ordering=[created_at]

#### UpdateRelation
- id (AutoField, PK)
- source_update: FK(Update, related_name="source_relations")
- target_update: FK(Update, related_name="target_relations")
- relation_type (default "related")
- created_at
- Meta:
  - unique_together: (source_update, target_update, relation_type)
  - ordering=[created_at]

#### UpdateLike
- id (AutoField, PK)
- update: FK(Update, related_name="likes")
- user: FK(User, related_name="update_likes")
- is_like (bool; True=like, False=dislike)
- created_at
- Meta:
  - unique_together: (update, user)
  - ordering=[-created_at]

#### UpdateComment
- id (AutoField, PK)
- update: FK(Update, related_name="comments")
- author: FK(User, related_name="update_comments")
- content (Text)
- parent_comment: self-FK (nullable) for threads
- is_active (bool)
- created_at, updated_at
- Meta:
  - ordering=[created_at]
  - indexes:
    - (update, created_at)
    - (parent_comment, created_at)

## Relationships (high level)
- User 1—1 UserProfile
- ActivityStatus 1—* Activity (via status_config)
- ActivityPriority 1—* Activity (via priority_config)
- User 1—* Activity (created_by)
- Chat 1—* Message (via chat_id string relationship)
- Update 1—* UpdateAttachment, UpdateMedia, UpdateComment, UpdateLike
- Update — Update (many-to-many through UpdateRelation with relation_type)
- User 1—* Update (created_by), 1—* UpdateComment, 1—* UpdateLike

## Integrity & Constraints
- PROTECT on Activity.status_config/priority_config prevents deletion of referenced configs.
- CASCADE on most content-to-parent relationships (e.g., Update → its attachments/media/comments/likes, Activity → created_by) cleans up dependents.
- Unique constraints:
  - UpdateRelation: (source_update, target_update, relation_type)
  - UpdateLike: (update, user)
- Enum fields constrained via choices; app logic ensures consistency between enum fields and their config FKs in Activity.save().

## Indexing & Query Patterns
- Chat:
  - (chat_type, last_activity) → listing recent chats per type.
  - (user1, user2) → fast lookup of direct (user-to-user) chats.
- Message:
  - (chat_id, timestamp) → fetch messages in a chat in order.
  - (sender_id, timestamp) → sender activity streams.
  - (status, timestamp) → delivery/read state dashboards.
- Update:
  - (type, status), (status, timestamp), (created_by, timestamp), (is_active, timestamp) → feeds and moderation tools.
- Tag:
  - (category, is_active), (is_active, usage_count) → filtering and popularity.
- Activities:
  - Default ordering by `-created_at`; consider composite indexes for common filters (status, priority, type) as usage grows.

## Migrations
- Location: `backend/api/migrations/`
- Current baseline includes:
  - `0001_initial.py`: core models
  - `0002_systemmessage.py`: adds `SystemMessage`

## Seed Data & Fixtures
- ActivityStatus and ActivityPriority should be pre-seeded with all enum values used by the app to ensure Activity.save() can resolve configs.
- Management commands (e.g., `populate_all`) can initialize demo data for development and testing.

## Testing Notes
- For CI and local tests, `core.settings_test` configures SQLite and minimal settings; migrations are applied automatically by Django test runner.

## Future Enhancements
- Normalize group chat members into a join table for better analytics and to support member attributes (roles, joined_at).
- Add composite indexes on Activity for frequent filters (status, priority, type) when query patterns stabilize.
- Add soft-delete flags on user-generated content where retention is required.
- Consider full-text search indexes on Update.title/body and Message.content.
