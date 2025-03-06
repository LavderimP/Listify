from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.views.generic import TemplateView

# * Token
from rest_framework_simplejwt.views import TokenRefreshView
from .token import MyTokenObtainPairView

# * User
from user.views import UserCreateView

urlpatterns = [
    # path("", TemplateView.as_view(template_name="index.html")),
    path("admin/", admin.site.urls),
    path("user/", include("user.urls")),
    path("register/", UserCreateView.as_view({"post": "create"}), name="user_register"),
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("list/", include("list.urls")),
    path("payment/", include("payments.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
