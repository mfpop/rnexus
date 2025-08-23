from django.urls import include, path

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet)
router.register(r"activities", views.ActivityViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"milestones", views.MilestoneViewSet)
router.register(r"checklists", views.ChecklistViewSet)
router.register(r"checklist-items", views.ChecklistItemViewSet)
router.register(r"time-logs", views.TimeLogViewSet)
router.register(r"attachments", views.AttachmentViewSet)
router.register(r"comments", views.CommentViewSet)
router.register(r"project-team-members", views.ProjectTeamMemberViewSet)
router.register(r"activity-participants", views.ActivityParticipantViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # Custom activity action URLs
    path(
        "activities/<str:activity_id>/start/",
        views.activity_start_view,
        name="activity-start",
    ),
    path(
        "activities/<str:activity_id>/pause/",
        views.activity_pause_view,
        name="activity-pause",
    ),
    path(
        "activities/<str:activity_id>/complete/",
        views.activity_complete_view,
        name="activity-complete",
    ),
]
