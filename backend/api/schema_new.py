# New GraphQL Schema - Clean and Optimized
# This file contains the new streamlined GraphQL types and resolvers

import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User

# Import the new models (for now we'll reference them from the existing models)
# In production, these would replace the existing models
from .models import Activity, Update, ActivityStatus, ActivityPriority
from .models import User as UserProfile


# =====================================================
# User Types
# =====================================================

class UserType(DjangoObjectType):
    """Simplified User type"""
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'is_active')
    
    firstName = graphene.String()
    lastName = graphene.String()
    fullName = graphene.String()
    
    def resolve_firstName(self, info):
        return self.first_name
    
    def resolve_lastName(self, info):
        return self.last_name
    
    def resolve_fullName(self, info):
        return f"{self.first_name} {self.last_name}".strip()


# =====================================================
# Activity Types  
# =====================================================

class ActivityStatusType(DjangoObjectType):
    """Activity status with color information"""
    class Meta:
        model = ActivityStatus
        fields = ('id', 'status', 'display_name', 'color_bg', 'color_text', 'color_border', 'description')
    
    displayName = graphene.String(source='display_name')
    colorBg = graphene.String(source='color_bg')
    colorText = graphene.String(source='color_text')  
    colorBorder = graphene.String(source='color_border')


class ActivityPriorityType(DjangoObjectType):
    """Activity priority with color information"""
    class Meta:
        model = ActivityPriority
        fields = ('id', 'priority', 'display_name', 'color_bg', 'color_text', 'color_border', 'description')
    
    displayName = graphene.String(source='display_name')
    colorBg = graphene.String(source='color_bg')
    colorText = graphene.String(source='color_text')
    colorBorder = graphene.String(source='color_border')


class ActivityType(DjangoObjectType):
    """Streamlined Activity type with optimized field mapping"""
    class Meta:
        model = Activity
        fields = (
            'id', 'title', 'description', 'type', 'status', 'priority',
            'start_time', 'end_time', 'assigned_to', 'assigned_by', 'location',
            'progress', 'estimated_duration', 'actual_duration', 'notes',
            'created_at', 'updated_at', 'created_by'
        )
    
    # Frontend-compatible camelCase fields
    startTime = graphene.String()
    endTime = graphene.String()
    assignedTo = graphene.String(source='assigned_to')
    assignedBy = graphene.String(source='assigned_by')
    estimatedDuration = graphene.Int(source='estimated_duration')
    actualDuration = graphene.Int(source='actual_duration')
    createdAt = graphene.String()
    updatedAt = graphene.String()
    createdBy = graphene.Field(UserType, source='created_by')
    
    # Status and Priority with colors
    statusConfig = graphene.Field(ActivityStatusType)
    priorityConfig = graphene.Field(ActivityPriorityType)
    
    # Additional computed fields
    durationHours = graphene.Float()
    statusDisplay = graphene.String()
    priorityDisplay = graphene.String()
    
    def resolve_startTime(self, info):
        return self.start_time.isoformat() if self.start_time else None
    
    def resolve_endTime(self, info):
        return self.end_time.isoformat() if self.end_time else None
    
    def resolve_createdAt(self, info):
        return self.created_at.isoformat() if self.created_at else None
    
    def resolve_updatedAt(self, info):
        return self.updated_at.isoformat() if self.updated_at else None
    
    def resolve_statusConfig(self, info):
        return self.status_config if hasattr(self, 'status_config') else None
    
    def resolve_priorityConfig(self, info):
        return self.priority_config if hasattr(self, 'priority_config') else None
    
    def resolve_durationHours(self, info):
        duration = self.actual_duration or self.estimated_duration or 0
        return round(duration / 60, 1) if duration else 0
    
    def resolve_statusDisplay(self, info):
        return self.status.replace('_', ' ').title() if self.status else ''
    
    def resolve_priorityDisplay(self, info):
        return self.priority.replace('_', ' ').title() if self.priority else ''


# =====================================================
# Update/News Types
# =====================================================

class UpdateType(DjangoObjectType):
    """Streamlined Update type for news"""
    class Meta:
        model = Update
        fields = (
            'id', 'type', 'title', 'summary', 'body', 'timestamp',
            'status', 'tags', 'author', 'icon', 'is_active', 'priority',
            'expires_at', 'created_at', 'updated_at', 'created_by'
        )
    
    # Frontend-compatible camelCase fields
    isActive = graphene.Boolean(source='is_active')
    expiresAt = graphene.String()
    createdAt = graphene.String()
    updatedAt = graphene.String()
    createdBy = graphene.Field(UserType, source='created_by')
    
    # Additional computed fields
    isExpired = graphene.Boolean()
    timeAgo = graphene.String()
    readingTime = graphene.Int()
    
    def resolve_expiresAt(self, info):
        return self.expires_at.isoformat() if self.expires_at else None
    
    def resolve_createdAt(self, info):
        return self.created_at.isoformat() if self.created_at else None
    
    def resolve_updatedAt(self, info):
        return self.updated_at.isoformat() if self.updated_at else None
    
    def resolve_isExpired(self, info):
        if self.expires_at:
            from django.utils import timezone
            return timezone.now() > self.expires_at
        return False
    
    def resolve_timeAgo(self, info):
        from django.utils import timezone
        from datetime import datetime
        
        now = timezone.now()
        diff = now - self.timestamp
        
        if diff.days > 7:
            return f"{diff.days // 7} week{'s' if diff.days // 7 > 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"
    
    def resolve_readingTime(self, info):
        # Estimate reading time based on word count (200 words per minute)
        word_count = len(self.body.split()) if self.body else 0
        return max(1, round(word_count / 200))


