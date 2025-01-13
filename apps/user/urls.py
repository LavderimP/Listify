from django.urls import path, include
from .views import UserActionView


urlpatterns = [
    path(
        "",
        UserActionView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
    ),
    
]
