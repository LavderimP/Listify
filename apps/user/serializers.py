from .models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model. Converts User model instances to JSON format
    and handles serialization/deserialization of user-related data.
    """
    class Meta:
        model = User
        fields = [
            "id",
            "created_at",
            "updated_at",
            "is_active",
            "is_staff",
            "username",
            "fullname",
            "pfp",
            "premium",
            "premium_until",
        ]

    def to_representation(self, instance):
        """
        Custom representation method to format datetime fields into a human-readable format.
        """
        self.fields["created_at"] = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
        self.fields["updated_at"] = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
        self.fields["premium_until"] = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
        return super().to_representation(instance)
