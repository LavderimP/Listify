from django.urls import path, include
from .views import UserActionView


urlpatterns = [
    path(
        "",
        UserActionView.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="user-actions",
    ),
    path(
        "password/",
        UserActionView.as_view({"put": "password_update"}),
        name="password-update",
    ),
]
