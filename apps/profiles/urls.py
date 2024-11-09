from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfilesView

# Initialize the router
router = DefaultRouter()

# Register the ProfilesView
router.register(r"", ProfilesView, basename="profiles")

urlpatterns = [
    path("", include(router.urls)),  # Include all routes from the router
]
