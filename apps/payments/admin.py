from django.contrib import admin
from .models import PaymentMethods, Payments

class PaymentMethodsManager(admin.ModelAdmin):
    list_display = (
        "pk",
        "profile",
        "card_brand",
    )
    list_filter = (
        "profile",
        "card_brand",
    )
    search_fields = (
        "pk",
        "profile",
        "card_brand",
    )

admin.site.register(PaymentMethods, PaymentMethodsManager)

class PaymentsManager(admin.ModelAdmin):
    list_display = (
        "pk",
        "profile",
        "amount",
    )
    list_filter = (
        "profile",
        "amount",
    )
    search_fields = (
        "pk",
        "profile",
        "amount",
    )

admin.site.register(Payments, PaymentsManager)