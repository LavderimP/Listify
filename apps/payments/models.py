import uuid
import stripe
from django.conf import settings
from django.db import models
from django.urls import reverse

# Set Stripe API key from settings
stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentMethods(models.Model):
    """
    Stores payment methods for users. Each payment method is linked to a Stripe PaymentMethod.

    Fields:
    - `user`: ForeignKey linking the payment method to a user.
    - `payment_method_uuid`: A UUID for additional unique identification.
    - `payment_method_id`: Primary key (BigAutoField).
    - `updated_at`: Timestamp for when the record was last updated.
    - `created_at`: Timestamp for when the record was created.
    - `pm_id`: Stripe PaymentMethod ID.
    - `last4`: Last 4 digits of the card.
    - `card_brand`: Card brand (e.g., Visa, Mastercard).
    - `fingerprint`: Unique fingerprint for the card.

    Methods:
    - `get_absolute_url()`: Returns the URL for the payment method detail page.
    - `save()`: Calls Stripe API to attach the payment method to the user and store relevant details.
    """

    user = models.ForeignKey("user.User", on_delete=models.CASCADE)
    payment_method_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_method_id = models.BigAutoField(primary_key=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    # Stripe payment method details
    pm_id = models.CharField(max_length=50, default="empty")
    last4 = models.CharField(max_length=4, blank=True)
    card_brand = models.CharField(max_length=20, blank=True)
    fingerprint = models.CharField(max_length=50, blank=True, unique=True)

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        """Returns the absolute URL for this payment method."""
        return reverse("payment_methods_detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        """
        Overrides the save method to attach the payment method to the user's Stripe account
        and retrieve card details from Stripe.
        """
        if self.pm_id and self.pm_id != "empty":
            try:
                # Attach payment method to user’s Stripe customer ID
                attach_payment_method = stripe.PaymentMethod.attach(
                    self.pm_id, customer=self.user.customer_id
                )

                pm_dict = dict(attach_payment_method)
                self.last4 = pm_dict["card"]["last4"]
                self.card_brand = pm_dict["card"]["brand"]
                self.fingerprint = pm_dict["card"]["fingerprint"]

                # Create a SetupIntent to confirm the payment method
                stripe.SetupIntent.create(
                    payment_method_types=["card"],
                    payment_method=self.pm_id,
                    customer=self.user.customer_id,
                )

            except stripe.error.StripeError as e:
                print(f"Stripe error: {e}")

        return super().save(*args, **kwargs)


class Payments(models.Model):
    """
    Stores payment transactions made by users.

    Fields:
    - `user`: ForeignKey linking the payment to a user.
    - `payment_method`: ForeignKey linking the payment to a stored payment method.
    - `payment_uuid`: A UUID for additional unique identification.
    - `payment_id`: Primary key (BigAutoField).
    - `updated_at`: Timestamp for when the record was last updated.
    - `created_at`: Timestamp for when the record was created.
    - `stripe_token`: Stores the Stripe PaymentIntent ID.
    - `amount`: Payment amount (in smallest currency unit, e.g., cents).
    - `currency`: Payment currency (default: GBP).

    Methods:
    - `get_absolute_url()`: Returns the URL for the payment detail page.
    - `save()`: Calls Stripe API to create and confirm a payment.
    """

    user = models.ForeignKey("user.User", on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethods, on_delete=models.CASCADE)

    payment_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_id = models.BigAutoField(primary_key=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    stripe_token = models.CharField(max_length=50, default="empty")
    amount = models.IntegerField(default=1000)  # Stored in smallest currency unit (e.g., cents)
    currency = models.CharField(max_length=20, default="gbp")

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        """Returns the absolute URL for this payment record."""
        return reverse("payment_payments_detail", args=(self.pk,))

    def save(self, *args, **kwargs):
        """
        Overrides the save method to create and confirm a payment via Stripe API.
        """
        try:
            # Create a PaymentIntent with the order amount and currency
            payment_intent = stripe.PaymentIntent.create(
                amount=self.amount,
                currency=self.currency,
                customer=self.user.customer_id,
                payment_method=self.payment_method.pm_id,
            )

            # Store the generated Stripe PaymentIntent ID
            self.stripe_token = payment_intent.id

            # Confirm the PaymentIntent
            stripe.PaymentIntent.confirm(self.stripe_token)

        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")

        return super().save(*args, **kwargs)
