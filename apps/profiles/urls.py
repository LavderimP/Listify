from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfilesView

router = DefaultRouter()

router.register(r"", ProfilesView, basename="profiles")

urlpatterns = [
    path("", include(router.urls)),
]
