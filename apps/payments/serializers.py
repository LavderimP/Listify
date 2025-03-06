from rest_framework import serializers
from .models import PaymentMethods, Payments


class PaymentMethodsSerializer(serializers.ModelSerializer):
    """
    Serializer for the PaymentMethods model.

    This serializer is responsible for converting PaymentMethods model instances 
    to JSON format and vice versa.

    Fields:
    - `created_at`: Timestamp when the payment method was added (formatted).
    - `updated_at`: Timestamp when the payment method was last updated (formatted).
    - `user`: The user associated with the payment method.
    - `payment_method_id`: Unique identifier for the payment method.
    - `pm_id`: Stripe PaymentMethod ID.
    - `last4`: Last 4 digits of the associated card.
    - `card_brand`: Brand of the card (e.g., Visa, Mastercard).
    - `fingerprint`: Unique fingerprint for identifying the card.

    Extra:
    - Formats `created_at` and `updated_at` to `YYYY-MM-DD HH:MM:SS` for better readability.
    """

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
    """
    Serializer for the Payments model.

    This serializer handles the conversion of Payments model instances 
    to JSON format and back.

    Fields:
    - `created_at`: Timestamp when the payment was made (formatted).
    - `updated_at`: Timestamp when the payment record was last updated (formatted).
    - `user`: The user who made the payment.
    - `payment_id`: Unique identifier for the payment.
    - `stripe_token`: The Stripe PaymentIntent ID used for the transaction.
    - `amount`: Payment amount (stored in smallest currency unit, e.g., cents).
    - `currency`: The currency in which the payment was made (default: GBP).
    - `payment_method`: The payment method used for the transaction.

    Extra:
    - Formats `created_at` and `updated_at` to `YYYY-MM-DD HH:MM:SS` for consistency.
    """

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
