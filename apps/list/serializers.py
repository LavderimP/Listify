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
            "category",
            "list_status",
            "reminder",
            "pined",
            "private",
            "text",
        ]
        extra_kwargs = {
            "created_at": {"format": "%Y-%m-%d %H:%M:%S"},
            "updated_at": {"format": "%Y-%m-%d %H:%M:%S"},
            "reminder": {"format": "%Y-%m-%d %H:%M:%S"},
            "private_pass": {"required": False},
        }

    # def create(self, validated_data):
    #     profile = validated_data.pop("profile", None)
    #     list_instance = List.objects.create(profile=profile, **validated_data)
    #     return list_instance

    def to_representation(self, instance):

        self.fields["pictures"] = ListPicturesSerializer(many=True)

        list = self.context.get("list")

        if list and instance.private:
            # Return only limited info for private lists in list view
            return {
                "created_at": instance.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "list_id": instance.list_id,
                "title": instance.title,
                "category": instance.category,
                "reminder": instance.reminder,
                "pined": instance.pined,
                "private": instance.private,
            }

        return super().to_representation(instance)
