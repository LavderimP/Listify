from django.contrib import admin
from .models import List, ListPictures


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
        "private",
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


# * List Pictures Admin Manager
class ListPicturesManager(admin.ModelAdmin):
    list_display = ("created_at", "list_list", "picture_id", "picture")
    list_filter = ("created_at", "list_list", "picture_id")
    search_fields = ("created_at", "list_list", "picture_id")


admin.site.register(ListPictures, ListPicturesManager)
