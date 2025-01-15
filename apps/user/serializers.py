from .models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'created_at',
            'updated_at',
            'is_active',
            'is_staff',
            'username',
            'fullname',
            'pfp',
            'premium',
            'premium_until',
        ]

    


