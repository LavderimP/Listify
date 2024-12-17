from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import List, ListPictures
from profiles.models import Profiles
from .serializers import ListSerializer
from django.shortcuts import get_object_or_404

# ! To Be Removed
# from rest_framework.permissions import AllowAny


# TODO: List Pictures


# * List Views
class ListViewSet(viewsets.ViewSet):

    # # ! To Be Removed
    # permission_classes = [AllowAny]

    def list(self, request):

        # Use get_object_or_404 to handle the case where the profile does not exist
        user_profile = get_object_or_404(Profiles, user=request.user.id)
        if user_profile is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO: Add the status
        preferred_status = user_profile.preferred_status
        categories = request.query_params.get("categories")

        if categories is None:
            queryset = List.objects.filter(profile=user_profile)
        else:
            queryset = List.objects.filter(profile=user_profile, categories=categories)

        queryset = queryset.order_by("created_at")

        # Use ListSerializer for list view to hide private content
        serializer = ListSerializer(queryset, many=True, context={"list": True})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        user_profile = get_object_or_404(Profiles, user=request.user.id)

        serializer = ListSerializer(data=request.data)
        # pictures = request.FILES.getlist(
        #     "pictures"
        # )  # Use FILES for file uploads and getlist for multiple files

        if serializer.is_valid():
            # Set the profile before saving
            serializer.save(profile=user_profile)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        user_profile = request.user

        if user_profile is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, list_id=pk)

        # Check if the list is private and if the user is the owner
        if queryset.private and queryset.profile.user != user_profile:
            # If private and not owner, return unauthorized
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = ListSerializer(queryset)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def pin(self, request, pk=None):
        user_profile = request.user

        if user_profile is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, list_id=pk)

        # Toggle the pined status
        queryset.pined = not queryset.pined
        queryset.save()

        return Response(status=status.HTTP_200_OK)

    def update(self, request, pk=None):

        user_profile = request.user
        if user_profile is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, list_id=pk)

        # Only allow update if user is the owner
        if queryset.profile.user != request.user:
            return Response(
                {"detail": "You do not have permission to update this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ListSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):

        user_profile = request.user
        if user_profile is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, list_id=pk)

        # Only allow deletion if user is the owner
        if queryset.profile.user != request.user:
            return Response(
                {"detail": "You do not have permission to delete this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
