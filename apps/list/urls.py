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
    # URL pattern to list all lists for the authenticated user
    path("", ListViewSet.as_view({"get": "list"}), name="list_list"),

    # URL pattern to create a new list for the authenticated user
    path("add/", ListViewSet.as_view({"post": "create"}), name="list_create"),

    # URL pattern to retrieve, update, or delete a specific list by its ID
    path(
        "<int:pk>/",
        ListViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"},
        ),
        name="list_detail",
    ),

    # URL pattern to download a list in JSON or Excel format
    path(
        "download/<int:pk>/",
        ListViewSet.as_view({"get": "download"}),
        name="list_download",
    ),
]
