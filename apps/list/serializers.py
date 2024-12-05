from .models import List, ListPictures
from rest_framework import serializers


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
            "created_at",
            "updated_at",
            "list_id",
            "title",
            "pictures",
            "categories",
            "list_status",
            "text",
            "private",
        ]
        extra_kwargs = {
            "private_pass": {"required": False},
        }

    # def create(self, validated_data):
    #     profile = validated_data.pop("profile", None)
    #     list_instance = List.objects.create(profile=profile, **validated_data)
    #     return list_instance

    def to_representation(self, instance):
        if instance.private:
            # Return only limited info for private lists in list view
            return {
                "list_id": instance.list_id,
                "title": instance.title,
                "categories": instance.categories,
                "private": instance.private,
            }

        self.fields["created_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
        self.fields["updated_at"] = serializers.DateTimeField(
            format="%Y-%m-%d %H:%M:%S"
        )
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
        self.fields["pictures"] = ListPicturesSerializer(many=True)
        return super(ListSerializer, self).to_representation(instance)
