from .models import Profiles
from rest_framework import serializers


class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = [
            "user",
            "profile_id",
            "profile_picture",
            "username",
            "bio",
            "link",
        ]
