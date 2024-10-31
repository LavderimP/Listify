from .models import List, ListPictures
from rest_framework import serializers
from profiles.models import Profiles


class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = [
            "created_at",
            "profile_id",
            "username",
        ]

    def to_representation(self, instance):
        self.fields["created_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        return super().to_representation(instance)


class ListPicturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListPictures
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["created_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        return super().to_representation(instance)


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = [
            "list_id",
            "created_at",
            "updated_at",
            "title",
            "pictures",
            "categories",
            "text",
            "private",
        ]
        extra_kwargs = {
            "profile": {"required": False},
            "private_pass": {"required": False},
        }

    def create(self, validated_data):
        profile = validated_data.pop("profile", None)
        list_instance = List.objects.create(profile=profile, **validated_data)
        return list_instance

    def to_representation(self, instance):
        if instance.private:
            # Return only limited info for private lists in list view
            return {
                "list_id": instance.list_id,
                "title": instance.title,
                "private": instance.private,
            }

        self.fields["created_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        self.fields["updated_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        self.fields["profile"] = ProfilesSerializer()
        self.fields["pictures"] = ListPicturesSerializer(many=True)
        return super().to_representation(instance)


class ListDetailSerializer(ListSerializer):
    class Meta(ListSerializer.Meta):
        model = List
        fields = ListSerializer.Meta.fields

    def to_representation(self, instance):
        # Always show full content regardless of private status
        self.fields["created_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        self.fields["updated_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        self.fields["profile"] = ProfilesSerializer()
        self.fields["pictures"] = ListPicturesSerializer(many=True)
        return super(ListSerializer, self).to_representation(instance)
