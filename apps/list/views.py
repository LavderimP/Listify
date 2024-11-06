from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import List, ListPictures
from profiles.models import Profiles
from .serializers import ListSerializer, ListDetailSerializer
from django.shortcuts import get_object_or_404

# ! To Be Removed
from rest_framework.permissions import AllowAny


# TODO: List Pictures


# * List Views
class ListViewSet(viewsets.ViewSet):

    # ! To Be Removed
    permission_classes = [AllowAny]

    def list(self, request):
        # Use get_object_or_404 to handle the case where the profile does not exist
        user_profile = get_object_or_404(Profiles, user=request.user.id)
        queryset = List.objects.filter(profile=user_profile).order_by("created_at")

        # Use ListSerializer for list view to hide private content
        serializer = ListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        user_profile = get_object_or_404(Profiles, user=request.user.id)

        serializer = ListDetailSerializer(data=request.data)
        # pictures = request.FILES.getlist(
        #     "pictures"
        # )  # Use FILES for file uploads and getlist for multiple files

        if serializer.is_valid():
            # Set the profile before saving
            list_instance = serializer.save(profile=user_profile)

            return Response(
                ListDetailSerializer(list_instance).data, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        list_instance = get_object_or_404(List, list_id=pk)

        # Check if the list is private and if the user is the owner
        if list_instance.private and list_instance.profile.user != request.user:
            # If private and not owner, return limited data
            serializer = ListSerializer(list_instance)
        else:
            # If public or user is owner, return full data
            serializer = ListDetailSerializer(list_instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        list_instance = get_object_or_404(List, list_id=pk)

        # Only allow update if user is the owner
        if list_instance.profile.user != request.user:
            return Response(
                {"detail": "You do not have permission to update this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ListDetailSerializer(list_instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        list_instance = get_object_or_404(List, list_id=pk)

        # Only allow deletion if user is the owner
        if list_instance.profile.user != request.user:
            return Response(
                {"detail": "You do not have permission to delete this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        list_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
