from django.urls import path, include
from .views import PaymentMethodsViewSet, PaymentsViewSet

urlpatterns = [
    # Payment Methods URL patterns
    path(
        "", 
        PaymentMethodsViewSet.as_view({"get": "list", "post": "create"}), 
        name="payment_methods_list"
    ),
    path(
        "<int:pk>/", 
        PaymentMethodsViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), 
        name="payment_methods_detail"
    ),
    
    # Payments URL patterns
    path(
        "payments/", 
        PaymentsViewSet.as_view({"get": "list", "post": "create"}), 
        name="payments_list"
    ),
    path(
        "payments/<int:pk>/", 
        PaymentsViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), 
        name="payments_detail"
    ),
]
