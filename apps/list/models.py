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
    profile = models.ForeignKey("profiles.Profiles", on_delete=models.CASCADE)
    pictures = models.ManyToManyField("ListPictures", blank=True)

    # * Fields
    title = models.TextField(max_length=30)
    CATEGORY_CHOICES = [
        ("to-do", "To-Do"),
        ("task", "Task"),
        ("shop", "Shop"),
    ]
    category = models.CharField(
        max_length=10, choices=CATEGORY_CHOICES, null=True, blank=True
    )
    STATUS_CHOICES = [
        ("completed", "Completed"),
        ("progress", "On Progress"),
    ]
    list_status = models.CharField(
        default="progress",
        max_length=10,
        choices=STATUS_CHOICES,
        null=True,
        blank=True,
    )
    pined = models.BooleanField(default=False, null=True, blank=True)
    reminder = models.DateTimeField(null=True, blank=True)
    text = models.TextField(max_length=500, null=True, blank=True)
    private = models.BooleanField(default=False, null=True, blank=True)
    private_pass = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return str(self.list_id)

    def save(self, *args, **kwargs):

        # if self.private:
        #     if len(self.private_pass) < 4:
        #         raise ValidationError("Password needs to be 4 or more characters.")

        #     if self.private_pass is None:
        #         raise ValidationError(
        #             "Can not created a private list without a password"
        #         )
        #     self.private_pass = make_password(self.private_pass)

        super(List, self).save(*args, **kwargs)


# * List Pictures Model
class ListPictures(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    picture_id = models.BigAutoField(primary_key=True)
    list_list = models.ForeignKey(List, on_delete=models.CASCADE)
    picture = models.ImageField(
        upload_to="list/media", height_field="image_height", width_field="image_width"
    )

    def __str__(self):
        return str(self.picture_id)
