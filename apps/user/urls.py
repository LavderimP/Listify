from django.urls import path, include
from .views import UserActionView

# URL patterns for user actions and password updates
urlpatterns = [
    path(
        "",
        UserActionView.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="user-actions",  # Handles retrieval, update, and deletion of user data
    ),
    path(
        "password/",
        UserActionView.as_view({"put": "password_update"}),
        name="password-update",  # Handles password update for authenticated users
    ),
]
