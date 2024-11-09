from .models import Profiles
from rest_framework import serializers
from user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "username"]


class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = [
            "user",
            "profile_id",
            "profile_picture",
            "bio",
            "link",
        ]

    def to_representation(self, instance):
        # Customize the representation of the `user` field
        representation = super().to_representation(instance)
        representation["user"] = UserSerializer(instance.user).data
        return representation
