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
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data["password"])  # Hash the password
            user.save()
            return Response(
                {"detail": "User created successfully!"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
