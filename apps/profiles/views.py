from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .models import Profiles
from user.models import User
from .serializers import ProfilesSerializer


class ProfilesView(viewsets.ViewSet):
    # TODO Update the pk arg in retreive update and delete (delete needs to be deleted and made with password check)
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users access

    def retrieve(self, request):
        user_id = request.user.id
        profile = get_object_or_404(Profiles, user=user_id)
        serializer = ProfilesSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request):
        user_id = request.user.id
        profile = get_object_or_404(Profiles, user=user_id)

        if user_id != profile.user.id:
            return Response(
                {"detail": "Cannot update someone else's profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProfilesSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(
        self,
        request,
    ):
        user = request.user  # Get the authenticated user

        # Get the profile or return 404 if not found
        profile = get_object_or_404(Profiles, user=user.id)

        if profile.user.id != user.id:
            return Response(
                {"detail": "Cannot delete someone else's profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        password = request.data.get("password")

        if not password:
            return Response(
                {"detail": "No password provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Incorrect Password!"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()  # Deletes the user and cascades to profile
        return Response(
            {"detail": "User account and associated profile deleted"},
            status=status.HTTP_204_NO_CONTENT,
        )
