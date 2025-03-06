from django.contrib import admin
from .models import User

# Custom admin manager for the User model
class UserManager(admin.ModelAdmin):
    """
    Admin configuration for the User model.

    - `list_display`: Specifies the fields displayed in the admin list view.
    - `search_fields`: Enables search functionality on the specified fields.
    """

    list_display = ("id", "username", "fullname", "is_active")  # Fields shown in admin panel
    search_fields = ("id", "username", "fullname")  # Searchable fields in the admin panel


# Register the User model with the custom UserManager in Django admin
admin.site.register(User, UserManager)
