from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models


class CustomUserManager(UserManager):
    def create_user(self, password=None, **extra_fields):  # email
        # if not email:
        #     raise ValueError("Users must have an email address")
        # user = self.model(email=self.normalize_email(email), **extra_fields)
        user = self.model(**extra_fields)
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, password, **extra_fields):  # email,
        user = self.create_user(password, **extra_fields)  # email,
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    # User model
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    objects = CustomUserManager()
    # Personal info
    username = models.CharField(unique=True, max_length=30, blank=True)
    # email = models.EmailField(unique=True)
    name = models.CharField(max_length=30, blank=True)
    # confirmation_code = models.CharField(max_length=4, blank=True)
    # code_expires = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "username"
    # REQUIRED_FIELDS = ["email"]

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.username

    def __unicode__(self):
        return self.pk
