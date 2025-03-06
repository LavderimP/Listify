from django.contrib import admin
from .models import List


# * List Admin Manager
class ListManager(admin.ModelAdmin):
    list_display = (
        "list_id",
        "user",
        "created_at",
        "updated_at",
        "title",
        "category",
        "text",
    )
    list_filter = (
        "user",
        "created_at",
        "updated_at",
        "category",
    )
    search_fields = (
        "list_id",
        "user",
        "created_at",
        "updated_at",
        "title",
        "category",
    )


admin.site.register(List, ListManager)
