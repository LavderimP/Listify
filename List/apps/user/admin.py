from django.contrib import admin
from .models import User


# * User
class UserManager(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "name",
    )
    search_fields = ("id", "username", "name")


admin.site.register(User, UserManager)
