from django.contrib import admin
from .models import List, ListPictures


# * List Admin Manager
class ListManager(admin.ModelAdmin):
    list_display = (
        "list_id",
        "profile",
        "created_at",
        "updated_at",
        "title",
        "private",
        "categories",
        "text",
    )
    list_filter = ("profile", "created_at", "updated_at")
    search_fields = ("list_id", "profile", "created_at", "updated_at", "title")


admin.site.register(List, ListManager)


# * List Pictures Admin Manager
class ListPicturesManager(admin.ModelAdmin):
    list_display = ("created_at", "list_list", "picture_id", "picture")
    list_filter = ("created_at", "list_list", "picture_id")
    search_fields = ("created_at", "list_list", "picture_id")


admin.site.register(ListPictures, ListPicturesManager)
