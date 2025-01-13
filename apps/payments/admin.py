from django.contrib import admin
from .models import PaymentMethods, Payments

class PaymentMethodsManager(admin.ModelAdmin):
    list_display = (
        "pk",
        "user",
        "card_brand",
    )
    list_filter = (
        "user",
        "card_brand",
    )
    search_fields = (
        "pk",
        "user",
        "card_brand",
    )

admin.site.register(PaymentMethods, PaymentMethodsManager)

class PaymentsManager(admin.ModelAdmin):
    list_display = (
        "pk",
        "user",
        "amount",
    )
    list_filter = (
        "user",
        "amount",
    )
    search_fields = (
        "pk",
        "user",
        "amount",
    )

admin.site.register(Payments, PaymentsManager)
