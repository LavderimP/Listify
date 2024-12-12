from django.contrib import admin
from .models import User


# * User
class UserManager(admin.ModelAdmin):
    list_display = ("id", "username", "fullname", "is_active")
    search_fields = ("id", "username", "fullname")


admin.site.register(User, UserManager)
