from .models import List
from rest_framework import serializers

# Serializer for the List model to handle serialization and deserialization of data
class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List  # Specifies the model this serializer is for
        fields = [
            "created_at",  # DateTime field for when the list was created
            "updated_at",  # DateTime field for when the list was last updated
            "list_id",     # Primary key identifier for the list
            "title",       # Title of the list
            "category",    # Category of the list
            "reminder",    # Reminder date for the list (optional)
            "pined",       # Boolean field indicating if the list is pinned
            "text",        # Text field for additional details about the list
        ]
        
        # Custom formatting for certain fields
        extra_kwargs = {
            "created_at": {"format": "%Y-%m-%d %H:%M:%S"},  # Format the created_at field to the given format
            "updated_at": {"format": "%Y-%m-%d %H:%M:%S"},  # Format the updated_at field to the given format
            "reminder": {"format": "%Y-%m-%d %H:%M:%S"},    # Format the reminder field to the given format
        }
