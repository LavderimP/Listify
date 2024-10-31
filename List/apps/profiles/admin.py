from django.contrib import admin
from .models import Profiles


# * Profiles Admin Manager
class ProfilesManager(admin.ModelAdmin):
    list_display = (
        "profile_id",
        "user",
        "username",
        "bio",
        "link",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at")
    search_fields = ("user", "username", "bio", "link")
    ordering = ("created_at", "updated_at")


admin.site.register(Profiles, ProfilesManager)
