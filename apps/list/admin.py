from django.contrib import admin
from .models import List

# * List Admin Manager: Customizes how the List model is displayed in the Django admin interface
class ListManager(admin.ModelAdmin):
    # * Fields to display in the list view of the admin interface
    list_display = (
        "list_id",       # The unique ID of the list
        "user",          # The user who owns the list
        "created_at",    # The timestamp when the list was created
        "updated_at",    # The timestamp when the list was last updated
        "title",         # The title of the list
        "category",      # The category assigned to the list
        "text",          # The additional text or description of the list
    )
    
    # * Fields to filter the list by in the admin interface
    list_filter = (
        "user",          # Filter by user
        "created_at",    # Filter by creation date
        "updated_at",    # Filter by update date
        "category",      # Filter by category
    )
    
    # * Fields to search in the admin interface
    search_fields = (
        "list_id",       # Search by list ID
        "user",          # Search by user
        "created_at",    # Search by creation date
        "updated_at",    # Search by update date
        "title",         # Search by title
        "category",      # Search by category
    )

# Register the List model with the custom ListManager for the admin interface
admin.site.register(List, ListManager)
