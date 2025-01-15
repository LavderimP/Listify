from django.contrib import admin
from .models import PaymentMethods, Payments

class PaymentMethodsManager(admin.ModelAdmin):
    list_display = (
        "payment_method_id",
        "user",
        "card_brand",
    )
    list_filter = (
        "user",
        "card_brand",
    )
    search_fields = (
        "payment_method_id",
        "user",
        "card_brand",
    )

admin.site.register(PaymentMethods, PaymentMethodsManager)

class PaymentsManager(admin.ModelAdmin):
    list_display = (
        "payment_id",
        "user",
        "amount",
    )
    list_filter = (
        "user",
        "amount",
    )
    search_fields = (
        "payment_id",
        "user",
        "amount",
    )

admin.site.register(Payments, PaymentsManager)
