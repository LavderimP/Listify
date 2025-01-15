from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models


class CustomUserManager(UserManager):
    def create_user(self, password=None, **extra_fields):
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, password, **extra_fields):
        user = self.create_user(password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    # User manager
    objects = CustomUserManager()
    # User info fields
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    # User personal info
    username = models.CharField(unique=True, max_length=30, blank=True)
    fullname = models.CharField(max_length=30, blank=True)
    pfp = models.ImageField(
        upload_to="media/pfp/", blank=True, null=True
    )
    premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "username"

    def get_full_name(self):
        return self.fullname

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        self.is_active = True
        super().save(*args, **kwargs)

    def __unicode__(self):
        return self.pk
