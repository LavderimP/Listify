from django.contrib import admin
from .models import PaymentMethods, Payments

class PaymentMethodsManager(admin.ModelAdmin):
    '''
    Admin configuration for the PaymentMethods model.
    
    This class defines the display, filtering, and search options in the Django admin panel for the PaymentMethods model.
    '''
    list_display = (
        "payment_method_id",  # Display the payment method ID
        "user",               # Display the associated user
        "card_brand",         # Display the card brand (e.g., Visa, MasterCard)
    )
    list_filter = (
        "user",               # Filter PaymentMethods by user
        "card_brand",         # Filter PaymentMethods by card brand
    )
    search_fields = (
        "payment_method_id",  # Search for PaymentMethods by ID
        "user",               # Search for PaymentMethods by user
        "card_brand",         # Search for PaymentMethods by card brand
    )

# Register the PaymentMethods model with the custom manager
admin.site.register(PaymentMethods, PaymentMethodsManager)

class PaymentsManager(admin.ModelAdmin):
    '''
    Admin configuration for the Payments model.
    
    This class defines the display, filtering, and search options in the Django admin panel for the Payments model.
    '''
    list_display = (
        "payment_id",  # Display the payment ID
        "user",        # Display the associated user
        "amount",      # Display the payment amount
    )
    list_filter = (
        "user",        # Filter Payments by user
        "amount",      # Filter Payments by amount
    )
    search_fields = (
        "payment_id",  # Search for Payments by ID
        "user",        # Search for Payments by user
        "amount",      # Search for Payments by amount
    )

# Register the Payments model with the custom manager
admin.site.register(Payments, PaymentsManager)
