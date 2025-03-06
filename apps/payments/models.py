import uuid

import stripe
from django.conf import settings
from django.db import models
from django.urls import reverse

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentMethods(models.Model):
    user = models.ForeignKey("user.User", on_delete=models.CASCADE)

    payment_method_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_method_id = models.BigAutoField(primary_key=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    # Stripe payment method id
    pm_id = models.CharField(max_length=50, default="empty")
    last4 = models.CharField(max_length=4, blank=True)
    card_brand = models.CharField(max_length=20, blank=True)
    fingerprint = models.CharField(max_length=50, blank=True, unique=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("payment_methods_detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        # Check if pm_id is valid before calling Stripe API
        if self.pm_id and self.pm_id != "empty":
            try:
                attach_payment_method = stripe.PaymentMethod.attach(
                    self.pm_id,
                    customer=self.user.customer_id,  # Fixed incorrect reference
                )

                pm_dict = dict(attach_payment_method)
                self.last4 = pm_dict["card"]["last4"]
                self.card_brand = pm_dict["card"]["brand"]
                self.fingerprint = pm_dict["card"]["fingerprint"]

                first_setup = stripe.SetupIntent.create(
                    payment_method_types=["card"],
                    payment_method=self.pm_id,
                    customer=self.user.customer_id,
                )

            except stripe.error.StripeError as e:
                print(f"Stripe error: {e}")

        return super().save(*args, **kwargs)


class Payments(models.Model):
    # Relationships
    user = models.ForeignKey("user.User", on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethods, on_delete=models.CASCADE)

    payment_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_id = models.BigAutoField(primary_key=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    stripe_token = models.CharField(max_length=50, default="empty")
    amount = models.IntegerField(default=1000)
    currency = models.CharField(max_length=20, default="gbp")

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("payment_payments_detail", args=(self.pk,))  # Fixed tuple format

    def save(self, *args, **kwargs):
        try:
            # Create a PaymentIntent with the order amount and currency
            payment_intent = stripe.PaymentIntent.create(
                amount=self.amount,
                currency=self.currency,
                customer=self.user.customer_id,  # Fixed incorrect reference
                payment_method=self.payment_method.pm_id,
            )

            self.stripe_token = payment_intent.id

            # Confirm the PaymentIntent
            stripe.PaymentIntent.confirm(self.stripe_token)

        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")

        return super().save(*args, **kwargs)
