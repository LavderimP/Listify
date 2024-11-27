from django.urls import path, include
from .views import ProfilesView


urlpatterns = [
    path(
        "",
        ProfilesView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
    ),
]
