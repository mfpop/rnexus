from django.urls import path

from . import views

urlpatterns = [
    path("profile/", views.profile_view, name="profile"),
    path("profile/download-cv/", views.download_cv_view, name="download-cv"),
    path("change-password/", views.change_password_view, name="change-password"),
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
    # Contact form endpoint
    path("contact/", views.contact_submit_view, name="contact-submit"),
]
