from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer


class UserCreateView(viewsets.ViewSet):
    permission_classes = [AllowAny]  # Allow open registration

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        pass1 = request.data["password"]
        pass2 = request.data["password_confirm"]

        if not pass1:
            return Response(
                {"detail": "Password cannot be empty!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not pass2:
            return Response(
                {"detail": "Confirmation Password cannot be empty!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if pass1 != pass2:
            return Response(
                {"detail": "Password and Confirmation Password don't match!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if serializer.is_valid():
            user = serializer.save()
            user.set_password(pass1)  # Hash the password
            user.save()
            return Response(
                {"detail": "User created successfully!"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserActionView(viewsets.ViewSet):
    # TODO Update the pk arg in retreive update and delete (delete needs to be deleted and made with password check)
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users access

    def retrieve(self, request):
        req_user = request.user.id
        user = get_object_or_404(User, user_id=req_user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request):
        req_user = request.user.id
        user = get_object_or_404(User, user_id=req_user)

        if req_user != user.user_id:
            return Response(
                {"detail": "Cannot update someone else's user data."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(        self,
        request,    ):
        req_user = request.user  # Get the authenticated user

        # Get the profile or return 404 if not found
        user = get_object_or_404(User, user=user.user_id)

        if req_user.user_id != user.id:
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
