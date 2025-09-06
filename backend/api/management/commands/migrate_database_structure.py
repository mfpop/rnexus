# Database Migration Script - From Old to New Structure
# This script migrates data from the current complex structure to the new streamlined structure

"""
Migration plan:
1. Create new simplified tables
2. Migrate existing data
3. Update Django settings to use new models
4. Update GraphQL schema
5. Update frontend to use new context providers

This script can be run as a Django management command.
"""

from django.core.management.base import BaseCommand
from django.db import transaction, connection
from django.utils import timezone
from django.contrib.auth.models import User
import uuid
import json


class Command(BaseCommand):
    help = 'Migrate from old database structure to new streamlined structure'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be migrated without making changes',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force migration even if new tables exist',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force = options['force']

        self.stdout.write(
            self.style.SUCCESS('🚀 Starting database migration to new structure')
        )

        if dry_run:
            self.stdout.write(
                self.style.WARNING('🔍 DRY RUN MODE - No changes will be made')
            )

        try:
            with transaction.atomic():
                # Step 1: Create new table structure
                self._create_new_tables(dry_run)
                
                # Step 2: Create default categories and statuses
                self._create_default_data(dry_run)
                
                # Step 3: Migrate activities
                activity_count = self._migrate_activities(dry_run)
                
                # Step 4: Migrate updates/news
                update_count = self._migrate_updates(dry_run)
                
                # Step 5: Create indexes for performance
                self._create_indexes(dry_run)
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Migration completed successfully!\n'
                        f'   📋 Activities migrated: {activity_count}\n'
                        f'   📰 Updates migrated: {update_count}'
                    )
                )
                
                if dry_run:
                    self.stdout.write(
                        self.style.WARNING('🔄 Rolling back transaction (dry run)')
                    )
                    raise Exception('Dry run - rolling back')
                    
        except Exception as e:
            if not dry_run or str(e) != 'Dry run - rolling back':
                self.stdout.write(
                    self.style.ERROR(f'❌ Migration failed: {str(e)}')
                )
                raise

    def _create_new_tables(self, dry_run):
        """Create the new streamlined table structure"""
        self.stdout.write('📦 Creating new table structure...')
        
        sql_statements = [
            # Activity Categories
            """
            CREATE TABLE IF NOT EXISTS api_activitycategory (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL,
                display_name VARCHAR(100) NOT NULL,
                icon VARCHAR(10) DEFAULT '📋',
                color VARCHAR(7) DEFAULT '#3B82F6',
                is_active BOOLEAN DEFAULT TRUE
            );
            """,
            
            # Activity Status
            """
            CREATE TABLE IF NOT EXISTS api_activitystatus_new (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) UNIQUE NOT NULL,
                display_name VARCHAR(50) NOT NULL,
                color_bg VARCHAR(7) DEFAULT '#F3F4F6',
                color_text VARCHAR(7) DEFAULT '#374151',
                color_border VARCHAR(7) DEFAULT '#D1D5DB',
                is_active BOOLEAN DEFAULT TRUE
            );
            """,
            
            # Activity Priority
            """
            CREATE TABLE IF NOT EXISTS api_activitypriority_new (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) UNIQUE NOT NULL,
                display_name VARCHAR(50) NOT NULL,
                level INTEGER DEFAULT 0,
                color_bg VARCHAR(7) DEFAULT '#F3F4F6',
                color_text VARCHAR(7) DEFAULT '#374151',
                color_border VARCHAR(7) DEFAULT '#D1D5DB',
                is_active BOOLEAN DEFAULT TRUE
            );
            """,
            
            # Activities (New)
            """
            CREATE TABLE IF NOT EXISTS api_activity_new (
                id UUID PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                category_id INTEGER REFERENCES api_activitycategory(id),
                status_id INTEGER REFERENCES api_activitystatus_new(id),
                priority_id INTEGER REFERENCES api_activitypriority_new(id),
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                estimated_duration INTEGER NOT NULL,
                actual_duration INTEGER,
                assigned_to VARCHAR(100) NOT NULL,
                assigned_by VARCHAR(100) NOT NULL,
                location VARCHAR(200),
                progress INTEGER DEFAULT 0,
                notes TEXT,
                created_by_id INTEGER REFERENCES auth_user(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                is_active BOOLEAN DEFAULT TRUE
            );
            """,
            
            # News Categories
            """
            CREATE TABLE IF NOT EXISTS api_newscategory (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL,
                display_name VARCHAR(100) NOT NULL,
                icon VARCHAR(10) DEFAULT '📰',
                color VARCHAR(7) DEFAULT '#10B981',
                is_active BOOLEAN DEFAULT TRUE
            );
            """,
            
            # News Status
            """
            CREATE TABLE IF NOT EXISTS api_newsstatus (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) UNIQUE NOT NULL,
                display_name VARCHAR(50) NOT NULL,
                color_bg VARCHAR(7) DEFAULT '#F3F4F6',
                color_text VARCHAR(7) DEFAULT '#374151',
                color_border VARCHAR(7) DEFAULT '#D1D5DB',
                is_active BOOLEAN DEFAULT TRUE
            );
            """,
            
            # News Updates (New)
            """
            CREATE TABLE IF NOT EXISTS api_newsupdate (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                summary TEXT NOT NULL,
                body TEXT NOT NULL,
                category_id INTEGER REFERENCES api_newscategory(id),
                status_id INTEGER REFERENCES api_newsstatus(id),
                author VARCHAR(255) NOT NULL,
                tags JSONB DEFAULT '[]'::jsonb,
                icon VARCHAR(10) DEFAULT '📰',
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                priority INTEGER DEFAULT 0,
                expires_at TIMESTAMP WITH TIME ZONE,
                created_by_id INTEGER REFERENCES auth_user(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                is_active BOOLEAN DEFAULT TRUE
            );
            """
        ]
        
        if not dry_run:
            with connection.cursor() as cursor:
                for sql in sql_statements:
                    cursor.execute(sql)
            self.stdout.write('  ✅ New tables created')
        else:
            self.stdout.write('  🔍 Would create new table structure')

    def _create_default_data(self, dry_run):
        """Create default categories and statuses"""
        self.stdout.write('🎯 Creating default categories and statuses...')
        
        default_data = {
            # Activity Categories
            'activity_categories': [
                ('production', 'Production', '🏭', '#3B82F6'),
                ('maintenance', 'Maintenance', '🔧', '#F59E0B'),
                ('inspection', 'Inspection & Audit', '🔍', '#8B5CF6'),
                ('engineering', 'Engineering', '⚙️', '#06B6D4'),
                ('logistics', 'Logistics', '🚚', '#84CC16'),
                ('quality', 'Quality', '✅', '#10B981'),
                ('meetings', 'Meetings', '👥', '#F97316'),
                ('projects', 'Projects', '📊', '#EF4444'),
                ('training', 'Training', '🎓', '#6366F1'),
                ('admin', 'Admin & Systems', '💼', '#6B7280'),
            ],
            
            # Activity Statuses
            'activity_statuses': [
                ('planned', 'Planned', '#F3F4F6', '#374151', '#D1D5DB'),
                ('in_progress', 'In Progress', '#DBEAFE', '#1E40AF', '#3B82F6'),
                ('completed', 'Completed', '#DCFCE7', '#166534', '#22C55E'),
                ('cancelled', 'Cancelled', '#FEF2F2', '#991B1B', '#EF4444'),
                ('overdue', 'Overdue', '#FEF3C7', '#92400E', '#F59E0B'),
            ],
            
            # Activity Priorities
            'activity_priorities': [
                ('low', 'Low', 1, '#F9FAFB', '#6B7280', '#D1D5DB'),
                ('medium', 'Medium', 2, '#FEF3C7', '#92400E', '#F59E0B'),
                ('high', 'High', 3, '#FEE2E2', '#991B1B', '#EF4444'),
                ('critical', 'Critical', 4, '#FDF2F8', '#831843', '#EC4899'),
            ],
            
            # News Categories
            'news_categories': [
                ('news', 'General News', '📰', '#10B981'),
                ('communication', 'Communication', '📢', '#3B82F6'),
                ('alert', 'Alert', '⚠️', '#EF4444'),
            ],
            
            # News Statuses
            'news_statuses': [
                ('new', 'New', '#DBEAFE', '#1E40AF', '#3B82F6'),
                ('read', 'Read', '#F3F4F6', '#6B7280', '#D1D5DB'),
                ('urgent', 'Urgent', '#FEE2E2', '#991B1B', '#EF4444'),
            ]
        }
        
        if not dry_run:
            with connection.cursor() as cursor:
                # Insert activity categories
                for name, display_name, icon, color in default_data['activity_categories']:
                    cursor.execute("""
                        INSERT INTO api_activitycategory (name, display_name, icon, color)
                        VALUES (%s, %s, %s, %s) ON CONFLICT (name) DO NOTHING
                    """, [name, display_name, icon, color])
                
                # Insert activity statuses
                for name, display_name, color_bg, color_text, color_border in default_data['activity_statuses']:
                    cursor.execute("""
                        INSERT INTO api_activitystatus_new (name, display_name, color_bg, color_text, color_border)
                        VALUES (%s, %s, %s, %s, %s) ON CONFLICT (name) DO NOTHING
                    """, [name, display_name, color_bg, color_text, color_border])
                
                # Insert activity priorities
                for name, display_name, level, color_bg, color_text, color_border in default_data['activity_priorities']:
                    cursor.execute("""
                        INSERT INTO api_activitypriority_new (name, display_name, level, color_bg, color_text, color_border)
                        VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (name) DO NOTHING
                    """, [name, display_name, level, color_bg, color_text, color_border])
                
                # Insert news categories
                for name, display_name, icon, color in default_data['news_categories']:
                    cursor.execute("""
                        INSERT INTO api_newscategory (name, display_name, icon, color)
                        VALUES (%s, %s, %s, %s) ON CONFLICT (name) DO NOTHING
                    """, [name, display_name, icon, color])
                
                # Insert news statuses
                for name, display_name, color_bg, color_text, color_border in default_data['news_statuses']:
                    cursor.execute("""
                        INSERT INTO api_newsstatus (name, display_name, color_bg, color_text, color_border)
                        VALUES (%s, %s, %s, %s, %s) ON CONFLICT (name) DO NOTHING
                    """, [name, display_name, color_bg, color_text, color_border])
            
            self.stdout.write('  ✅ Default data created')
        else:
            self.stdout.write('  🔍 Would create default categories and statuses')

    def _migrate_activities(self, dry_run):
        """Migrate activities from old structure to new structure"""
        self.stdout.write('📋 Migrating activities...')
        
        if dry_run:
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM api_activity")
                count = cursor.fetchone()[0]
            self.stdout.write(f'  🔍 Would migrate {count} activities')
            return count
        
        # Actual migration
        with connection.cursor() as cursor:
            # Get category, status, and priority mappings
            cursor.execute("SELECT id, name FROM api_activitycategory")
            categories = {name: id for id, name in cursor.fetchall()}
            
            cursor.execute("SELECT id, name FROM api_activitystatus_new")
            statuses = {name: id for id, name in cursor.fetchall()}
            
            cursor.execute("SELECT id, name FROM api_activitypriority_new")
            priorities = {name: id for id, name in cursor.fetchall()}
            
            # Migrate activities
            cursor.execute("""
                SELECT 
                    id, title, description, type, status, priority,
                    start_time, end_time, estimated_duration, actual_duration,
                    assigned_to, assigned_by, location, progress, notes,
                    created_by_id, created_at, updated_at
                FROM api_activity 
                WHERE id IS NOT NULL
            """)
            
            migrated_count = 0
            for row in cursor.fetchall():
                (
                    id, title, description, type, status, priority,
                    start_time, end_time, estimated_duration, actual_duration,
                    assigned_to, assigned_by, location, progress, notes,
                    created_by_id, created_at, updated_at
                ) = row
                
                # Map old type to new category
                category_mapping = {
                    'Production': 'production',
                    'Maintenance': 'maintenance',
                    'Inspection & Audit': 'inspection',
                    'Engineering': 'engineering',
                    'Logistics': 'logistics',
                    'Quality': 'quality',
                    'Meetings': 'meetings',
                    'Projects': 'projects',
                    'Training': 'training',
                    'Admin & Systems': 'admin',
                }
                
                category_name = category_mapping.get(type, 'admin')
                category_id = categories.get(category_name, categories['admin'])
                
                # Map status and priority
                status_id = statuses.get(status.replace('-', '_'), statuses['planned'])
                priority_id = priorities.get(priority, priorities['medium'])
                
                # Insert into new table
                cursor.execute("""
                    INSERT INTO api_activity_new (
                        id, title, description, category_id, status_id, priority_id,
                        start_time, end_time, estimated_duration, actual_duration,
                        assigned_to, assigned_by, location, progress, notes,
                        created_by_id, created_at, updated_at, is_active
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s, %s, %s, %s
                    ) ON CONFLICT (id) DO NOTHING
                """, [
                    id, title, description, category_id, status_id, priority_id,
                    start_time, end_time, estimated_duration, actual_duration,
                    assigned_to, assigned_by, location, progress, notes,
                    created_by_id, created_at, updated_at, True
                ])
                
                migrated_count += 1
            
            self.stdout.write(f'  ✅ Migrated {migrated_count} activities')
            return migrated_count

    def _migrate_updates(self, dry_run):
        """Migrate updates/news from old structure to new structure"""
        self.stdout.write('📰 Migrating updates/news...')
        
        if dry_run:
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM api_update")
                count = cursor.fetchone()[0]
            self.stdout.write(f'  🔍 Would migrate {count} updates')
            return count
        
        # Actual migration
        with connection.cursor() as cursor:
            # Get category and status mappings
            cursor.execute("SELECT id, name FROM api_newscategory")
            categories = {name: id for id, name in cursor.fetchall()}
            
            cursor.execute("SELECT id, name FROM api_newsstatus")
            statuses = {name: id for id, name in cursor.fetchall()}
            
            # Migrate updates
            cursor.execute("""
                SELECT 
                    id, type, title, summary, body, timestamp, status,
                    tags, author, icon, priority, expires_at,
                    created_by_id, created_at, updated_at, is_active
                FROM api_update
                WHERE id IS NOT NULL
            """)
            
            migrated_count = 0
            for row in cursor.fetchall():
                (
                    id, type, title, summary, body, timestamp, status,
                    tags, author, icon, priority, expires_at,
                    created_by_id, created_at, updated_at, is_active
                ) = row
                
                # Map type to category
                category_id = categories.get(type, categories['news'])
                status_id = statuses.get(status, statuses['new'])
                
                # Insert into new table
                cursor.execute("""
                    INSERT INTO api_newsupdate (
                        id, title, summary, body, category_id, status_id,
                        author, tags, icon, timestamp, priority, expires_at,
                        created_by_id, created_at, updated_at, is_active
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s
                    ) ON CONFLICT (id) DO NOTHING
                """, [
                    id, title, summary, body, category_id, status_id,
                    author, json.dumps(tags) if tags else '[]', icon, timestamp, priority, expires_at,
                    created_by_id, created_at, updated_at, is_active
                ])
                
                migrated_count += 1
            
            self.stdout.write(f'  ✅ Migrated {migrated_count} updates')
            return migrated_count

    def _create_indexes(self, dry_run):
        """Create indexes for performance"""
        self.stdout.write('🏃‍♀️ Creating performance indexes...')
        
        index_statements = [
            # Activity indexes
            "CREATE INDEX IF NOT EXISTS idx_activity_new_category_status ON api_activity_new(category_id, status_id);",
            "CREATE INDEX IF NOT EXISTS idx_activity_new_status_priority ON api_activity_new(status_id, priority_id);",
            "CREATE INDEX IF NOT EXISTS idx_activity_new_created_by_date ON api_activity_new(created_by_id, created_at);",
            "CREATE INDEX IF NOT EXISTS idx_activity_new_active_start ON api_activity_new(is_active, start_time);",
            "CREATE INDEX IF NOT EXISTS idx_activity_new_assigned_to ON api_activity_new(assigned_to);",
            
            # Update indexes
            "CREATE INDEX IF NOT EXISTS idx_newsupdate_category_status ON api_newsupdate(category_id, status_id);",
            "CREATE INDEX IF NOT EXISTS idx_newsupdate_status_timestamp ON api_newsupdate(status_id, timestamp);",
            "CREATE INDEX IF NOT EXISTS idx_newsupdate_created_by_date ON api_newsupdate(created_by_id, timestamp);",
            "CREATE INDEX IF NOT EXISTS idx_newsupdate_active_timestamp ON api_newsupdate(is_active, timestamp);",
            "CREATE INDEX IF NOT EXISTS idx_newsupdate_priority_timestamp ON api_newsupdate(priority, timestamp);",
        ]
        
        if not dry_run:
            with connection.cursor() as cursor:
                for sql in index_statements:
                    cursor.execute(sql)
            self.stdout.write('  ✅ Performance indexes created')
        else:
            self.stdout.write('  🔍 Would create performance indexes')
