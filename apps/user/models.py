from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.conf import settings
import stripe

# Set Stripe API key using Django settings
stripe.api_key = settings.STRIPE_SECRET_KEY

class CustomUserManager(UserManager):
    """
    Custom manager for the User model, extending Django's UserManager.
    Provides methods to create regular users and superusers.
    """
    def create_user(self, password=None, **extra_fields):
        """
        Creates and saves a regular user with the given password.
        """
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, password, **extra_fields):
        """
        Creates and saves a superuser with the given password.
        """
        user = self.create_user(password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model extending Django's AbstractBaseUser and PermissionsMixin.
    Includes additional fields for profile information and Stripe billing.
    """
    # User manager
    objects = CustomUserManager()

    # Primary key
    id = models.BigAutoField(primary_key=True)
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Account status
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    # Personal information
    username = models.CharField(unique=True, max_length=30, blank=True)
    fullname = models.CharField(max_length=30, blank=True)
    pfp = models.ImageField(
        upload_to="media/pfp/",
        blank=True,
        null=True,
        default="media/pfp/profile_pic.png",
    )
    
    # Premium subscription details
    premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(blank=True, null=True)
    
    # Stripe customer ID
    customer_id = models.CharField(max_length=50, default="empty")

    # Field used for authentication
    USERNAME_FIELD = "username"

    def get_full_name(self):
        """Returns the user's full name."""
        return self.fullname

    def get_short_name(self):
        """Returns the user's username."""
        return self.username

    def __str__(self):
        """Returns a string representation of the user (their username)."""
        return self.username

    def save(self, *args, **kwargs):
        """
        Overriding the save method to automatically create a Stripe customer
        when a new user is created, and activate the user account.
        """
        try:
            new_customer = stripe.Customer.create(email=self.email)
            self.customer_id = new_customer.id
        except stripe.error.StripeError as e:
            print(f"Error creating Stripe customer: {e}")
            
        self.is_active = True
        super().save(*args, **kwargs)

    def __unicode__(self):
        """Returns the primary key of the user."""
        return self.pk
