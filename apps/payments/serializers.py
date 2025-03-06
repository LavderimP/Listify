from rest_framework import serializers
from .models import PaymentMethods, Payments


class PaymentMethodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethods
        fields = [
            "created_at",
            "updated_at",
            "user",
            "payment_method_id",
            "pm_id",
            "last4",
            "card_brand",
            "fingerprint",
        ]
        extra_kwargs = {
            "created_at": {"format": "%Y-%m-%d %H:%M:%S"},
            "updated_at": {"format": "%Y-%m-%d %H:%M:%S"},
        }


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payments
        fields = [
            "created_at",
            "updated_at",
            "user",
            "payment_id",
            "stripe_token",
            "amount",
            "currency",
            "payment_method",
        ]
        extra_kwargs = {
            "created_at": {"format": "%Y-%m-%d %H:%M:%S"},
            "updated_at": {"format": "%Y-%m-%d %H:%M:%S"},
        }
