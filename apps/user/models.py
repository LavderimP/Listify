from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.conf import settings

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


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
        upload_to="media/pfp/",
        blank=True,
        null=True,
        default="media/pfp/profile_pic.png",
    )
    premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(blank=True, null=True)

    # User billing info
    customer_id = models.CharField(max_length=50, default="empty")

    USERNAME_FIELD = "username"

    def get_full_name(self):
        return self.fullname

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        new_customer = stripe.Customer.create(email=self.email)
        self.customer_id = new_customer.id
        self.is_active = True
        super().save(*args, **kwargs)

    def __unicode__(self):
        return self.pk
