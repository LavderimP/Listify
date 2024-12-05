from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from user.models import User


# * Profile Model
class Profiles(models.Model):
    """Core Fields"""

    # * User
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)

    # * Fields
    profile_id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # * Profile fields
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )

    """App-Specific Fields"""

    STATUS_CHOICES = [
        ("completed", "Completed"),
        ("progress", "On Progress"),
    ]
    preferred_status = models.CharField(
        default="progress",
        max_length=10,
        choices=STATUS_CHOICES,
        null=True,
        blank=True,
    )

    def __str__(self):
        return str(self.profile_id)

    def get_absolute_url(self):
        return reverse("profile_details", args=(self.pk,))

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            profile = Profiles.objects.create(user=instance)
            profile.save()
            print("Profile created")

    @receiver(post_save, sender=User)
    def update_user_profile(sender, instance, created, **kwargs):
        if created == False:
            instance.profiles.save()
            print("Profile updated")

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)
