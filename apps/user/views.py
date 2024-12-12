from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer


class UserView(viewsets.ViewSet):
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