# =====================================================
# Query Class - Optimized Resolvers
# =====================================================

class Query(graphene.ObjectType):
    """Main query class with optimized resolvers"""
    
    # ===== Activity Queries =====
    all_activities = graphene.List(
        ActivityType,
        type_filter=graphene.String(),
        status_filter=graphene.String(),
        priority_filter=graphene.String(),
        assigned_to_filter=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    activity = graphene.Field(ActivityType, id=graphene.String(required=True))
    activities_by_type = graphene.List(ActivityType, type=graphene.String(required=True))
    activities_by_status = graphene.List(ActivityType, status=graphene.String(required=True))
    activities_by_priority = graphene.List(ActivityType, priority=graphene.String(required=True))
    
    # Projects (activities with type="Projects")
    all_projects = graphene.List(
        ActivityType,
        status_filter=graphene.String(),
        priority_filter=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    project = graphene.Field(ActivityType, id=graphene.String(required=True))
    
    # ===== Update/News Queries =====
    all_updates = graphene.List(
        UpdateType,
        type_filter=graphene.String(),
        status_filter=graphene.String(),
        active_only=graphene.Boolean(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    update = graphene.Field(UpdateType, id=graphene.String(required=True))
    news_updates = graphene.List(UpdateType, limit=graphene.Int(), offset=graphene.Int())
    updates_by_type = graphene.List(UpdateType, type=graphene.String(required=True))
    updates_by_status = graphene.List(UpdateType, status=graphene.String(required=True))
    
    # ===== Activity Resolvers =====
    
    def resolve_all_activities(self, info, type_filter=None, status_filter=None, 
                              priority_filter=None, assigned_to_filter=None, 
                              limit=None, offset=None, **kwargs):
        """Optimized resolver for all activities with filtering"""
        queryset = Activity.objects.select_related('status_config', 'priority_config', 'created_by')
        
        # Apply filters
        if type_filter:
            queryset = queryset.filter(type__icontains=type_filter)
        if status_filter:
            queryset = queryset.filter(status__icontains=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority__icontains=priority_filter)
        if assigned_to_filter:
            queryset = queryset.filter(assigned_to__icontains=assigned_to_filter)
        
        # Order by creation date (newest first)
        queryset = queryset.order_by('-created_at')
        
        # Apply pagination
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
            
        return queryset
    
    def resolve_activity(self, info, id, **kwargs):
        """Get single activity by ID"""
        try:
            return Activity.objects.select_related(
                'status_config', 'priority_config', 'created_by'
            ).get(pk=id)
        except Activity.DoesNotExist:
            return None
    
    def resolve_activities_by_type(self, info, type, **kwargs):
        """Get activities filtered by type"""
        return Activity.objects.select_related(
            'status_config', 'priority_config', 'created_by'
        ).filter(type=type).order_by('-created_at')
    
    def resolve_activities_by_status(self, info, status, **kwargs):
        """Get activities filtered by status"""
        return Activity.objects.select_related(
            'status_config', 'priority_config', 'created_by'
        ).filter(status=status).order_by('-created_at')
    
    def resolve_activities_by_priority(self, info, priority, **kwargs):
        """Get activities filtered by priority"""
        return Activity.objects.select_related(
            'status_config', 'priority_config', 'created_by'
        ).filter(priority=priority).order_by('-created_at')
    
    # ===== Project Resolvers =====
    
    def resolve_all_projects(self, info, status_filter=None, priority_filter=None,
                            limit=None, offset=None, **kwargs):
        """Get all projects (activities with type="Projects")"""
        queryset = Activity.objects.select_related(
            'status_config', 'priority_config', 'created_by'
        ).filter(type="Projects")
        
        # Apply filters
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        # Order by creation date
        queryset = queryset.order_by('-created_at')
        
        # Apply pagination
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
            
        return queryset
    
    def resolve_project(self, info, id, **kwargs):
        """Get single project by ID"""
        try:
            return Activity.objects.select_related(
                'status_config', 'priority_config', 'created_by'
            ).get(pk=id, type="Projects")
        except Activity.DoesNotExist:
            return None
    
    # ===== Update/News Resolvers =====
    
    def resolve_all_updates(self, info, type_filter=None, status_filter=None,
                           active_only=True, limit=None, offset=None, **kwargs):
        """Optimized resolver for all updates with filtering"""
        queryset = Update.objects.select_related('created_by')
        
        # Apply filters
        if active_only:
            queryset = queryset.filter(is_active=True)
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Order by priority and timestamp
        queryset = queryset.order_by('-priority', '-timestamp')
        
        # Apply pagination
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
            
        return queryset
    
    def resolve_update(self, info, id, **kwargs):
        """Get single update by ID"""
        try:
            return Update.objects.select_related('created_by').get(pk=id)
        except Update.DoesNotExist:
            return None
    
    def resolve_news_updates(self, info, limit=None, offset=None, **kwargs):
        """Get news updates specifically"""
        queryset = Update.objects.select_related('created_by').filter(
            type=Update.UPDATE_TYPE_NEWS, 
            is_active=True
        ).order_by('-priority', '-timestamp')
        
        # Apply pagination
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
            
        return queryset
    
    def resolve_updates_by_type(self, info, type, **kwargs):
        """Get updates filtered by type"""
        return Update.objects.select_related('created_by').filter(
            type=type, 
            is_active=True
        ).order_by('-priority', '-timestamp')
    
    def resolve_updates_by_status(self, info, status, **kwargs):
        """Get updates filtered by status"""
        return Update.objects.select_related('created_by').filter(
            status=status, 
            is_active=True
        ).order_by('-priority', '-timestamp')


# =====================================================
# Schema Export
# =====================================================

schema = graphene.Schema(query=Query)
