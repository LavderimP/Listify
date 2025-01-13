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
    "user",
    "profiles",
    "list",
    'payments',
    # Libraries
    "django_extensions",  # this is a Django app adding additional features to Admin panel
    "rest_framework",  # Django Rest Rest Framework for building APIs
    "corsheaders",  # Allow cors requests
    "rest_framework_simplejwt",  # Django restframework simpleJWT for authentication and token
    "rest_framework_simplejwt.token_blacklist",  # Simple JWT blacklist
    "axes",  # Django Axes for login attempts
    'stripe',  # Stripe for payment
    # 'django_rest_passwordreset',  # Django restframework password reset
    # Django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]


# Database

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Custom User

AUTH_USER_MODEL = "user.User"

# Default primary key field type

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "axes.middleware.AxesMiddleware",
]


# * Django backend authentication & Axes
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "axes.backends.AxesBackend",
    # Django ModelBackend is the default authentication backend.
    "django.contrib.auth.backends.ModelBackend",
]

# * Rest_Framework Authentication class
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}


ROOT_URLCONF = "List.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "frontend/build")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "List.wsgi.application"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# * Static files (CSS, JavaScript, Images)


STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "frontend/build/static")]
# STATIC_ROOT = os.path.join(BASE_DIR, "frontend/build/static")

MEDIA_URL = "/media/"
MEDIAFILES_DIRS = [os.path.join(BASE_DIR, "frontend/build/static/media")]
# MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# * Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# * Cors-Headers and CSRF configuration
ALLOWED_HOST = ["https://127.0.0.1:8000", "http://localhost:3000"]
CORS_ALLOW_ALL_ORIGINS = True
# CSRF_COOKIE_DOMAIN = '104.248.170.54'
CORS_ORIGIN_WHITELIST = ["https://127.0.0.1:8000", "http://localhost:3000"]
CSRF_TRUSTED_ORIGINS = ["https://127.0.0.1:8000", "http://localhost:3000"]


# * Axes configuration
AXES_ENABLED = True
AXES_FAILURE_LIMIT = 3
AXES_COOLOFF_TIME = 3  # * hours
AXES_RESET_ON_SUCCESS = True
AXES_ONLY_ADMIN_SITE = True


# * Siple JWT configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=31),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}

# * Email configuration
# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_FILE_PATH = "tmp/email-messages/"
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = "info.giskos@gmail.com"
# EMAIL_HOST_PASSWORD = "kczymevaaqrpekrq"
# DJANGO_REST_LOOKUP_FIELD = "email"


STRIPE_SECRET_KEY  = 'sk_test_51Qeys6BVxag1vjTnNC4IAPW2x0dQSfjRnmiVOeE3X6xgVqtOniQn7BozcqIu7fApK0dWdQUxvOcdym4jQ6J28pVt00VhWvOIw0'
STRIPE_PUBLIC_KEY  = 'pk_test_51Qeys6BVxag1vjTngdQRY5pjlGRhhbedDk986guCnbmOdLqzmFrYhZHU3vEoD7KEIHsqf1iEkXxeNSpXrCMIoWsX00UPTnJ97v'