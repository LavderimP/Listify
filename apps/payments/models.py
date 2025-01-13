import uuid

# import stripe
# from django.conf import settings
from django.db import models
from django.urls import reverse

# stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentMethods(models.Model):
    # Profile
    profile = models.ForeignKey('profiles.Profiles', on_delete=models.CASCADE)

    payment_method_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_method_id = models.BigAutoField(primary_key=True)
    payment_method_updated_at = models.DateTimeField(auto_now=True, editable=False)
    payment_method_created_at = models.DateTimeField(auto_now_add=True, editable=False)

    # Stripe payment method id
    pm_id = models.CharField(max_length=50, default="empty")
    payment_method_favorite = models.BooleanField(unique=False)
    last4 = models.IntegerField(blank=True)
    card_brand = models.CharField(max_length=20, blank=True)
    fingerprint = models.CharField(max_length=50, blank=True, unique=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("payment_methods_detail", kwargs={"pk": self.pk})

    # def save(self, *args, **kwargs):
    #     # Create a stripe customer if one does not exist
    #     if not self.pk:
    #             attach_payment_method = stripe.PaymentMethod.attach(
    #                 self.pm_id,
    #                 customer=self.profile.customer_id,
    #             )

    #         pm_dict = dict(attach_payment_method)
    #         self.last4 = pm_dict["card"]["last4"]
    #         self.card_brand = pm_dict["card"]["brand"]
    #         self.fingerprint = pm_dict["card"]["fingerprint"]
    #             first_setup = stripe.SetupIntent.create(
    #                 payment_method_types=["card"],
    #                 payment_method=self.pm_id,
    #                 customer=self.profile.customer_id,
    #             )

    #     if self.payment_method_favorite:
    #             payment_method = payment_methods.objects.filter(profile=self.profile)
    #             payment_method.filter(payment_method_favorite=True).exclude(pk=self.pk).update(
    #                 payment_method_favorite=False
    #             )

    #     return super().save(*args, **kwargs)


class Payments(models.Model):
    # Relationships
    profile = models.ForeignKey('profiles.Profiles', on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethods, on_delete=models.CASCADE)

    payment_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_id = models.BigAutoField(primary_key=True)
    pay_updated_at = models.DateTimeField(auto_now=True, editable=False)
    pay_created_at = models.DateTimeField(auto_now_add=True, editable=False)

    stripe_token = models.CharField(max_length=50, default="empty")
    amount = models.IntegerField(default=1000)
    currency = models.CharField(max_length=20, default="gbp")

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("payment_payments_detail", args=(self.pk))

    # def save(self, *args, **kwargs):
    #     # Create a PaymentIntent with the order amount and currency
    #         payment_intent = stripe.PaymentIntent.create(
    #             amount=self.amount,
    #             currency=self.currency,
    #             customer=self.profile.customer_id,
    #             payment_method=self.payment_method.pm_id,
    #         )

    #     self.stripe_token = payment_intent.id

    #     confirm_payment_intent = stripe.PaymentIntent.confirm(self.stripe_token)

    #     return super().save(*args, **kwargs)
    