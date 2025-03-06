import os, sys
from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, os.path.join(BASE_DIR, "apps"))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-$zumk#$_va7nc3)v6s9gp*81qun)8a+xv5g^4$y&j6c8gldv8c"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Application definition
INSTALLED_APPS = [
    # Our apps
    "user",            # Custom user app
    "list",            # List app
    "payments",        # Payment handling app
    # Libraries
    "django_extensions",  # Django app for additional features in the Admin panel
    "rest_framework",  # Django Rest Framework for building APIs
    "corsheaders",     # Handle CORS headers for cross-origin requests
    "rest_framework_simplejwt",  # JWT authentication for APIs
    "rest_framework_simplejwt.token_blacklist",  # Blacklist tokens for security
    "axes",            # Django Axes for managing failed login attempts
    "stripe",          # Stripe integration for payment processing
    # Django apps
    "django.contrib.admin",  # Admin panel for the Django app
    "django.contrib.auth",   # Django authentication system
    "django.contrib.contenttypes",  # Content type framework for models
    "django.contrib.sessions",  # Session framework for request/response cycle
    "django.contrib.messages",  # Message framework for notifications
    "django.contrib.staticfiles",  # Static files handling
]

# Database configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",  # SQLite database
        "NAME": BASE_DIR / "db.sqlite3",  # Path to the SQLite database
    }
}

# Custom user model
AUTH_USER_MODEL = "user.User"

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Middleware for handling various requests/responses
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Handles CORS headers
    "django.middleware.security.SecurityMiddleware",  # Provides security enhancements
    "django.contrib.sessions.middleware.SessionMiddleware",  # Manages sessions
    "django.middleware.common.CommonMiddleware",  # Handles common functionality
    "django.middleware.csrf.CsrfViewMiddleware",  # Prevents CSRF attacks
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Manages user authentication
    "django.contrib.messages.middleware.MessageMiddleware",  # Handles messages
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Prevents clickjacking
    "django.middleware.common.CommonMiddleware",  # Handles common functionality
    "axes.middleware.AxesMiddleware",  # Protects against brute-force login attempts
]

# Authentication backends, used for login attempts
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",  # Backend for handling Axes authentication
    "axes.backends.AxesBackend",  # Default Axes authentication backend
    "django.contrib.auth.backends.ModelBackend",  # Default Django authentication backend
]

# Django REST Framework authentication settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",  # JWT token-based authentication
        "rest_framework.authentication.SessionAuthentication",  # Session-based authentications
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),  # Requires authentication for all views
}

ROOT_URLCONF = "List.urls"  # Root URL configuration

# Templates settings
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",  # Use Django template engine
        "DIRS": [os.path.join(BASE_DIR, "frontend/build")],  # Path to the frontend build directory for static files
        "APP_DIRS": True,  # Allow app-specific templates
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",  # Debug context processor
                "django.template.context_processors.request",  # Request context processor
                "django.contrib.auth.context_processors.auth",  # Authentication context processor
                "django.contrib.messages.context_processors.messages",  # Message context processor
            ],
        },
    },
]

WSGI_APPLICATION = "List.wsgi.application"  # WSGI application for deployment

# Password validation settings
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},  # Checks password similarity with user attributes
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},  # Enforces minimum password length
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},  # Prevents common passwords
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},  # Prevents numeric-only passwords
]

# Internationalization settings
LANGUAGE_CODE = "en-us"  # Set the language to English
TIME_ZONE = "UTC"  # Set timezone to UTC
USE_I18N = True  # Enable internationalization
USE_TZ = True  # Enable timezone-aware datetime

# Static files configuration
STATIC_URL = "/static/"  # URL for serving static files
STATICFILES_DIRS = [os.path.join(BASE_DIR, "frontend/build/static")]  # Path to static files
MEDIA_URL = "/media/"  # URL for serving media files
MEDIAFILES_DIRS = [os.path.join(BASE_DIR, "frontend/build/static/media")]  # Path to media files

# CORS and CSRF settings
ALLOWED_HOST = ["https://127.0.0.1:8000", "http://localhost:3000"]  # Allowed hosts for CORS requests
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins for CORS
CORS_ORIGIN_WHITELIST = ["https://127.0.0.1:8000", "http://localhost:3000"]  # CORS origin whitelist
CSRF_TRUSTED_ORIGINS = ["https://127.0.0.1:8000", "http://localhost:3000"]  # CSRF trusted origins

# Axes configuration to protect against brute force attacks
AXES_ENABLED = True
AXES_FAILURE_LIMIT = 3  # Allow only 3 failed login attempts before locking out the user
AXES_COOLOFF_TIME = 3  # Cooldown period in hours after failed login attempts
AXES_RESET_ON_SUCCESS = True  # Reset failed attempts counter on successful login
AXES_ONLY_ADMIN_SITE = True  # Limit Axes to the Django admin site

# Simple JWT (JSON Web Token) configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),  # Access token lifetime
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1.5),  # Refresh token lifetime
    "ROTATE_REFRESH_TOKENS": True,  # Rotate refresh tokens after use
    "BLACKLIST_AFTER_ROTATION": True,  # Blacklist refresh token after rotation
    "UPDATE_LAST_LOGIN": False,  # Do not update the last login field on login
    "ALGORITHM": "HS256",  # Algorithm used for encoding tokens
    "VERIFYING_KEY": None,  # Key to verify tokens (set if needed)
    "AUDIENCE": None,  # Audience of the tokens (optional)
    "ISSUER": None,  # Issuer of the tokens (optional)
    "JWK_URL": None,  # URL to fetch JWK (JSON Web Key) for verifying JWTs
    "LEEWAY": 0,  # Leeway for validating token expiry
    "AUTH_HEADER_TYPES": ("Bearer",),  # Accepted authorization header types
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",  # Name of the authorization header
    "USER_ID_FIELD": "id",  # User ID field for the token
    "USER_ID_CLAIM": "user_id",  # Claim name for user ID in the token
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",  # Default user authentication rule
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),  # Token class to use for authentication
    "TOKEN_TYPE_CLAIM": "token_type",  # Claim name for token type
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",  # User class associated with the token
    "JTI_CLAIM": "jti",  # Claim for JWT ID
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",  # Claim for sliding token refresh expiry
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),  # Sliding token lifetime
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),  # Sliding token refresh lifetime
}

# Stripe payment configuration
STRIPE_SECRET_KEY = "sk_test_51Qeys6BVxag1vjTnNC4IAPW2x0dQSfjRnmiVOeE3X6xgVqtOniQn7BozcqIu7fApK0dWdQUxvOcdym4jQ6J28pVt00VhWvOIw0"  # Secret key for Stripe API
STRIPE_PUBLIC_KEY = "pk_test_51Qeys6BVxag1vjTngdQRY5pjlGRhhbedDk986guCnbmOdLqzmFrYhZHU3vEoD7KEIHsqf1iEkXxeNSpXrCMIoWsX00UPTnJ97v"  # Public key for Stripe API
