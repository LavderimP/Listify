from .models import List
from rest_framework import serializers


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = [
            "created_at",
            "updated_at",
            "list_id",
            "title",
            "category",
            "reminder",
            "pined",
            "text",
        ]
        extra_kwargs = {
            "created_at": {"format": "%Y-%m-%d %H:%M:%S"},
            "updated_at": {"format": "%Y-%m-%d %H:%M:%S"},
            "reminder": {"format": "%Y-%m-%d %H:%M:%S"},
        }
