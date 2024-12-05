from django.contrib import admin
from .models import Profiles


# * Profiles Admin Manager
class ProfilesManager(admin.ModelAdmin):
    list_display = (
        "profile_id",
        "user",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at", "profile_id", "user")
    search_fields = ("profile_id", "user")
    ordering = ("created_at", "updated_at")


admin.site.register(Profiles, ProfilesManager)
