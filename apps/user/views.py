from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer

class UserCreateView(viewsets.ViewSet):
    """
    API endpoint to handle user registration.
    Allows any user to create an account.
    """
    permission_classes = [AllowAny]  # Open registration

    def create(self, request):
        """
        Handles user creation with password confirmation validation.
        """
        serializer = UserSerializer(data=request.data)
        pass1 = request.data.get("password")
        pass2 = request.data.get("password_confirm")

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
    """
    API endpoints for authenticated users to retrieve, update, delete accounts, and update passwords.
    """
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def retrieve(self, request):
        """
        Retrieve the currently authenticated user's data.
        """
        user = get_object_or_404(User, id=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request):
        """
        Update user data for the authenticated user.
        """
        user = get_object_or_404(User, id=request.user.id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request):
        """
        Delete the authenticated user's account after password verification.
        """
        user = get_object_or_404(User, id=request.user.id)
        password = request.data.get("password")

        if not password:
            return Response(
                {"detail": "No password provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Incorrect Password!"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()  # Deletes the user account
        return Response(
            {"detail": "User account deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )

    def password_update(self, request):
        """
        Allows authenticated users to update their password.
        """
        user = get_object_or_404(User, id=request.user.id)
        old_pass = request.data.get("old_password")
        new_pass = request.data.get("new_password")
        confirm_pass = request.data.get("confirm_password")

        if not old_pass:
            return Response(
                {"detail": "Old Password cannot be empty!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_pass:
            return Response(
                {"detail": "New Password cannot be empty!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm_pass:
            return Response(
                {"detail": "Confirmation Password cannot be empty!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_pass != confirm_pass:
            return Response(
                {"detail": "New Password and Confirmation Password don't match!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(old_pass):
            return Response(
                {"detail": "Incorrect Old Password!"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_pass)
        user.save()

        return Response(
            {"detail": "Password updated successfully!"}, status=status.HTTP_200_OK
        )
