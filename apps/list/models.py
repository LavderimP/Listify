from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password


# * List Model
class List(models.Model):
    # * Meta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    list_id = models.BigAutoField(primary_key=True)

    # * Relationships
    user = models.ForeignKey("user.User", on_delete=models.CASCADE)

    # * Fields
    title = models.TextField(max_length=30)
    CATEGORY_CHOICES = [
        ("personal", "Personal"),
        ("work", "Work"),
        ("home", "Home"),
        ("books", "Books"),
        ("article", "Article"),
        ("list", "List"),
    ]
    category = models.CharField(
        max_length=10, choices=CATEGORY_CHOICES, null=True, blank=True
    )
    pined = models.BooleanField(default=False, null=True, blank=True)
    reminder = models.DateTimeField(null=True, blank=True)
    text = models.TextField(max_length=800, null=True, blank=True)

    def __str__(self):
        return str(self.list_id)


class ListDownloads(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    download_id = models.BigAutoField(primary_key=True)
    list_list = models.ForeignKey(List, on_delete=models.CASCADE)

    name = models.CharField(max_length=100, blank=True, null=True)
    qr_code = models.ImageField(
        upload_to="list/media",
        height_field="image_height",
        width_field="image_width",
        blank=True,
        null=True,
    )
    file_suffix = models.CharField(max_length=10)
    download = models.FileField(upload_to="list/downloads")

    def __str__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        self.name = self.list_list.title
        super(ListDownloads, self).save(*args, **kwargs)
