from django.urls import path, include
from rest_framework import routers
from .views import ListViewSet

# router = routers.DefaultRouter()

# router.register(r"", ListViewSet, basename="list")

urlpatterns = [
    # path(
    #     "",
    #     include(router.urls),
    # ),
    path("", ListViewSet.as_view({"get": "list"}, name="list_list")),
    path("add/", ListViewSet.as_view({"post": "create"}, name="list_create")),
    path(
        "<int:pk>/",
        ListViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}, name="list_RUD"
        ),
    ),
]
