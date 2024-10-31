from django.urls import path, include
from rest_framework import routers
from .views import ListViewSet

router = routers.DefaultRouter()

router.register(r"", ListViewSet, basename="list")

urlpatterns = [
    path(
        "",
        include(router.urls),
    ),
]
